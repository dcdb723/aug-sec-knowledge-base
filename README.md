# Augmented Security Knowledge Base

这是一个安全知识库应用，提供了用户友好的界面来搜索和浏览安全相关知识。该项目包含完整的前后端实现。

## 功能特点

- 清晰直观的用户界面设计
- 安全主题的搜索功能
- 显示分类的安全信息
- 相关Stack Overflow文章链接
- 响应式设计，适用于不同屏幕大小

## 项目结构

### 前端部分
- `index.html` - 主HTML结构
- `styles.css` - 应用的CSS样式
- `script.js` - 基本交互的JavaScript（前端模拟数据）
- `client.js` - 与后端API交互的JavaScript（实际应用）
- `logo.svg` - 应用的SVG图标

### 后端部分
- `server.js` - Express服务器实现
- `package.json` - 项目依赖和脚本

## 技术实现

### 前端
- 纯HTML/CSS/JavaScript实现
- 响应式设计，适配移动设备
- 与后端API通信

### 后端
- Node.js + Express框架
- RESTful API设计
- 内存数据存储（实际应用中应使用数据库）

## API端点

- `GET /api/topics` - 获取热门话题列表
- `GET /api/topics/:topicName` - 按主题筛选安全知识
- `GET /api/search?q=query` - 搜索安全知识
- `GET /api/knowledge/:id` - 获取特定ID的知识条目

## 如何运行

### 前端（无后端）
只需在浏览器中打开`index.html`文件即可运行静态演示。

### 完整应用
1. 安装依赖：`npm install`
2. 启动服务器：`npm start` 或开发模式 `npm run dev`
3. 访问 `http://localhost:3000` 查看应用

## 前端与后端集成
1. 将前端文件放入`public`目录中
2. 确保`client.js`而非`script.js`被`index.html`引用
3. 服务器会自动提供静态文件

## 未来改进

- 集成实际数据库（MongoDB、PostgreSQL等）
- 增强搜索功能，支持自动建议
- 搜索结果的筛选功能
- 用户认证以获取个性化内容
- 添加暗黑模式切换
- 集成更高级的搜索引擎如Elasticsearch
- 添加更多安全主题和知识 