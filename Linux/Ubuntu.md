# Ubuntu

```bash
# 查看软件包信息
apt show vim
# 安装
apt install -y vim
# 安装指定版本
apt install vim=xxx
# 安装deb
dpkg -i xxx
dpkg -i *.deb
```

> 查看软件版本：
>
> https://packages.ubuntu.com/
>
> [Packages for Linux and Unix - pkgs.org](https://pkgs.org/)
>
> [Ubuntu通过apt-get安装指定版本和查询指定软件有多少个版本 - EasonJim - 博客园 (cnblogs.com)](https://www.cnblogs.com/EasonJim/p/7144017.html)

# 快捷键

[Linux](https://so.csdn.net/so/search?from=pc_blog_highlight&q=Linux)虚拟终端（幕后控制台）

在Ubuntu下，按`Ctrl+Alt+F1`—`Ctrl+Alt+F6`就 可以访问他们，当图形界面出现问题可用。

默认情况下，tty1为图形界面，2-6为命令行终端，可以设置`默认命令行`使tty1为命令行。

# 物理机安装

版本：20.04.3

### 下载

可到各大镜像站的`ubuntu-releases`中下载，如 http://pub.mirrors.aliyun.com/ubuntu-releases/、https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases

### 制作启动盘

UltraISO 打开 iso 文件 - 启动 - 写入硬盘映像 - 写入

### 安装

UEFI 模式启动安装盘

### 启动后黑屏

`ctrl`+`alt`+`F4`进入命令行

```bash
sudo vim /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash nomodeset" // 这里添加 nomodeset
GRUB_CMDLINE_LINUX="rw" //这里需要填写为rw

sudo update-grub
```

> [Ubuntu Linux开机黑屏的永久解决办法_longlongqin的博客-CSDN博客_linux开机黑屏](https://blog.csdn.net/longlongqin/article/details/114925908)
>
> 这个问题的根因可能是当更新安装包等关键操作时发生了强制重启或关机12，导致ubuntu的文件系统保护性地进入只读模式，而启动中有些关键项是需要写入的，导致无法启动，因此这种情况的解决思路应该集中在如何恢复文件系统的读写性上，这个问题很早之前也遇到过一次，当时好像也是发生在软件包升级的过程中。
> ————————————————
> 版权声明：本文为CSDN博主「cheng3100」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
> 原文链接：https://blog.csdn.net/u013810296/article/details/86683559

### 网络连不上

连接网线之后，指示灯不亮、`ip a`网卡显示为`<NO-CARRIER,BROADCAST,MULTICAST,UP>`、设置界面显示为`cable zunplugged`

- 没有安装网卡驱动
- Intel x722 仅支持千兆网络

> maybe 有线网络一般不需要驱动
>
> 最好咨询厂家人员！！咨询华三工程师：将网卡与笔记本（千兆口）对插，发现指示灯亮了，而网卡连接百兆路由器指示灯不亮，说明该网卡只支持千兆

# 设置静态ip

```bash
sudo vim /etc/netplan/01-network-manager-all.yaml
network:
  ethernets: 
    ens33: #网卡名
      dhcp4: false #设置动态获得IP地址为 禁用
      addresses: [192.168.31.232/24]
      #optional: true
      gateway4: 192.168.31.1
      nameservers:
        addresses: [114.114.114.114]
	
  version: 2
  #renderer: NetworkManager
  
# 使网络生效
sudo netplan apply
```

# vi 编辑器

### 命令模式转输入模式：a/i/o/O/r

`a`:在当前光标后面输入

`i`:在当前光标前面输入

`o`:在当前光标下方新建一行并输入

`O`：在当前光标上方新建一行并输入

`r`:替换当前光标所在处字符并输入



`x`：删除光标所在处字符

`dd`：删除光标所在行

> 这里是跟 vim 区别比较大的地方，其他模式差不多
>
> 再没有比 ubuntu vi 更难用的编辑器了:dog:，有网络必须立马安装 vim:dog::dog:

### 输入模式转命令模式：Esc

### 命令模式转末行模式：：

### 末行模式转命令模式：没有内容一次Esc，有内容两次Esc

# 更换国内源

Ubuntu 20.04 是 Ubuntu 的第 8 个 LTS 版本，其重大更新和改进将在 2030 年前终止，计划于2020年 4 月 23 日发布。

国内有很多Ubuntu的镜像源，有阿里的、网易的，教育网的比如：清华源、中科大源。
这里以网易163源为例看一下如何修改Ubuntu 20.04的默认源。

**第一步：备份源文件：**
sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup

**第二步：编辑/etc/apt/sources.list文件**

在文件最前面添加以下条目(操作前请做好相应备份)：
vi /etc/apt/sources.list

网易163源

```
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb http://mirrors.163.com/ubuntu/ focal main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ focal-security main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ focal-updates main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse
# deb-src http://mirrors.163.com/ubuntu/ focal main restricted universe multiverse
# deb-src http://mirrors.163.com/ubuntu/ focal-security main restricted universe multiverse
# deb-src http://mirrors.163.com/ubuntu/ focal-updates main restricted universe multiverse
# deb-src http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse
# 预发布软件源，不建议启用
# deb http://mirrors.163.com/ubuntu/ focal-proposed main restricted universe multiverse
# deb-src http://mirrors.163.com/ubuntu/ focal-proposed main restricted universe multiverse
```

**第三步：执行更新命令：**

*sudo apt-get update
sudo apt-get upgrade*


**常用国内源：**

**阿里云源**

```
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
```

**清华源**

```
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
```

**中科大源**

```bash
deb https://mirrors.ustc.edu.cn/ubuntu/ focal main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ focal-security main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal-security main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
```

**网易163源**

```bash
deb http://mirrors.163.com/ubuntu/ focal main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ focal-security main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ focal-updates main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ focal-proposed main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ focal main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ focal-security main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ focal-updates main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ focal-proposed main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ focal-backports main restricted universe multiverse
```

> [ubuntu20.04 LTS 更换国内163源、阿里源、清华源、中科大源 - zqifa - 博客园 (cnblogs.com)](https://www.cnblogs.com/zqifa/p/12910989.html)
>
> [Ubuntu 20.04系统默认官方源/腾讯云源/阿里云源/中科大源/清华源source.list - 挨踢老王 (oldwang.org)](https://www.oldwang.org/47.html)

# apt install 提示 apt --fix-broken install

按照提示执行：

```bash
sudo apt --fix-broken install
```

> [解决错误apt --fix-broken install_我是土堆-CSDN博客](https://blog.csdn.net/zhouzhiyao960211/article/details/89716036)

# SSH 服务

```bash
sudo apt install openssh-server
```

> [如何在Ubuntu 20.04上启用SSH - GlaryJoker - 博客园 (cnblogs.com)](https://www.cnblogs.com/livelab/p/13033175.html)

# 默认命令行

```bash
# 开机默认命令行
sudo systemctl set-default multi-user.target
reboot
# 如需使用图形界面
startx
```

```bash
# 开机默认图形界面
sudo systemctl set-default graphical.target
reboot
```

> [ubuntu18.04.1 开机默认进入命令行模式/用户图形界面_麦兜呀的博客-CSDN博客_ubuntu18.04进入命令行界面](https://blog.csdn.net/qq_42955378/article/details/86673976)
>
> [ubuntu开机默认进入命令行模式/用户图形界面 - 云+社区 - 腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1634374)

# 关闭动效

```bash
# 关闭
gsettings set org.gnome.desktop.interface enable-animations false
# 开启
gsettings set org.gnome.desktop.interface enable-animations true
```

