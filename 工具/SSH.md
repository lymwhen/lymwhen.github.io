# SSH



# PuTTY

### 配置不生效问题

配置后，重新打开 PuTTY，发现配置又没在了。修改完配置之后，需要切回`Session`，点击`Default Settings`，点击`Save`按钮。

### 建议配置

##### 关闭时不弹窗提示

比较烦人

![image-20240108151049438](assets/image-20240108151049438.png)

> [!TIP]
>
> 其实 PuTTY 正经的关闭是`Ctrl + D`。
>
> [6.1.1 关闭Putty窗口时警告 -PuTTY中文站](http://www.putty.wang/putty-closejg/)

##### 间隔几秒发送空包保持 Session

![image-20240108151603636](assets/image-20240108151603636.png)

### 和 Windows Terminal 一样炫酷的界面和字体

字体：`Cascadia Mono`

字形：`Regular`/`常规`

字号：11

![image-20240108152058787](assets/image-20240108152058787.png)

长宽、回滚行数

![image-20240108160456646](assets/image-20240108160456646.png)

### 命令行

> [Using PuTTY - PuTTY 命令行](https://the.earth.li/~sgtatham/putty/0.80/htmldoc/Chapter3.html#using-cmdline)

```bash
putty.exe [-ssh | -ssh-connection | -telnet | -rlogin | -supdup | -raw] [user@]host
```

```bash
putty.exe -ssh -P 22 -l usr -pw password 127.0.0.1
putty.exe usr@127.0.0.1 -pw password 127.0.0.1
```

> [!TIP]
>
> PuTTY 自带的命令行工具`plink`可以使用和`putty`相同的参数，不过使用 Windows Terminal + `plink`时，在 Linux 服务器中按`Ctrl + C`就连整个 SSH 都退掉了。

# WinSCP

### 免密 sudo 用户 root 权限

新建会话 - 右键会话 - 编辑 - 高级，环境 - SFTP，SFTP服务器设为：

```bash
sudo /usr/libexec/sftp-server
```

参看[Linux/服务器安全 - 使用非-root-用户登录](Linux/服务器安全?id=使用非-root-用户登录)

### 从 WinSCP 中快速连接 SSH

WinSCP 中自带一个`命令 - 在 PuTTY 中打开`，不过还要输密码，略显鸡肋。不过`选项 - 命令`中有个自定义命令的功能，可以直接用 PuTTY 登录服务器，再配上上面的配置，没 xshell 什么事了🥰

> [Custom Commands - 自定义命令 :: WinSCP](https://winscp.net/eng/docs/custom_command)

```bash
putty.exe !U@!@:!# -pw !P
```

![image-20240108150625330](assets/image-20240108150625330.png)

### Tar/UnTar

原自定义命令：

```bash
# tar
tar -cz  -f "!?压缩文件名(&A)：?archive.tgz!" !&
# untar
tar -xz --directory="!?解压到目录(&E)：?.!" -f "!"
```

为方便 + 免密 sudo 可以这么改：

```bash
# tar
sudo tar -cz -f "archive.tgz" !&
# untar
sudo tar -xz --directory="." -f "!"
```

