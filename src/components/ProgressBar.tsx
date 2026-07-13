import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { ConversionProgress } from '../hooks/useHtmlToPng'

interface ProgressBarProps {
  progress: ConversionProgress
}

export function ProgressBar({ progress }: ProgressBarProps) {
  if (progress.status === 'idle') return null

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-success'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-primary-500'
    }
  }

  const getIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
    }
  }

  const getBackgroundColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-white border-primary-200'
    }
  }

  return (
    <div className={`w-full max-w-2xl mx-auto mt-6 p-4 rounded-xl border ${getBackgroundColor()}`}>
      <div className="flex items-center gap-3 mb-3">
        {getIcon()}
        <span className={`font-medium ${
          progress.status === 'completed' ? 'text-success' :
          progress.status === 'error' ? 'text-red-600' : 'text-primary-700'
        }`}>
          {progress.message}
        </span>
      </div>
      
      {progress.status !== 'error' && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getStatusColor()}`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      )}
      
      {progress.status !== 'error' && (
        <p className="text-xs text-gray-500 mt-2 text-right">
          {progress.percentage}%
        </p>
      )}
    </div>
  )
}
