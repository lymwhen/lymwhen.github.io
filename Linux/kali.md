# kali



### 复制粘贴

> ```
> 在终端下:
> 复制命令:Ctrl + Shift + C
> 粘贴命令:Ctrl + Shift + V
> 
> 在控制台下:
> 复制命令:Ctrl + Insert 或 用鼠标选中即是复制
> 粘贴命令:Shift + Insert 或 单击鼠标滚轮即为粘贴
> 
> 命令模式（能复制很多东西）
> 命令模式就是在你所处的任意模式按ESC键,都可以会到命令行模式,
> Ctrl+C 复制
> Ctrl+V 粘贴
> Ctrl+X 剪切
> Ctrl+D删除
> Ctrl快捷键
> Ctrl+S保存
> Ctrl+W关闭程序
> Ctrl+N新建
> Ctrl+O打开
> Ctrl+Z撤销
> Ctrl+F查找
> ```
>
> [kali linux复制粘贴快捷键_金色的天空的博客-程序员ITS301_kali复制粘贴 - 程序员ITS301](https://www.its301.com/article/qq_44881113/120458922)

# 启用 root 用户

```bash
# 更改root密码
sudo passwd root
# 切换root用户
su root
```

> [kail linux 如何启用root账户_小游66的博客-CSDN博客](https://blog.csdn.net/xiaoyou625/article/details/111772864)

# 启用 ssh

```bash
sudo vim /etc/ssh/sshd_config
```

修改`PermitRootLogin`项为`yes`

```bash
#LoginGraceTime 2m
PermitRootLogin yes
#StrictModes yes
#MaxAuthTries 6
#MaxSessions 10
```

修改`PasswordAuthentication `为`yes`

```bash
# To disable tunneled clear text passwords, change to no here!
PasswordAuthentication yes
#PermitEmptyPasswords no
```

```bash
# 重启ssh
/etc/init.d/ssh restart
# 或者
service ssh start
# 状态是否正常运行
/etc/init.d/ssh status
# 或者
service ssh status  状态是否正常运行

# 添加开机启动
update-rc.d ssh enable
```

