# WSL + tmux 远程附加解决方案

### 背景问题

直接通过 SSH 连接到远程 Windows 电脑时，如果网络意外断开或终端关闭，SSH 会话会被终止，正在运行的命令、Claude Code、Mimo Code 等工具会直接中断。

**解决方案**：通过 WSL 下的 tmux 管理会话，即使 SSH 断开，tmux 会话依然在后台运行，重新连接后可以 `tmux attach` 恢复到之前的工作状态。

---

### 完整配置流程

##### 安装 Windows Terminal

从 Microsoft Store 安装 **Windows Terminal**。

##### 设置 PowerShell 为默认终端

打开 Windows Terminal → 设置 → 默认配置文件 → 选择 **Windows PowerShell**，设为默认。

##### 升级到 PowerShell 7（推荐）

Windows 自带的是 Windows PowerShell 5.1，建议升级到 PowerShell 7（跨平台版本）：

```powershell
winget install Microsoft.PowerShell
```

安装完成后，Windows Terminal 会自动出现 **PowerShell 7** 配置项。可将其设为默认终端：

打开 Windows Terminal → 设置 → 默认配置文件 → 选择 **PowerShell 7**，设为默认。

> PowerShell 7 相比 5.1 支持更多现代语法（如 `??`、`??=`）、并行处理、跨平台脚本等。

##### 开启必要组件

打开 **控制面板** → **程序** → **启用或关闭 Windows 功能**，勾选以下选项：

- **适用于 Linux 的 Windows 子系统**
- **虚拟机平台**

确认后重启电脑。

##### 设置 WSL 2 为默认版本

以管理员身份运行 PowerShell：

```powershell
wsl --set-default-version 2
```

##### 下载并安装 Linux 内核更新包

前往官方文档页面下载：

[WSL 安装手册 - Step 4: 下载 Linux 内核更新包](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)

下载后双击安装即可。

##### 安装 Ubuntu

从 Microsoft Store 安装 **Ubuntu**（推荐最新 LTS 版本）。

安装完成后打开 Ubuntu，等待初始化完成，设置用户名和密码。

##### 初始化 Ubuntu 环境

```bash
sudo apt update && sudo apt upgrade -y
```

##### 替换 Ubuntu 软件源为阿里云镜像（推荐国内用户）

Ubuntu 默认源在国内访问较慢，建议替换为阿里云镜像源。

以 Ubuntu 22.04 (jammy) 为例：

```bash
# 备份原源
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

# 写入阿里云源
sudo tee /etc/apt/sources.list <<'EOF'
deb https://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
deb https://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
EOF

# 刷新源生效
sudo apt update
```

> 如果你的 Ubuntu 版本不同，将 `jammy` 替换为对应代号（如 20.04 用 `focal`，24.04 用 `noble`）。

##### 安装 Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

验证安装：

```bash
node -v
npm -v
```

##### 安装 tmux

```bash
sudo apt install -y tmux
```

##### 安装 Mimo Code

使用小米官方命令安装：

```bash
curl -fsSL https://raw.githubusercontent.com/nicepkg/mimo/main/install.sh | bash
```

> 具体安装命令请参考小米官方文档，以最新版本为准。

##### 刷新环境变量

```bash
source ~/.bashrc
```

或

```bash
source ~/.zshrc
```

---

### 快捷脚本

在 Windows 用户目录（`C:\Users\<用户名>\`）下放置以下 bat 脚本，SSH 登录后可直接执行。

##### create-et-mimo.bat

重启后用 Mimo Code 创建新会话：

```bat
@echo off
wsl -e bash -ic "cd /mnt/d/projects/projectsAlpha/EasyTier/ && exec tmux new -s claude 'mimo -c'"
```

##### create-et-claude.bat

重启后用 Claude Code 创建新会话：

```bat
@echo off
wsl -e bash -ic "cd /mnt/d/projects/projectsAlpha/EasyTier/ && exec tmux new -s claude 'claude --permission-mode bypassPermissions --resume'"
```

##### attach.bat

快速附加已有会话：

```bat
@echo off
wsl -e tmux attach -t claude
```

##### close.bat

关闭会话：

```bat
@echo off
wsl -e tmux kill-session -t claude
```

---

### 使用流程

##### 首次连接（重启后）

SSH 登录后执行创建脚本：

```bash
create-et-mimo
```

或

```bash
create-et-claude
```

##### 断线重连

SSH 登录后执行附加脚本：

```bash
attach
```

##### 关闭会话

```bash
close
```

##### 常用 tmux 命令

| 操作 | 快捷键/命令 |
|------|-------------|
| 分离会话 | `Ctrl+b` 然后 `d` |
| 水平分屏 | `Ctrl+b` 然后 `%` |
| 垂直分屏 | `Ctrl+b` 然后 `"` |
| 切换窗口 | `Ctrl+b` 然后方向键 |

---

### 总结

通过 WSL + tmux + 快捷脚本的组合，你可以：

- 重启后一行命令创建会话并启动工具
- SSH 断线后一行命令恢复工作状态
- 后台长时间运行命令不被中断
- 随时随地通过 SSH 连接继续使用 Claude Code、Mimo Code
