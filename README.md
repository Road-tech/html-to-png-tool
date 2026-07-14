# HTML转PNG长图工具

一个网页工具，用户上传包含HTML文件和图片的压缩包，自动加载HTML并转换为适配微信公众号的PNG长图。

试用Demo：[html2png.malu.tech](https://html2png.malu.tech/)

## 功能特性

- 📤 **支持上传压缩包**：支持 `.zip` 格式，包含 HTML 和图片文件
- 🎨 **CSS样式加载**：自动加载 HTML 中的内联样式和外部 CSS 文件
- 📐 **适配微信公众号**：生成的图片宽度为 800px，完美适配微信公众号文章
- 📁 **智能命名**：转化出的图片文件名基于上传的 ZIP 文件名
- 🚀 **一键转换**：上传压缩包后自动完成转换，无需手动操作

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **样式方案**：Tailwind CSS 3
- **HTML转图片**：html2canvas
- **压缩包处理**：JSZip
- **图标库**：Lucide React

## 使用方法

### 本地开发

```bash
# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### Docker 部署

```bash
# 构建并启动容器
docker-compose up -d --build

# 访问地址：http://localhost:8080
```

### Cloudflare Pages 部署

#### 方式一：GitHub Actions 自动部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 Cloudflare Dashboard 中创建 Pages 项目
3. 在 GitHub Secrets 中配置：
   - `CLOUDFLARE_API_TOKEN`：Cloudflare API Token
   - `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID
4. 推送代码到 `main` 分支，GitHub Actions 会自动部署

#### 方式二：手动上传部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录打包为 ZIP 文件
3. 在 Cloudflare Pages 中上传 ZIP 文件

## 项目结构

```
.
├── public/              # 静态资源
│   ├── _redirects      # Cloudflare Pages 重定向规则
│   ├── _headers        # Cloudflare Pages 响应头配置
│   └── vite.svg        # 图标
├── src/                # 源代码
│   ├── components/     # React 组件
│   │   ├── UploadZone.tsx      # 上传区域组件
│   │   ├── ProgressBar.tsx     # 进度条组件
│   │   └── ResultPreview.tsx   # 结果预览组件
│   ├── hooks/          # 自定义 Hooks
│   │   └── useHtmlToPng.ts     # HTML转PNG核心逻辑
│   ├── utils/          # 工具函数
│   │   ├── htmlUtils.ts        # HTML处理工具
│   │   └── zipUtils.ts         # ZIP处理工具
│   ├── App.tsx         # 主应用组件
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式
├── .github/workflows/  # GitHub Actions 工作流
│   └── deploy.yml      # 自动部署配置
├── Dockerfile          # Docker 镜像配置
├── docker-compose.yml  # Docker Compose 配置
├── vite.config.ts      # Vite 配置
├── tailwind.config.js  # Tailwind CSS 配置
└── package.json        # 项目依赖
```

## 使用说明

1. 准备一个压缩包（.zip），包含：
   - `index.html` 文件
   - 相关的图片资源（与 HTML 文件同级目录）
   - CSS 文件（可选）

2. 打开工具网页，拖拽压缩包到上传区域或点击选择文件

3. 等待转换完成，预览生成的 PNG 长图

4. 点击下载按钮保存图片

## 注意事项

- 压缩包中请确保包含 `index.html` 文件
- 图片资源请放在与 HTML 文件同级目录
- 生成的图片宽度为 800px，高度根据内容自动调整
- 所有处理均在浏览器端完成，不会上传到服务器

## 许可证

MIT License
