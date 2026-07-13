import { useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { extractZipFile, findMainHtml, getResourceMap, getCssFiles } from '../utils/zipUtils'
import { replaceResourcePaths, wrapHtmlForRendering } from '../utils/htmlUtils'

export type ConversionStatus = 'idle' | 'extracting' | 'loading' | 'rendering' | 'completed' | 'error'

export interface ConversionProgress {
  status: ConversionStatus
  message: string
  percentage: number
}

const OUTPUT_WIDTH = 800

export function useHtmlToPng() {
  const [progress, setProgress] = useState<ConversionProgress>({
    status: 'idle',
    message: '',
    percentage: 0
  })
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('')

  const convert = useCallback(async (file: File) => {
    const baseName = file.name.replace(/\.[^.]+$/, '')
    setOriginalFileName(baseName)
    setProgress({ status: 'extracting', message: '正在解压压缩包...', percentage: 10 })
    
    try {
      const files = await extractZipFile(file)
      setProgress({ status: 'extracting', message: '正在解析文件...', percentage: 25 })
      
      const mainHtml = findMainHtml(files)
      if (!mainHtml) {
        throw new Error('压缩包中未找到HTML文件')
      }
      
      const resourceMap = getResourceMap(files)
      const cssFiles = getCssFiles(files)
      const cssContents = cssFiles.map(f => typeof f.content === 'string' ? f.content : '')
      setProgress({ status: 'loading', message: '正在加载HTML资源...', percentage: 40 })
      
      const htmlContent = typeof mainHtml.content === 'string' ? mainHtml.content : ''
      const replacedContent = replaceResourcePaths(htmlContent, resourceMap)
      const wrappedContent = wrapHtmlForRendering(replacedContent, OUTPUT_WIDTH, cssContents)
      
      const iframe = document.createElement('iframe')
      iframe.style.display = 'block'
      iframe.style.width = `${OUTPUT_WIDTH}px`
      iframe.style.height = '100%'
      iframe.style.position = 'fixed'
      iframe.style.top = '-9999px'
      iframe.style.left = '-9999px'
      iframe.style.zIndex = '-1'
      document.body.appendChild(iframe)
      
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          document.body.removeChild(iframe)
          reject(new Error('HTML加载超时'))
        }, 60000)
        
        iframe.onload = () => {
          clearTimeout(timeout)
          setTimeout(resolve, 3000)
        }
        
        iframe.onerror = () => {
          clearTimeout(timeout)
          document.body.removeChild(iframe)
          reject(new Error('HTML加载失败'))
        }
        
        iframe.srcdoc = wrappedContent
      })
      
      setProgress({ status: 'rendering', message: '正在渲染为图片...', percentage: 70 })
      
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDocument) {
        document.body.removeChild(iframe)
        throw new Error('无法访问iframe内容')
      }
      
      const bodyElement = iframeDocument.body
      
      const bodyWidth = bodyElement.scrollWidth
      const bodyHeight = bodyElement.scrollHeight
      
      const canvas = await html2canvas(bodyElement, {
        scale: 2,
        width: bodyWidth,
        height: bodyHeight,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        windowWidth: bodyWidth,
        windowHeight: bodyHeight
      })
      
      document.body.removeChild(iframe)
      
      setProgress({ status: 'rendering', message: '正在生成图片...', percentage: 90 })
      
      return new Promise<string>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('生成图片失败'))
            return
          }
          setResultBlob(blob)
          setProgress({ status: 'completed', message: '转换完成', percentage: 100 })
          const url = URL.createObjectURL(blob)
          resolve(url)
        }, 'image/png', 1.0)
      })
      
    } catch (error) {
      setProgress({ 
        status: 'error', 
        message: error instanceof Error ? error.message : '转换失败',
        percentage: 0
      })
      throw error
    }
  }, [])

  const download = useCallback(() => {
    if (resultBlob) {
      const name = `${originalFileName || 'html-to-png'}-${Date.now()}.png`
      saveAs(resultBlob, name)
    }
  }, [resultBlob, originalFileName])

  const reset = useCallback(() => {
    setProgress({ status: 'idle', message: '', percentage: 0 })
    setResultBlob(null)
    setOriginalFileName('')
  }, [])

  return {
    progress,
    resultBlob,
    convert,
    download,
    reset
  }
}
