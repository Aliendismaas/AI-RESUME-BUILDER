import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import Resume from '../models/Resume.js'

const generateToken = (userId) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token
}

//API controller for user registration
// POST: /api/user/register

export const registerUser = async (req, res) =>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({message:"Missing required fields"})
        }

        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = User.create({
            name, email, password: hashedPassword
        })

        const token=generateToken(newUser._id)
        newUser.password = undefined


        return res.status(201).json({message:"user registered successfully", token, user: newUser})


    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

//API controller for user login
// POST: /api/user/login 


export const loginUser = async (req, res)=>{

    try {
        const {email, password} = req.body

        const user =await User.findOne({email})

        if(!user){
            return res.status(400).json({message: "Invalid email address"})
        }

        if(!user.comparePassword(password)){
            return res.status(400).json({message: "Invalid Password"})
        }

        const token = generateToken(user._id)
        user.password = undefined

        return res.status(200).json({message:'Login Successful!', token, user})
    } catch (error) {
         return res.status(400).json({message: error.message})
    }

    
}


//API controller for getting user data
// POST: /api/user/data 
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId

        const user = await User.find({userId})

        if(!user){
            return res.status(404).json({message: "User not Found"})
        }

        user.password = undefined
        return res.status(200).json({user})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


//API controller for getting user resume
// POST: /api/user/resume 

export const getUserResumes = async(req, res) => {
    try {
        const userId = req.userId

        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}