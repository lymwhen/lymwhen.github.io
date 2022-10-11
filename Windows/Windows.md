# Windows

```bash
# 查看用户信息
net user administrator
# 重置密码（须以管理员运行的cmd）
net user administrator Password123456
```

# 计划任务

cmd - taskschd

### 开机启动

开机启动 tomcat 等

##### 常规

输入名称

更改用户和组 - 输入`SYSTEM` - 检查名称 - 确定

> `只在用户登录时运行`不能满足服务器意外重启后重启服务的需求
> 
> `不管用户是否登录都要运行`使用普通用户或 Administrator 用户需要输入密码，当更改用户密码后任务失效
> 
> 使用`SYSTEM`用户，此两项变为不可用，且开机启动正常

##### 触发器

新建 - 下拉选择启动时 - 确定

##### 操作

新建 - 选择执行的程序 - 起始于输入程序所在目录 - 确定

### 定时执行

同开机启动

##### 触发器

新建 - 下拉选择按预定计划

每天03:00执行：

- 每天
- 开始：2021\08\05 00\03\00
- 每隔 1 天发生一次

> 如果多个时间点出发，可添加多个触发器

每隔1分钟执行

- 每天
- 开始：当前时间
- 每隔 1 天发生一次
- 重复任务间隔，输入`1分钟`

# 批处理

```batch
@echo off
:: 注释

:: 输出、转义
echo %date% ^> 开始备份数据库...
:: 空行
echo.
:: 输出到文件
echo test > F:\test.log
:: 输出到文件（追加）
echo test >> F:\test.log

:: 定位到
cd F:\logs
:: 定位到（跨盘符）
cd /d F:\logs

:: 不显示输入（bat执行时）
@ping 192.168.3.88
:: 不显示输出（错误消息会显示）
@ping 192.168.3.88 1>nul
@ping 192.168.3.88 >nul
:: 不显示输出（所有）
@ping 192.168.3.88 1>nul 2>nul
@ping 192.168.3.88 >nul 2>nul

:: 日期时间 yyyy-MM-dd HH:mm:ss
echo %date:~0,4%-%date:~5,2%-%date:~8,2% %time:~0,2%:%time:~3,2%:%time:~6,2%
```

> 0-9时，`%time:~0,2%`第一位是空格，导致创建文件夹、文件时出错，解决办法
> 
> ```batch
> set "t0=%time: =0%"
> ```
> 
> 与操作系统的设置有关

# 远程桌面无法复制粘贴

结束进程`rdpclip`，`win`+`r`运行`rdpclip`

# 文件夹权限

复制文件进去提示需要管理员权限、winrar 解压到时无法创建文件夹

右键 - 属性 - 安全 - 高级

所有者选择`Users`，权限条目仅保留：

- `SYSTEM`/完全控制
- `Administrators`/完全控制
- `Authenticated Users`/修改
- `Users`/读取和执行

均继承于`无`，应用于`此文件夹、子文件夹和文件`

# PowerShell：因为在此系统上禁止运行脚本

管理员运行 powershell

```
# 查询
get-executionpolicy
# 设置为remotesigned
set-executionpolicy remotesigned
```

> [PowerShell：因为在此系统上禁止运行脚本，解决方法 - 简书 (jianshu.com)](https://www.jianshu.com/p/4eaad2163567)
