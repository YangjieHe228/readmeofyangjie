# Yangjie He · Personal Archive

基于 Astro 的纯静态个人网站，包含旅行坐标图、摄影、日记与文字、投资研究、读书笔记和双语 CV。无后端、数据库或 CMS；日常更新只需要修改 Markdown、JSON 和静态文件。

## 本地运行

要求 Node.js 24（推荐），或 Node.js 22.23.4 及更新版本。GitHub Actions 工作流使用 Node.js 24。

```bash
npm install
npm run dev
```

完整构建与预览：

```bash
npm run check
npm run build
npm run preview
```

`npm run build` 会先输出静态 HTML/CSS/JS 到 `dist/`，再用 Pagefind 生成搜索索引。搜索只索引日记和投资研究的文章详情页；开发模式下没有搜索索引，请先构建再预览。

## 部署路径

默认部署到：

- GitHub 仓库：`YangjieHe228/readmeofyangjie`
- 网站地址：`https://YangjieHe228.github.io/readmeofyangjie/`
- Base path：`/readmeofyangjie`

所有内部链接、静态资源和搜索地址都从 Astro 的 `BASE_URL` 生成。需要换仓库或改为用户页时，只需修改：

1. `astro.config.mjs` 中默认的 `base` 和 `site`；
2. `.github/workflows/deploy.yml` 中构建步骤的 `BASE_PATH` 和 `SITE_URL`。

用户页根路径使用 `BASE_PATH: /`。也可以在命令行临时覆盖：

```bash
BASE_PATH=/ SITE_URL=https://YangjieHe228.github.io npm run build
```

## GitHub Pages 自动部署

仓库已包含 `.github/workflows/deploy.yml`。推送到 `main` 后会自动构建并部署。

首次使用时，在仓库 **Settings → Pages → Build and deployment** 中，将 Source 设为 **GitHub Actions**。部署权限由工作流中的 `pages: write` 和 `id-token: write` 提供。

## 内容目录

```text
src/content/
├── site.json                 # 站名、tagline、简介、社交链接
├── home/zh.json              # 中文首页
├── home/en.json              # 英文首页
├── travel/cities.json        # 旅行城市点位
├── photo/wander.json         # 相册一元数据
├── photo/still.json          # 相册二元数据
├── writes/*.md               # 日记与文字，一文一文件
├── research/*.md             # 投资研究，一文一文件
├── books/*.md                # 读书笔记，一文一文件
└── cv/zh.json, en.json       # 双语 CV 页面

public/
├── assets/avatar.svg         # 头像，可替换为同名文件
├── photos/[album]/full/      # 摄影原图
├── photos/[album]/thumbs/    # 摄影缩略图
├── books/covers/             # 书籍封面与默认占位图
├── cv/*.pdf                  # 中英文 CV，可同名替换
├── og/og-cover.png           # 1200×630 分享图
└── favicon.svg
```

当前文章、研究、书评、旅行备注、履历和图片均为**结构示例**，不代表站长真实经历。

## 新增一篇日记或研究文章

1. 在 `src/content/writes/` 或 `src/content/research/` 新建一个 `.md` 文件，文件名建议使用小写英文和连字符，例如 `my-new-note.md`。
2. 填入 frontmatter：

```yaml
---
title: 文章标题
date: 2026-11-07
tags: [日常, 观察]
description: 用于列表、搜索和分享描述的一句话摘要。
lang: zh
draft: false
---
```

3. 在 frontmatter 后使用标准 Markdown 写作，支持标题、列表、表格、代码块和图片。
4. `lang` 可填 `zh` 或 `en`；`draft: true` 可暂时隐藏文章。
5. 保存后刷新开发页面。列表、日期排序、标签和详情页会自动生成；生产搜索索引需重新执行 `npm run build`。

两个栏目共用字段规范，但内容相互独立。研究预设标签可自由使用 `A股`、`美股`、`宏观`、`行业`，也允许新增其他标签。

## 新增一个相册

以相册 ID `new-album` 为例：

1. 新建目录：

```text
public/photos/new-album/full/
public/photos/new-album/thumbs/
```

2. 原图放入 `full/`，对应缩略图放入 `thumbs/`。建议原图使用 WebP/AVIF，缩略图宽度约 480–640px，文件名保持一致。
3. 在 `src/content/photo/` 新建 `new-album.json`：

