import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'
import ConfirmDialog from '../Components/ConfirmDialog'
import { useState } from 'react'
import { LogOutIcon } from 'lucide-react'
import toast from 'react-hot-toast'
const Navbar = () => {
    const {user} = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmColor: 'red',
    confirmText: 'Confirm',
    icon: null
  })

    const logoutUser = ()=>{
      setConfirmDialog({
      isOpen: true,
      title: 'Logout',
      message: 'Are you sure you want to logout? You will need to login again to access your account.',
      confirmText: 'Yes, Logout',
      cancelText: 'Stay Logged In',
      confirmColor: 'yellow',
      icon: LogOutIcon,
      onConfirm: () => {
        dispatch(logout())
        toast.success('Logged out successfully')
        // Redirect to login page
        navigate('/')
      }
    })
      
        // dispatch(logout())
    }


  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link  >
            <img src="/logo.svg" alt="logo"  className='h-11 w-auto'/>
        </Link>
      <div className='flex items-center gap-4 text-sm'>
        <p className='max-sm:hidden'>Hi, {user?.name}</p>
        <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>
            Logout
        </button>
      </div>
      </nav>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({...confirmDialog, isOpen: false})}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        confirmColor={confirmDialog.confirmColor}
        icon={confirmDialog.icon}
      />
    </div>
  )
}

export default Navbar
