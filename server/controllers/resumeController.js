import fs from 'fs'
import ImageKit from "@imagekit/nodejs"
import Resume from "../models/Resume.js"
import imageKit from "../configs/imageKit.js"

//API controller to create a new resume
//POST api/resumes/create
export const createResume = async (req, res) =>{
    try {
        const userId = req.userId
        const {title} = req.body

        const newResume = await Resume.create({userId, title})

        return res.status(201).json({message: "Resume Created Successfully!", resume: newResume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}



//API controller to delete a resume
//POST api/resumes/delete
export const deleteResume = async (req, res) =>{
    try {
        const userId = req.userId
        const {resumeId} = req.params

        await Resume.findOneAndDelete({userId, _id: resumeId})

        return res.status(200).json({message: "Resume Deleted Successfully!"})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//API controller to get resume by id
//POST api/resumes/get

export const getResumeById = async (req, res) =>{
    try {
        const userId = req.userId
        const {resumeId} = req.params

        const resume = await Resume.findOne({userId, _id: resumeId})

        if(!resume){
            return res.status(404).json({message: "Resume Not Found!"})
        }

        resume.__v = undefined;
        resume.createdAt= undefined;
        resume.updatedAt= undefined;

        return res.status(200).json({resume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


//API controller to get resume by id public
//POST api/resumes/public

export const getPublicResumeById = async (req, res) => {
    try {
        const {resumeId} = req.params
        const resume = await Resume.findOne({public: true, _id: resumeId})

        if(!resume){
            return res.status(404).json({message: "Resume Not Found"})
        }

        return res.status(200).json({resume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//API controller to update resume

export const updateResume = async (req, res) =>{
    try {
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body
        const image = req.file;

        let resumeDataCopy;
        if(typeof resumeData === 'string'){  // Fixed: was resumeDataCopy
            resumeDataCopy = JSON.parse(resumeData)  // Fixed: removed await (JSON.parse is synchronous)
        }else{
            resumeDataCopy = structuredClone(resumeData)
        }

        if(image){
            const imageBufferData = fs.createReadStream(image.path)

            const response = await imageKit.files.upload({
                file: imageBufferData,
                fileName: 'resume.jpg',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75'+(removeBackground ? ',e-bgremove':'')
                }
            });

            resumeDataCopy.personal_info.image = response.url
        }
        
        // Fixed: removed the filter object, just use resumeId
        // Also verify userId matches for security
        const resume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId }, 
            resumeDataCopy, 
            { new: true }
        )

        if(!resume){
            return res.status(404).json({message: "Resume not found or unauthorized"})
        }

        return res.status(200).json({message:"resume saved successfully!", resume})
    } catch (error) {
        console.error("Update error:", error); // Add logging
        return res.status(400).json({message: error.message})
    }
}