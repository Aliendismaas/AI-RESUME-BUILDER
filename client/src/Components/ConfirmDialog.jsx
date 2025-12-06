import { AlertTriangleIcon, XIcon } from 'lucide-react'
import React from 'react'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red", // red, green, blue, purple, yellow
  icon: CustomIcon = null
}) => {
  
  if (!isOpen) return null;

  const colorClasses = {
    red: {
      button: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-600',
      iconBg: 'bg-red-100'
    },
    green: {
      button: 'bg-green-600 hover:bg-green-700',
      icon: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    blue: {
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    purple: {
      button: 'bg-purple-600 hover:bg-purple-700',
      icon: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    yellow: {
      button: 'bg-yellow-600 hover:bg-yellow-700',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    }
  }

  const colors = colorClasses[confirmColor] || colorClasses.red;
  const Icon = CustomIcon || AlertTriangleIcon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  }

  return (
    <div 
      onClick={onClose} 
      className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200'
    >
      <div 
        onClick={e => e.stopPropagation()} 
        className='relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200'
      >
        {/* Icon */}
        <div className={`${colors.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
          <Icon className={`size-6 ${colors.icon}`} />
        </div>

        {/* Title */}
        <h2 className='text-xl font-semibold text-slate-800 mb-2'>
          {title}
        </h2>

        {/* Message */}
        <p className='text-slate-600 mb-6'>
          {message}
        </p>

        {/* Buttons */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium'
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-2.5 px-4 ${colors.button} text-white rounded-lg transition-colors font-medium`}
          >
            {confirmText}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors'
        >
          <XIcon className='size-5' />
        </button>
      </div>
    </div>
  )
}

export default ConfirmDialog