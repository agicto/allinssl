import { Plugin } from "vite";
import { simpleGit, SimpleGit } from "simple-git";
import * as fs from "fs";
import * as path from "path";
import inquirer from "inquirer";
import { promisify } from "util";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { Transform } from "stream";

// 将 Node.js 的回调式 API 转换为 Promise 形式
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const rm = promisify(fs.rm);
const exists = promisify(fs.exists);

/**
 * 插件配置选项接口
 */
export interface GitSyncOptions {
  /** Git 仓库地址，支持同步到多个仓库 */
  gitUrl: string[];
  /** 同步目标目录（相对于项目根目录）的前缀，每个仓库会在此前缀下创建对应的目录 */
  syncPath: string;
  /** 是否在同步前清理目标目录（可选） */
  cleanSyncDir?: boolean;
  /** 自定义文件处理函数，可以修改文件内容（可选） */
  fileProcessor?: (
    content: string,
    filePath: string,
  ) => string | Promise<string>;
  /** 是否跳过提交确认（可选），直接进行提交 */
  skipConfirmation?: boolean;
}

// 文件统计信息接口
interface FileStats {
  size: number;
  path: string;
  type: "file" | "directory";
  children?: FileStats[];
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// 获取目录结构
async function getDirectoryStructure(dir: string): Promise<FileStats> {
  const stats = await stat(dir);
  const result: FileStats = {
    size: stats.size,
    path: path.basename(dir),
    type: stats.isDirectory() ? "directory" : "file",
  };

  if (stats.isDirectory()) {
    const files = await readdir(dir);
    result.children = await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(dir, file);
        return getDirectoryStructure(fullPath);
      }),
    );
    result.size = result.children.reduce(
      (total, child) => total + child.size,
      0,
    );
  }

  return result;
}

// 打印目录结构
function printDirectoryStructure(stats: FileStats, level = 0): void {
  const indent = "  ".repeat(level);
  const prefix = stats.type === "directory" ? "📁" : "📄";
  console.log(
    `${indent}${prefix} ${stats.path} (${formatFileSize(stats.size)})`,
  );

  if (stats.children) {
    stats.children.forEach((child) =>
      printDirectoryStructure(child, level + 1),
    );
  }
}

// 创建进度显示流
class ProgressStream extends Transform {
  private totalBytes = 0;
  private processedBytes = 0;
  private lastUpdate = 0;
  private readonly updateInterval = 1000; // 更新间隔（毫秒）

  constructor(private filePath: string) {
    super();
  }

  _transform(
    chunk: Buffer,
    encoding: string,
    callback: (error?: Error | null, data?: Buffer) => void,
  ) {
    this.processedBytes += chunk.length;
    this.totalBytes += chunk.length;

    const now = Date.now();
    if (now - this.lastUpdate >= this.updateInterval) {
      const progress = ((this.processedBytes / this.totalBytes) * 100).toFixed(
        2,
      );
      process.stdout.write(
        `\r处理文件 ${this.filePath}: ${progress}% (${formatFileSize(this.processedBytes)} / ${formatFileSize(this.totalBytes)})`,
      );
      this.lastUpdate = now;
    }

    callback(null, chunk);
  }

  _flush(callback: (error?: Error | null) => void) {
    process.stdout.write("\n");
    callback();
  }
}

/**
 * 获取当前项目的最新Git提交信息
 *
 * @returns 最新的Git提交信息
 */
async function getLatestCommitMessage(): Promise<string> {
  try {
    // 初始化当前项目的Git
    const currentProjectGit = simpleGit(process.cwd());

    // 检查是否是Git仓库
    const isRepo = await currentProjectGit.checkIsRepo();
    if (!isRepo) {
      return "Update build files"; // 默认提交信息
    }

    // 获取最新的提交记录
    const log = await currentProjectGit.log({ maxCount: 1 });
    if (log.latest) {
      return `Sync: ${log.latest.message}`;
    }

    return "Update build files";
  } catch (error) {
    console.warn("获取最新提交信息失败:", error);
    return "Update build files";
  }
}

/**
 * 处理单个Git仓库的同步
 *
 * @param repoUrl Git仓库URL
 * @param syncBasePath 基础同步路径
 * @param distDir 构建输出目录
 * @param commitMessage 提交信息
 * @param cleanSyncDir 是否清理同步目录
 * @param fileProcessor 文件处理函数
 * @returns 同步结果
 */
