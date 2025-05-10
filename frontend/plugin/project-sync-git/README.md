# vite-plugin-git-sync

一个 Vite 插件，用于将构建后的文件同步到指定的 Git 仓库。

## 功能特点

- 自动检查并克隆目标 Git 仓库
- 支持清理同步目录
- 支持自定义文件处理函数
- 交互式 Git 提交流程

## 安装

```bash
npm install vite-plugin-git-sync --save-dev
```

## 使用方法

在 `vite.config.ts` 中配置插件：

```typescript
import { defineConfig } from "vite";
import gitSync from "vite-plugin-git-sync";

export default defineConfig({
  plugins: [
    gitSync({
      gitUrl: "https://github.com/username/repo.git",
      syncPath: "./sync-dir",
      cleanSyncDir: true,
      fileProcessor: async (content, filePath) => {
        // 自定义文件处理逻辑
        return content;
      },
    }),
  ],
});
```

## 配置选项

| 选项          | 类型     | 必填 | 默认值 | 描述                                 |
| ------------- | -------- | ---- | ------ | ------------------------------------ |
| gitUrl        | string   | 是   | -      | Git 仓库地址                         |
| syncPath      | string   | 是   | -      | 同步目标目录（相对于项目根目录）     |
| cleanSyncDir  | boolean  | 否   | false  | 是否在同步前清理目标目录             |
| fileProcessor | function | 否   | -      | 自定义文件处理函数，可以修改文件内容 |

## 文件处理函数

`fileProcessor` 函数接收两个参数：

- `content`: 文件内容（字符串）
- `filePath`: 文件路径

返回处理后的文件内容（字符串或 Promise<string>）。

## 示例

```typescript
// 简单的文件处理示例
const fileProcessor = async (content: string, filePath: string) => {
  if (filePath.endsWith(".js")) {
    // 为 JS 文件添加版权信息
    return `/* Copyright ${new Date().getFullYear()} */\n${content}`;
  }
  return content;
};

// 在 vite.config.ts 中使用
gitSync({
  gitUrl: "https://github.com/username/repo.git",
  syncPath: "./sync-dir",
  cleanSyncDir: true,
  fileProcessor,
});
```
