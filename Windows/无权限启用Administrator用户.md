# 无权限启用 Administrator 用户

当 windows 系统中所有管理员用户都被禁用时，使用普通用户无法将管理员用户启用。

> [!TIP]
>
> 若系统中有管理员用户，最简单的办法就是登录该用户启用`administrator`，若启用的只有普通用户，则使用下述方法。

# PE 改粘滞键为 cmd

进入 PE系统，打开原系`C:\Windows\System32`

> [!TIP]
>
> 此处应设置显示受操作系统保护的文件和显示隐藏文件

修改 sethc.exe （粘滞键程序）为 sethc.exe.bak

复制 cmd.exe，改名为 sethc.exe

复制 cmd.exe 到 dllcache下，如没有则新建文件夹，改名为 sethc.exe

重启系统，在登录界面连按 5 次 shift 键，会弹出管理员 cmd 命令行窗口

> [!TIP]
>
> 注意检查右下角协助按钮里面的“粘滞键”开关是否打开

```bash
# 查看administrator用户信息
C:\Users\lymly>net user administrator
用户名                 Administrator
全名
注释                   管理计算机(域)的内置帐户
用户的注释
国家/地区代码          000 (系统默认值)
帐户启用               No
帐户到期               从不

上次设置密码           2023-04-17 17:46:03
密码到期               从不
密码可更改             2023-04-17 17:46:03
需要密码               Yes
用户可以更改密码       Yes

允许的工作站           All
登录脚本
用户配置文件
主目录
上次登录               从不

可允许的登录小时数     All

本地组成员             *Administrators
全局组成员             *None
命令成功完成。

# 启用administrator
net user administrator /ACTIVE:YES
```

> ```bash
> C:\Users\lymly>net user /?
> 此命令的语法是:
> 
> NET USER
> [username [password | *] [options]] [/DOMAIN]
>          username {password | *} /ADD [options] [/DOMAIN]
>          username [/DELETE] [/DOMAIN]
>          username [/TIMES:{times | ALL}]
>          username [/ACTIVE: {YES | NO}]
> ```
>
> ```bash
> # 用户信息
> net user test
> # 修改密码
> net user test 123445
> # 添加用户
> net user test 123456 /add
> # 删除用户
> net user test /delete
> # 禁用用户
> net user test /active:no
> # 启用用户
> net user test /active:yes
> ```
>
> 