# Windows

Windows操作系统，是由美国[微软](https://baike.baidu.com/item/微软/124767)公司（Microsoft）研发的操作系统，问世于1985年。起初是[MS-DOS](https://baike.baidu.com/item/MS-DOS/1120792)模拟环境，后续由于微软对其进行不断更新升级，提升易用性，使Windows成为了应用最广泛的操作系统 [1] 。

Windows采用了图形用户界面（[GUI](https://baike.baidu.com/item/GUI/479966)），比起从前的[MS-DOS](https://baike.baidu.com/item/MS-DOS/1120792)需要输入指令使用的方式更为人性化。随着计算机硬件和软件的不断升级，Windows也在不断升级，从架构的16位、[32位](https://baike.baidu.com/item/32位/5812218)再到[64位](https://baike.baidu.com/item/64位/2262282)，系统版本从最初的[Windows 1.0](https://baike.baidu.com/item/Windows 1.0/761751)到大家熟知的[Windows 95](https://baike.baidu.com/item/Windows%2095/757614)、[Windows 98](https://baike.baidu.com/item/Windows%2098/758579)、[Windows 2000](https://baike.baidu.com/item/Windows%202000/2769068)、[Windows XP](https://baike.baidu.com/item/Windows%20XP/191927)、[Windows Vista](https://baike.baidu.com/item/Windows%20Vista/214535)、[Windows 7](https://baike.baidu.com/item/Windows%207/1083761)、[Windows 8](https://baike.baidu.com/item/Windows%208/6851933)、[Windows 8.1](https://baike.baidu.com/item/Windows%208.1/768457)、[Windows 10](https://baike.baidu.com/item/Windows%2010/6877791)、[Windows 11](https://baike.baidu.com/item/Windows%2011/57321047)和[Windows Server](https://baike.baidu.com/item/Windows%20Server/271508)服务器企业级操作系统，微软一直在致力于Windows操作系统的开发和完善 [1] [17] 。

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