async function syncToRepo(
  repoUrl: string,
  syncBasePath: string,
  distDir: string,
  commitMessage: string,
  cleanSyncDir: boolean,
  fileProcessor?: (
    content: string,
    filePath: string,
  ) => string | Promise<string>,
): Promise<boolean> {
  // 从仓库URL提取仓库名称作为目录名
  const repoName = path
    .basename(repoUrl, ".git")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const repoSyncPath = path.join(syncBasePath, repoName);
  const absoluteSyncPath = path.resolve(process.cwd(), repoSyncPath);

  console.log(`\n开始同步到仓库: ${repoUrl}`);
  console.log(`同步目标目录: ${repoSyncPath}`);

  let git: SimpleGit;

  // 检查同步目录是否存在
  const syncDirExists = await exists(absoluteSyncPath);

  if (!syncDirExists) {
    // 目录不存在，克隆仓库
    console.log(`目录 ${repoSyncPath} 不存在，正在克隆仓库...`);
    git = simpleGit();
    try {
      await git.clone(repoUrl, absoluteSyncPath);
      console.log(`仓库克隆成功: ${repoUrl}`);
    } catch (error) {
      console.error(`克隆仓库失败: ${repoUrl}`, error);
      return false;
    }
  }

  // 初始化Git
  git = simpleGit(absoluteSyncPath);

  // 检查是否是有效的Git仓库
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.error(`目录 ${repoSyncPath} 不是有效的Git仓库`);
      return false;
    }
  } catch (error) {
    console.error(`检查Git仓库失败: ${repoSyncPath}`, error);
    return false;
  }

  // 如果需要清理同步目录
  if (cleanSyncDir) {
    console.log(`清理同步目录: ${repoSyncPath}`);
    const files = await readdir(absoluteSyncPath);
    for (const file of files) {
      // 保留 .git 目录，删除其他所有文件
      if (file !== ".git") {
        await rm(path.join(absoluteSyncPath, file), {
          recursive: true,
          force: true,
        });
      }
    }
  }

  // 复制文件到同步目录
  try {
    await copyFiles(distDir, absoluteSyncPath, fileProcessor);
  } catch (error) {
    console.error(`复制文件失败: ${repoSyncPath}`, error);
    return false;
  }

  try {
    // 拉取远程仓库以避免冲突
    console.log(`拉取远程仓库: ${repoUrl}`);
    await git.pull();

    // 添加所有文件
    console.log(`添加文件到Git: ${repoSyncPath}`);
    await git.add(".");

    // 检查是否有更改
    const status = await git.status();
    if (status.files.length === 0) {
      console.log(`没有需要提交的更改: ${repoSyncPath}`);
      return true;
    }

    // 提交更改
    console.log(`提交更改: ${repoSyncPath}`);
    await git.commit(commitMessage);

    // 推送到远程仓库
    console.log(`推送到远程仓库: ${repoUrl}`);
    await git.push();

    console.log(`同步成功: ${repoUrl}`);
    return true;
  } catch (error) {
    console.error(`Git操作失败: ${repoUrl}`, error);
    return false;
  }
}

/**
 * Vite 插件：将构建后的文件同步到指定的多个 Git 仓库
 *
 * 该插件作为当前项目Git之外的同步工具，主要用于将当前项目构建后的内容
 * 同步到其他Git仓库并提交。
 *
 * @param options 插件配置选项
 * @returns Vite 插件对象
 */
