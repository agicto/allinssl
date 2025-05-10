import Client from "ssh2-sftp-client";
import { Plugin } from "vite";

export interface FtpSyncTarget {
  host: string;
  port: number;
  username: string;
  password: string;
  remotePath: string;
  localPath?: string;
  clearRemote?: boolean;
}

export function ftpSync(options: FtpSyncTarget[] | FtpSyncTarget): Plugin {
  return {
    name: "vite-plugin-ftp-sync",
    apply: "build",
    closeBundle: async () => {
      if (!Array.isArray(options)) options = [options];
      const results = await Promise.allSettled(
        options.map(async (target) => {
          const sftp = new Client();
          try {
            await sftp.connect({
              host: target.host,
              port: target.port,
              username: target.username,
              password: target.password,
            });

            const localPath = target.localPath || "dist";
            console.log(
              `开始同步文件到 SFTP 服务器 ${target.host}:${target.port} -> ${target.remotePath}`,
            );

            if (target.clearRemote) {
              console.log(`正在清除远程目录 ${target.remotePath}...`);
              try {
                await sftp.rmdir(target.remotePath, true);
                console.log(`远程目录 ${target.remotePath} 已清除`);
              } catch (err) {
                console.warn(`清除远程目录失败，可能目录不存在: ${err}`);
              }
            }

            await sftp.uploadDir(localPath, target.remotePath);
            console.log(`文件同步到 ${target.host} 完成！`);

            sftp.end();
            return { target, success: true };
          } catch (err) {
            console.error(`SFTP 同步到 ${target.host} 失败:`, err);
            sftp.end();
            return { target, success: false, error: err };
          }
        }),
      );

      const failures = results.filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected",
      );

      if (failures.length > 0) {
        throw new Error(`部分 SFTP 同步失败: ${failures.length} 个目标`);
      }
    },
  };
}
