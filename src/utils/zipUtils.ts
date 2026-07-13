import JSZip from 'jszip'

export interface ExtractedFile {
  name: string
  path: string
  content: string | ArrayBuffer
  type: 'html' | 'image' | 'css' | 'js' | 'other'
}

export async function extractZipFile(file: File): Promise<ExtractedFile[]> {
  const zip = new JSZip()
  const zipContent = await file.arrayBuffer()
  const loadedZip = await zip.loadAsync(zipContent)
  
  const files: ExtractedFile[] = []
  
  for (const [path, entry] of Object.entries(loadedZip.files)) {
    if (entry.dir) continue
    
    const lowerPath = path.toLowerCase()
    let type: ExtractedFile['type'] = 'other'
    
    if (lowerPath.endsWith('.html') || lowerPath.endsWith('.htm')) {
      type = 'html'
    } else if (lowerPath.endsWith('.png') || lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg') || lowerPath.endsWith('.gif') || lowerPath.endsWith('.svg') || lowerPath.endsWith('.webp')) {
      type = 'image'
    } else if (lowerPath.endsWith('.css')) {
      type = 'css'
    } else if (lowerPath.endsWith('.js')) {
      type = 'js'
    }
    
    let content: string | ArrayBuffer
    if (type === 'image') {
      content = await entry.async('arraybuffer')
    } else {
      content = await entry.async('string')
    }
    
    files.push({
      name: path.split('/').pop() || '',
      path,
      content,
      type
    })
  }
  
  return files
}

export function findMainHtml(files: ExtractedFile[]): ExtractedFile | null {
  const htmlFiles = files.filter(f => f.type === 'html')
  if (htmlFiles.length === 0) return null
  
  const indexHtml = htmlFiles.find(f => f.name.toLowerCase() === 'index.html')
  if (indexHtml) return indexHtml
  
  return htmlFiles[0]
}

export function getResourceMap(files: ExtractedFile[]): Map<string, { url: string; content?: string }> {
  const map = new Map<string, { url: string; content?: string }>()
  
  files.forEach(file => {
    if (file.type === 'image' || file.type === 'css' || file.type === 'js') {
      if (typeof file.content === 'string') {
        const base64Content = btoa(file.content)
        const mimeType = file.type === 'css' ? 'text/css' : 'application/javascript'
        map.set(file.path, { 
          url: `data:${mimeType};base64,${base64Content}`,
          content: file.content
        })
      } else {
        const blob = new Blob([file.content], { type: getMimeType(file.path) })
        map.set(file.path, { 
          url: URL.createObjectURL(blob),
          content: undefined
        })
      }
    }
  })
  
  return map
}

export function getCssFiles(files: ExtractedFile[]): ExtractedFile[] {
  return files.filter(f => f.type === 'css')
}

function getMimeType(path: string): string {
  const lowerPath = path.toLowerCase()
  if (lowerPath.endsWith('.png')) return 'image/png'
  if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) return 'image/jpeg'
  if (lowerPath.endsWith('.gif')) return 'image/gif'
  if (lowerPath.endsWith('.svg')) return 'image/svg+xml'
  if (lowerPath.endsWith('.webp')) return 'image/webp'
  if (lowerPath.endsWith('.css')) return 'text/css'
  if (lowerPath.endsWith('.js')) return 'application/javascript'
  return 'application/octet-stream'
}
