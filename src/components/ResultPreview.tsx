import { Download, RotateCcw, Eye } from 'lucide-react'

interface ResultPreviewProps {
  imageUrl: string
  onDownload: () => void
  onReset: () => void
}

export function ResultPreview({ imageUrl, onDownload, onReset }: ResultPreviewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-white rounded-xl shadow-lg border border-primary-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-800 to-primary-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">转换结果预览</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onReset}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-200 hover:text-white hover:bg-primary-600 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重新转换
              </button>
              <button
                onClick={onDownload}
                className="flex items-center gap-1 px-4 py-1.5 text-sm bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                下载PNG
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-gray-100 rounded-lg overflow-auto max-h-[600px]">
            <img
              src={imageUrl}
              alt="转换结果"
              className="max-w-full h-auto mx-auto"
            />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              图片尺寸：800px × 自适应高度（适配微信公众号）
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
