import React, { useEffect } from 'react'
import {Link, useParams} from 'react-router-dom'
import {dummyResumeData} from '../assets/assets'
import {ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import PersonalInfoForm from '../Components/PersonalInfoForm'
import ResumePreview from '../Components/ResumePreview'
import TemplateSelector from '../Components/TemplateSelector'
import ColorPicker from '../Components/ColorPicker'
import ProfessionalSummaryForm from '../Components/ProfessionalSummaryForm'
import ExperienceForm from '../Components/ExperienceForm'
import EducationForm from '../Components/EducationForm'
import ProjectsForm from '../Components/ProjectsForm'
import SkillsForm from '../Components/SkillsForm'
import api from '../configs/api'
import { useSelector } from 'react-redux'

import toast from 'react-hot-toast'
const ResumeBuilder = () => {

  const { resumeId } = useParams()
  const { token } = useSelector(state => state.auth) // Add this line to get token

  const [resumeData, setResumeData] = useState({
  _id: "",
  title: "",
  personal_info: {},
  professional_summary: "",
  experience: [],
  education: [],
  project: [],
  skills: [],
  template: "classic",
  accent_color: "#3B82F6",
  public: false
});



const [activeSectionIndex, setActiveSectionIndex] = useState(0);
const [removeBackground, setRemoveBackground] = useState(false);

const sections = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "summary",   name: "Summary",       icon: FileText },
  { id: "experience", name: "Experience",   icon: Briefcase },
  { id: "education",  name: "Education",    icon: GraduationCap },
  { id: "projects",   name: "Projects",     icon: FolderIcon },
  { id: "skills",     name: "Skills",       icon: Sparkles },
];

const activeSection = sections[activeSectionIndex];
const loadExistingResume = async () => {
  try {
    const {data} = await api.get('/api/resumes/get/' + resumeId, {headers: {Authorization: token}})
    if(data.resume){
      setResumeData(data.resume)
      document.title = data.resume.title
    }
  } catch (error) {
      console.log(error.message);
      
  }
};

useEffect(()=>{
  loadExistingResume();
},[])



const changeResumeVisibility = async () => {
  try {
    const formData = new FormData();
    formData.append("resumeId", resumeId);
    formData.append(
      "resumeData",
      JSON.stringify({ public: !resumeData.public })
    );

    const { data } = await api.put('/api/resumes/update', formData, {
      headers: {
        Authorization: token
      }
    });

    setResumeData({ ...resumeData, public: !resumeData.public });
    toast.success(data.message);
  } catch (error) {
    console.error("Error saving resume:", error);
  }
};
  
const saveResume = async () => {
  const formData = new FormData();
  let updatedResumeData = structuredClone(resumeData)
  formData.append("resumeId", resumeId);
  formData.append("resumeData", JSON.stringify(updatedResumeData));

  // Add removeBackground flag only if true
  removeBackground && formData.append("removeBackground", "yes");

  // Append image only if it's a new File/Blob (not a string URL)
  if (
    resumeData.personal_info.image &&
    typeof resumeData.personal_info.image === "object"
  ) {
    formData.append("image", resumeData.personal_info.image);
  }

  try {
    const { data } = await api.put("/api/resumes/update", formData, {
      headers: {
        Authorization: token,
        // Don't set Content-Type → browser sets correct multipart boundary automatically
      },
    });

    setResumeData(data.resume);
    toast.success(data.message);
  } catch (error) {
    console.error("Error updating resume:", error);
    toast.error(
      error.response?.data?.message || "Failed to save resume. Please try again."
    );
  }
};



const handleShare = async () => {
  const frontendUrl = window.location.origin; // Use origin instead of splitting
  const resumeUrl = `${frontendUrl}/view/${resumeId}`;

  // Check if Web Share API is supported
  if (navigator.share) {
    try {
      await navigator.share({
        title: resumeData.title || 'My Resume',
        text: 'Check out my resume!',
        url: resumeUrl
      });
      console.log('Share successful');
    } catch (error) {
      // User cancelled the share or an error occurred
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard(resumeUrl);
      }
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    copyToClipboard(resumeUrl);
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  } catch (error) {
    // Ultimate fallback - show the URL
    prompt('Copy this link:', text);
  }
};

const downloadResume = ()=>{
  window.print()
}
  return (
    <div>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <Link to={'/app'} className='inline-flex gap-2 items-center  text-slate-500 hover:text-slate-700 transition-all '>
            <ArrowLeftIcon className='size-4' /> Back to Dashboard
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Panel - Form */}
            <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
                <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
                <hr className="absolute top-0 left-0 h-1 bg-linear-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
                    style={{ width: `${(activeSectionIndex * 100) / (sections.length - 1)}%` }} />

                    {/* Section Navigation */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                
                <div className='flex justify-between gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({...prev, template}))} />
                    <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({...prev, accent_color: color}))} />
                </div> {/* spacer – left side empty */}

              <div className="flex items-center">
                {/* Previous Button */}
                  <button
                onClick={() => setActiveSectionIndex((prevIndex) => 
                  Math.max(prevIndex - 1, 0)
                )}
                disabled={activeSectionIndex === 0}
                className={`flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all px-4 py-2 ${
                  activeSectionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                          >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>

                  {/* Next Button (the one that was cut off in the screenshot) */}
                  <button
                    onClick={() => setActiveSectionIndex((prevIndex) =>
                      Math.min(prevIndex + 1, sections.length - 1)
                    )}
                    disabled={activeSectionIndex === sections.length - 1}
                    className={`flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all px-4 py-2 ml-3 ${
                      activeSectionIndex === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
            </div>

            {/* Active Section Form */}
            <div>
              {
                activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev => ({...prev, personal_info: data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )
              }
              {
                activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=>setResumeData(prev => ({...prev, professional_summary: data}))} setResumeData={setResumeData} />)
              }
              {
                activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev => ({...prev, experience: data}))} />
              )
              }
              {
                activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education} onChange={(data)=> setResumeData(prev =>({...prev, education: data}))} />
                )
              }
              {
                activeSection.id === 'projects' && (
                  <ProjectsForm data={resumeData.project} onChange={(data)=> setResumeData(prev =>({...prev, project: data}))} />
                )
              }
                {
                activeSection.id === 'skills' && (
                  <SkillsForm data={resumeData.skills} onChange={(data)=> setResumeData(prev =>({...prev, skills: data}))} />
                )
              }
            </div>
            <button
            onClick={()=>{toast.promise(saveResume, {loading: 'Saving...'})}}
            className='bg-linear-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
              Save Changes
            </button>
          </div>

            </div>

            {/* Right Panel - Preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>

              <div className='relative w-full'>
                <div className='absolute bottom-3 right-0 left-0 flex justify-end items-center gap-2'>
                  {
                    resumeData.public && (
                      <button onClick={handleShare} className='flex items-center gap-2 p-2 px-4 text-xs bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                          <Share2Icon className='size-4'/>
                          Share
                      </button>
                    )
                  }
                  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-linear-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                    {resumeData.public ? <EyeIcon className='size-5'/> : <EyeOffIcon className='size-4'/>}
                    {resumeData.public ? 'Public': 'Private'}
                  </button>
                  <button onClick={downloadResume} className='flex items-center gap-2 px-6 py-2 text-xs bg-linear-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                    <DownloadIcon className='size-4'/>
                    Download
                  </button>
                </div>
              </div>

              {/* Resume  Preview */}

              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ResumeBuilder


