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

> [!TIP]
>
> 计划任务中运行 tomcat 闪退，可能是在运行的用户下没有环境变量，可以在脚本中加上
>
> ```bash
> set "JAVA_HOME=D:\tools\java\jdk1.6"
> set "CATALINA_HOME=D:\projects\mtxx\eflow"
> ```
>
> 

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

# 删除提示文件被占用

使用 git 带的 base

```bash
rm -f xxx
rf -rf xxx
```

> [!TIP]
>
> 这是一个非常牛逼的不费劲的完美的解决方案

# PowerShell：因为在此系统上禁止运行脚本

管理员运行 powershell

```
# 查询
get-executionpolicy
# 设置为remotesigned
set-executionpolicy remotesigned
```

> [PowerShell：因为在此系统上禁止运行脚本，解决方法 - 简书 (jianshu.com)](https://www.jianshu.com/p/4eaad2163567)

# 远程断开后注销用户

有时运维需要，断开连接后一段时间注销堡垒机。

组策略编辑器—计算机配置—管理模板—Windows组件—远程桌面服务—远程桌面会话主机—会话时间限制中，配置以下两项

- 设置已中断会话的时间限制
- 设置活动但空闲的远程桌面服务会话的时间限制

配置为已启用，设定时间，那么远程连接断开后经此时间后用户注销。

---

但是又有时，我们不希望远程断开后用户被注销，比如运行服务器的用户，那么应将上述两项设置为未配置或已禁用。

> 打开gpedit.msc
>
> 浏览到计算机配置 -> 管理模板 -> Windows组件 -> 远程桌面服务 -> 远程桌面会话主机 -> 会话时间限制。
>
> 启用“ 设置已中断会员的时间限制 ”并将其设置为“ 从不 ”。
>
> [解决：Windows 断开远程连接后程序停止工作 – 王旭博客 (wxzzz.com)](https://wxzzz.com/133.html)
