export function replaceResourcePaths(htmlContent: string, resourceMap: Map<string, { url: string; content?: string }>): string {
  let result = htmlContent
  
  resourceMap.forEach((data, path) => {
    const fileName = path.split('/').pop() || path
    const escapedFileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    
    const pathPattern = new RegExp(`src=["']([^"']*?)${escapedFileName}["']`, 'gi')
    result = result.replace(pathPattern, `src="${data.url}"`)
    
    const hrefPattern = new RegExp(`href=["']([^"']*?)${escapedFileName}["']`, 'gi')
    result = result.replace(hrefPattern, `href="${data.url}"`)
    
    const urlPattern = new RegExp(`url\\(['"]?([^'")]*?)${escapedFileName}['"]?\\)`, 'gi')
    result = result.replace(urlPattern, `url("${data.url}")`)
  })
  
  return result
}

export function extractHeadStyles(htmlContent: string): string {
  const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
  if (!headMatch) return ''
  
  const headContent = headMatch[1]
  
  const styleTags: string[] = []
  
  const inlineStyles = headContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
  if (inlineStyles) {
    styleTags.push(...inlineStyles)
  }
  
  return styleTags.join('\n')
}

export function extractBodyContent(htmlContent: string): string {
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (bodyMatch) {
    return bodyMatch[1]
  }
  
  const htmlMatch = htmlContent.match(/<html[^>]*>([\s\S]*?)<\/html>/i)
  if (htmlMatch) {
    return htmlMatch[1].replace(/<head[^>]*>[\s\S]*?<\/head>/i, '')
  }
  
  return htmlContent
}

export function wrapHtmlForRendering(htmlContent: string, width: number, cssContents: string[] = []): string {
  const headStyles = extractHeadStyles(htmlContent)
  const bodyContent = extractBodyContent(htmlContent)
  
  const externalCss = cssContents.map(css => `<style>${css}</style>`).join('\n')
  
  const wrapper = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: ${width}px;
          min-width: ${width}px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td, th {
          word-break: break-all;
        }
      </style>
      ${headStyles}
      ${externalCss}
    </head>
    <body>
      ${bodyContent}
    </body>
    </html>
  `
  
  return wrapper
}
