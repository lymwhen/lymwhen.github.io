# Debian

# 安装

> [VMware虚拟机安装Debian 10图解 - 公爵二世 - 博客园 (cnblogs.com)](https://www.cnblogs.com/dukejunior/articles/11405417.html)

##### 开头选择安装方式

`Graphical install`：图形界面安装

`install`：命令行安装

选择任一一个都可以

# apt install 提示插入光盘

在Debian中使用apt-get安装软件包时经常会提示让你插入netinst的光盘：

```bash
Media change: please insert the disc labeled
```

```bash
vi /etc/apt/sources.list
# 注释cdrom
#deb cdrom:[Debian GNU/Linux 6.0.7 _Squeeze_ - Official amd64 DVD Binary-1 20130223-14:06]/ squeeze contrib main
```

> [Media change : please insert the disk labeled_旋转的紫色星系-CSDN博客](https://blog.csdn.net/purplegalaxy/article/details/39495033)

# vi 编辑器无法正常使用

```bash
apt install -y vim
```

> [(转)新安装的debian使用vi无法正常编辑文件的问题 - 凡的世界 - 博客园 (cnblogs.com)](https://www.cnblogs.com/Impulse/articles/14673793.html)

### 安装 vim 提示插入光盘:dog:

按照提示输入输入光盘名称，安装成功后参看 apt install 提示插入光盘

# SSH 无法连接

```bash
apt install openssh-server
```

> [Debian安装后ssh连接不上 - 一点一滴，编程人生 - BlogJava](http://www.blogjava.net/writegull/archive/2010/12/11/340373.html)

# root 用户无法远程连接

```bash
vim /etc/ssh/sshd_config
#PermitRootLogin prohibit-password
PermitRootLogin yes
# 重启ssh服务
service sshd restart
或者
/etc/init.d/ssh restart
```

> [(1条消息) Debian之—— Debian 10 允许root用户登录和以ssh方式登录_zhoudatianchai的专栏-CSDN博客_debian11允许root登录](https://blog.csdn.net/zhoudatianchai/article/details/113740262)

# 设置静态IP

```bash
vim /etc/network/interfaces
# 动态获取ip
iface ens33 inet dhcp
# 静态ip
iface ens33 inet static
address 192.168.3.151
netmask 255.255.255.0
gateway 192.168.3.1

# 重启networking服务，vm上无效，重启后生效
service networking restart
```

查看ip

```bash
ip addr
```

> [设置debian的静态IP（方便简单）_大方子-CSDN博客_debian修改ip地址](https://blog.csdn.net/nzjdsds/article/details/77197246)

# 设置 DNS

```bash
vim /etc/resolv.conf
nameserver 114.114.114.114 #首选
nameserver 4.2.2.1 #备选

# 重启networking服务，vm上无效，重启后生效
service networking restart
```

> [设置debian的静态IP（方便简单）_大方子-CSDN博客_debian修改ip地址](https://blog.csdn.net/nzjdsds/article/details/77197246)

