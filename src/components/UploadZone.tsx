import { useState, useCallback } from 'react'
import { Upload, Archive } from 'lucide-react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.name.toLowerCase().endsWith('.zip')) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.name.toLowerCase().endsWith('.zip')) {
        setSelectedFile(file)
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        className={`
          flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl
          cursor-pointer transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-success bg-green-50 shadow-lg scale-[1.02]' 
            : 'border-primary-300 bg-primary-50 hover:border-primary-400 hover:bg-primary-100 hover:shadow-md'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDrop={disabled ? undefined : handleDrop}
      >
        <input
          type="file"
          className="hidden"
          accept=".zip"
          onChange={handleFileChange}
          disabled={disabled}
        />
        
        <div className={`flex flex-col items-center justify-center pt-5 pb-6 ${isDragging ? 'text-success' : 'text-primary-700'}`}>
          {selectedFile ? (
            <>
              <Archive className="w-12 h-12 mb-4" />
              <p className="text-lg font-semibold">{selectedFile.name}</p>
              <p className="text-sm text-primary-500">{formatFileSize(selectedFile.size)}</p>
              <p className="text-xs text-primary-400 mt-2">点击或拖拽更换文件</p>
            </>
          ) : (
            <>
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4
                ${isDragging ? 'bg-success/20' : 'bg-primary-100'}
              `}>
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-lg font-semibold">拖拽压缩包到这里</p>
              <p className="text-sm text-primary-500 mt-1">或点击选择文件</p>
              <p className="text-xs text-primary-400 mt-2">支持 .zip 格式，包含 HTML 和图片文件</p>
            </>
          )}
        </div>
      </label>
    </div>
  )
}