```json
{
  "id": "new-album",
  "title": "相册名称",
  "description": "相册的一句话说明",
  "order": 3,
  "photos": [
    {
      "file": "01.webp",
      "thumb": "01.webp",
      "caption": "图片说明",
      "date": "2026-11-07",
      "alt": "供屏幕阅读器使用的具体画面描述"
    }
  ]
}
```

4. 打开 `src/pages/photo.astro`，导入新 JSON，并加入 `albums` 数组：

```astro
import newAlbum from '../content/photo/new-album.json';
const albums = [wander, still, newAlbum].sort((a, b) => a.order - b.order);
```

相册选项卡、懒加载网格和灯箱会自动使用这些数据。更换现有图片时保持路径和文件名不变即可，无需改代码。

## 新增一本书

1. 可选：将封面放入 `public/books/covers/`，推荐 WebP，宽高比 5:7。
2. 在 `src/content/books/` 新建 `book-name.md`：

```yaml
---
title: 书名
author: 作者
rating: 4
tags: [文学, 小说]
cover: books/covers/book-name.webp
description: 显示在书单卡片中的一句话点评。
date: 2026-11-07
lang: zh
draft: false
---
```

3. 在正文中自由添加摘录、批注和长评。
4. 不评分时删除 `rating` 或设为 `null`；不使用封面时删除 `cover` 或留空，会自动显示 `books/covers/placeholder.svg`。

书单卡片和 `/books/[slug]/` 详情页会自动生成。

## 新增一座旅行城市

编辑 `src/content/travel/cities.json`，在数组中添加：

```json
{
  "id": "city-id",
  "cityZh": "城市中文名",
  "cityEn": "City Name",
  "countryZh": "国家中文名",
  "countryEn": "Country",
  "lat": 31.2304,
  "lon": 121.4737,
  "year": 2026,
  "noteZh": "显示在点位卡片中的一句中文备注",
  "noteEn": "Optional English note"
}
```

- `lat` 是纬度，`lon` 是经度，使用 WGS84 十进制度数。
- 点位通过等经纬投影映射到抽象轮廓，不使用在线地图，也不表示精确国界。
- 页面按年份倒序自动分组；点位支持桌面悬停、键盘聚焦和移动端点击。
- 仅公开展示本人自愿公开的大致城市级坐标，不要加入他人的位置或敏感精确地点。

## 修改首页、CV 与全局信息

- 首页文案：`src/content/home/zh.json`、`en.json`，两份结构保持一致。
- 站点名称、tagline、社交链接：`src/content/site.json`。
- CV 页面：`src/content/cv/zh.json`、`en.json`，各包含教育、工作、项目、技能四段。
- 中文 PDF：替换 `public/cv/Yangjie_He_CV_zh.pdf`。
- 英文 PDF：替换 `public/cv/Yangjie_He_CV_en.pdf`。
- 头像：替换 `public/assets/avatar.svg`；若改为 JPG/WebP，请同步修改 `src/pages/index.astro` 中图片路径。
- OG 图：替换 `public/og/og-cover.png`，保持 1200×630。

首页和 CV 默认中文，可通过右上角切换 English，选择保存在访客本机；`?lang=en` 可直接分享英文状态。其余页面不做全站翻译。

## 设计与功能说明

- `src/styles/global.css` 集中管理浅色、深色 CSS 变量和全站组件样式。
- `src/styles/prose.css` 管理 Markdown 正文、表格和代码块。
- 深色模式默认浅色，用户选择存于 `localStorage`。
- 移动端目录支持遮罩和 Esc 关闭；灯箱支持方向键、Esc 和外部点击关闭。
- 标签筛选写入 `?tag=`，可直接分享；语言写入 `?lang=en`。
- 搜索范围仅为 `/writes/` 和 `/research/` 的详情页，其他页面通过 `data-pagefind-ignore` 排除。
- 所有主要交互均使用原生脚本，无客户端 UI 框架依赖。

## 常用验收命令

```bash
npm run check
npm run build
npm run preview
```

构建后应确认：

1. `dist/index.html`、各栏目详情页和 `dist/404.html` 均存在；
2. 页面资源链接带 `/readmeofyangjie/` 前缀；
3. `dist/pagefind/` 中存在搜索索引；
4. 两份 CV PDF、摄影缩略图和 OG 图可以直接访问；
5. 修改 base path 后，内部链接与搜索地址仍使用同一前缀。
