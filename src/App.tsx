import { useCallback, useState } from 'react'
import { Image, Sparkles } from 'lucide-react'
import { UploadZone } from './components/UploadZone'
import { ProgressBar } from './components/ProgressBar'
import { ResultPreview } from './components/ResultPreview'
import { useHtmlToPng } from './hooks/useHtmlToPng'

function App() {
  const { progress, convert, download, reset } = useHtmlToPng()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    const url = await convert(file)
    setPreviewUrl(url)
  }, [convert])

  const handleReset = useCallback(() => {
    reset()
    setPreviewUrl(null)
  }, [reset])

  const handleDownload = useCallback(() => {
    download()
  }, [download])

  const isProcessing = progress.status === 'extracting' || 
                       progress.status === 'loading' || 
                       progress.status === 'rendering'

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <Image className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            HTML转PNG长图工具
          </h1>
          <p className="text-white/70 text-lg">
            上传包含HTML和图片的压缩包，一键转换为适配微信公众号的高清长图
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-white/50 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>支持拖拽上传 · 自动解析资源 · 高清输出</span>
          </div>
        </div>

        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <UploadZone 
              onFileSelect={handleFileSelect} 
              disabled={isProcessing} 
            />
            
            <ProgressBar progress={progress} />
            
            {previewUrl && progress.status === 'completed' && (
              <ResultPreview 
                imageUrl={previewUrl}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
            
            {progress.status === 'error' && (
              <div className="text-center mt-6">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                >
                  重新尝试
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-white/40 text-sm animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <p>提示：压缩包中请确保包含 index.html 文件，图片资源请放在同级目录</p>
          <p className="mt-1">生成的图片宽度为 800px，完美适配微信公众号文章</p>
        </div>
      </div>
    </div>
  )
}

export default App