export function pluginProjectSyncGit(options: GitSyncOptions): Plugin {
  // 解构配置选项，设置默认值
  const {
    gitUrl,
    syncPath,
    cleanSyncDir = false,
    fileProcessor = undefined,
    skipConfirmation = false,
  } = options;

  // 存储 vite 配置中的构建输出目录
  let viteBuildOutDir: string;

  return {
    name: "vite-plugin-git-sync",
    // 仅在构建模式下应用插件
    apply: "build",
    // 在配置解析后执行，获取 vite 配置中的构建输出目录
    configResolved(config) {
      // 获取 vite 配置中的构建输出目录
      viteBuildOutDir = config.build.outDir || "dist";
    },
    // 在构建完成后执行
    async closeBundle() {
      // 使用 vite 配置中的构建输出目录
      console.log(`\n=== 项目构建同步工具 ===`);
      console.log(`使用构建输出目录: ${viteBuildOutDir}`);
      console.log(`同步目标仓库数量: ${gitUrl.length}`);

      // 复制文件到同步目录
      const distDir = path.resolve(process.cwd(), viteBuildOutDir);

      // 检查构建输出目录是否存在
      try {
        await stat(distDir);
      } catch {
        console.error(`构建输出目录 ${distDir} 不存在，请确保构建成功`);
        return;
      }

      // 获取默认提交信息（当前项目的最新提交信息）
      const defaultCommitMessage = await getLatestCommitMessage();

      // 确认是否要提交
      let shouldCommit = skipConfirmation;
      let commitMessage = defaultCommitMessage;

      if (!skipConfirmation) {
        const confirmResult = await inquirer.prompt([
          {
            type: "confirm",
            name: "shouldCommit",
            message: "是否要同步并提交更改到Git仓库？",
            default: true,
          },
        ]);

        shouldCommit = confirmResult.shouldCommit;
      }

      if (shouldCommit) {
        // 获取提交信息
        const messageResult = await inquirer.prompt([
          {
            type: "input",
            name: "commitMessage",
            message: "请输入提交信息（留空使用最新提交信息）：",
            default: defaultCommitMessage,
          },
        ]);

        commitMessage = messageResult.commitMessage || defaultCommitMessage;

        console.log(`使用提交信息: "${commitMessage}"`);

        // 创建基础同步目录
        const absoluteSyncPath = path.resolve(process.cwd(), syncPath);
        await mkdir(absoluteSyncPath, { recursive: true });

        // 同步到每个仓库
        const results = await Promise.all(
          gitUrl.map((url) =>
            syncToRepo(
              url,
              syncPath,
              distDir,
              commitMessage,
              cleanSyncDir,
              fileProcessor,
            ),
          ),
        );

        // 统计结果
        const successCount = results.filter(Boolean).length;
        console.log(`\n=== 同步完成 ===`);
        console.log(`成功: ${successCount}/${gitUrl.length}`);

        if (successCount === gitUrl.length) {
          console.log("所有仓库同步成功！");
        } else {
          console.warn(`部分仓库同步失败，请检查上面的错误信息`);
        }
      } else {
        console.log("用户取消了同步操作");
      }
    },
  };
}

// 优化的文件复制函数
async function copyFiles(
  sourceDir: string,
  targetDir: string,
  fileProcessor?: (
    content: string,
    filePath: string,
  ) => string | Promise<string>,
) {
  console.log(`\n开始复制文件从 ${sourceDir} 到 ${targetDir}...`);
  const startTime = Date.now();

  // 获取源目录结构
  const sourceStructure = await getDirectoryStructure(sourceDir);
  console.log("\n源目录结构:");
  printDirectoryStructure(sourceStructure);

  // 获取源目录中的所有文件
  const files = await readdir(sourceDir);
  let totalFiles = 0;
  let processedFiles = 0;

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const stats = await stat(sourcePath);

    if (stats.isDirectory()) {
      // 如果是目录，递归复制
      await mkdir(targetPath, { recursive: true });
      await copyFiles(sourcePath, targetPath, fileProcessor);
    } else {
      totalFiles++;
      try {
        // 如果是文件，根据是否提供 fileProcessor 决定处理方式
        if (fileProcessor) {
          // 使用流式处理文件内容
          const readStream = createReadStream(sourcePath, {
            encoding: "utf-8",
          });
          const writeStream = createWriteStream(targetPath, {
            encoding: "utf-8",
          });

          // 创建进度显示流
          const progressStream = new ProgressStream(sourcePath);

          // 创建一个转换流来处理文件内容
          const transformStream = new Transform({
            transform: async (
              chunk: Buffer,
              encoding: BufferEncoding,
              callback: (error?: Error | null, data?: string) => void,
            ) => {
              try {
                const processedContent = await fileProcessor(
                  chunk.toString(),
                  sourcePath,
                );
                callback(null, processedContent);
              } catch (error) {
                callback(
                  error instanceof Error ? error : new Error(String(error)),
                );
              }
            },
          });

          // 使用 pipeline 来处理流
          await pipeline(
            readStream,
            progressStream,
            transformStream,
            writeStream,
          );
        } else {
          // 直接复制文件
          const readStream = createReadStream(sourcePath);
          const writeStream = createWriteStream(targetPath);
          const progressStream = new ProgressStream(sourcePath);

          await pipeline(readStream, progressStream, writeStream);
        }

        processedFiles++;
        const progress = ((processedFiles / totalFiles) * 100).toFixed(2);
        console.log(`\n总进度: ${progress}% (${processedFiles}/${totalFiles})`);
      } catch (error) {
        console.error(`\n复制文件失败: ${sourcePath} -> ${targetPath}`, error);
        throw error;
      }
    }
  }

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  console.log(`\n文件复制完成！耗时: ${duration.toFixed(2)}秒`);

  // 获取目标目录结构
  const targetStructure = await getDirectoryStructure(targetDir);
  console.log("\n目标目录结构:");
  printDirectoryStructure(targetStructure);
}

export default pluginProjectSyncGit;
