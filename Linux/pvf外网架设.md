# pvf 外网架设

# 更新 yum 源

> CentOS 6 yum 源失效，参看 [CentOS 6 yum 源失效](#point-centos-disabled)

> 不更新源会导致 yum 安装卸载报错，地址根据centos版本变化

```bash
wget -O/etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
# 用这个会下半天
yum clean all

yum makecache
```

> ```bash
> CentOS 7
> wget -O/etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS7-Base-163.repo
> ```

# 精简系统

```bash
yum -y remove Deployment_Guide-en-US finger cups-libs cups ypbind
yum -y remove bluez-libs desktop-file-utils ppp rp-pppoe wireless-tools irda-utils
yum -y remove sendmail* samba* talk-server finger-server bind* xinetd
yum -y remove nfs-utils nfs-utils-lib rdate fetchmail eject ksh mkbootdisk mtools
yum -y remove syslinux tcsh startup-notification talk apmd rmt dump setserial portmap yp-tools
yum -y groupremove "Mail Server" "Games and Entertainment" "X Window System" "X Software Development"
yum -y groupremove "Development Libraries" "Dialup Networking Support"
yum -y groupremove "Games and Entertainment" "Sound and Video" "Graphics" "Editors"
yum -y groupremove "Text-based Internet" "GNOME Desktop Environment" "GNOME Software Development"
```



# 安装支持库

```bash
yum -y install glibc.i686
yum -y install xulrunner.i686
yum -y install libXtst
yum -y install gcc gcc-c++ make zlib-devel
```

```bash
# 安装数据库
yum install -y mysql mysql-server mysql-devel
# 数据库开机启动
chkconfig mysqld on
```

**CentOS 7**

```bash
# 查询是否安装mariadb
rpm -qa | grep mariadb
# 安装mysql（不加参数vh不会自动添加系统服务）
rpm -ivh MySQL-server-5.1.73-1.glibc23.x86_64.rpm
# 查询mysql状态
service mysql status
# 开机启动
systemctl enable mysql

# 查询mysql
# rpm -qa | grep MySQL
MySQL-server-5.1.73-1.glibc23.x86_64
# 卸载，e：卸载，nodeps：不校验依赖关系
rpm -e --nodeps MySQL-server-5.1.73-1.glibc23.x86_64
# 查找mysql目录一并删除
find / -name mysql
rm -rf xx
```

> 在 MySQL 官网[MySQL :: Download MySQL Community Server (Archived Versions)](https://downloads.mysql.com/archives/community/) 下载 5.1.73 版本的 MySQL**Linux - Generic (glibc 2.3) (x86, 64-bit), RPM Package MySQL Server**

> [基础篇六 CentOS7.9安装MySQL5.1.47_山百草的博客-CSDN博客_centos7安装mysql5.1](https://blog.csdn.net/qq_41562136/article/details/125033895)

# 上传服务端文件并解压

```bash
# 解压下载的文件
tar -zxvf./Server.tar.gz -C /
# 授予home root mysql文件夹全部权限
chmod -R 0777 /home
chmod -R 0777 /root
chmod -R 0777 /var/lib/mysql
chown -R mysql.mysql /var/lib/mysql/
```

# 重启数据库

服务端文件中包含数据库的数据文件夹，直接启动数据库，如果出现两个绿色的OK，就表示数据库装成功了。

```bash
# service mysqld restart
service mysqld start
```

**CentOS 7**

通过上述方式安装的mysql启动方式为：

```
# service mysql restart
service mysql start
```



# 编译 GeoIP

```bash
cd /home/GeoIP-1.4.8/
./configure
make&& make check && make install
```

# 设置外网IP

### 数据库

将`d_taiwan.db_connect`的`db_ip`字段所有的`192.168.200.131`改成外网IP

```bash
mysql -ugame -p
uu5!^%jg
update d_taiwan.db_connect set db_ip = 'ip-address';
```

在`d_taiwan.geo_allow`添加允许ip，包括网段ip 和 网关ip

> 参看数据
>
> ```bash
> 192.168.200.0	CN	2015-08-15 01:27:28
> 192.168.200.1	CN	2015-09-03 21:05:23
> ip-address.191	CN	2015-09-03 21:05:23 (在服务端 ifconfig 查看)
> ip-address.0	CN	2015-09-03 21:05:23
> ```



### 配置文件

```bash
cd /home/dxf/
sed -i "s/192.168.200.131/ip-address/g" `find -type f -name "*.tbl"`
sed -i "s/192.168.200.131/ip-address/g" `find -type f -name "*.cfg"`

# 提示No such file or Directory时，需要手动执行
sed -i "s/192.168.200.131/ip-address/g" "./secsvr/zergsvr/cfg/dib/__+_ dib.cfg"
sed -i "s/192.168.200.131/ip-address/g" "./secsvr/zergsvr/cfg/dib/dib.cfg"
```



> ```bash
> # 查找文件
> find -type f -name "*.cfg"
> ```

# 关闭防火墙

```bash
service iptables stop
chkconfig iptables off
```



# 挂载虚拟内存

> 最好大小为8G

```bash
mkdir /swap
dd if=/dev/zero of=/swap/mySwap bs=1M count=8192
mkswap /swap/mySwap
swapon /swap/mySwap
# 添加开机自动挂载
sed -i '$a/swap/mySwap swap swap default 0 0' /etc/fstab
```

# 部署文件

### /home/dxf/game

部署必要文件到 /home/dxf/game 文件夹下，均授予权限 777

publickey.pem // 登陆器公钥，与客户端登陆器配套

Script.pvf

df_game_r 等级补丁

> 任何等级（60，90）的服务端、数据库（单库）均相同，仅须部署相应的 pvf 和等级补丁即可

### /root

> 如使用其他服务端文件，或者提取虚拟机服务端，须提取配套的服务器启动脚本，不然服务端启动报错

run

stop

run1

```bash
killall -9 df_channel_r


cd /home/dxf/channel
chmod 777 *
rm -f /home/dxf/channel/pid/*.pid
rm -rf /home/dxf/channel/log/*.*
./df_channel_r channel start &
```

**CentOS 7**

需要安装 psmisc 以支持 stop 脚本中的`killall`命令

```bash
yum -y install psmisc
```



# 启动服务器

```bash
# 启动
cd ~
./run

# 停止，须运行两次
./stop
```

# 配置客户端 hosts

hosts 中添加

```
ip-address	start.dnf.tw
```

# 客户端文件

### 根目录

登陆器.exe

Script.pvf

等级补丁

NPK补丁

> 最好下载配套的客户端，其次可以下载相同等级的客户端
>
> 只更换 pvf 容易 NPK 缺失，物品显示为黑块，但一般不影响游戏运行

### 外网ip

更改配置文件中的外网ip，如 DNF.toml、game.ini

# 使用登陆器登陆

# 其他

### php 网关登陆器

```bash
#安装php环境及组件
yuminstall -y httpd php php-mysql
#启动http服务并设置开机自启
service httpd restart
chkconfig httpd on
```

网站根目录在/var/www/html/路径。
上传对应的php文件即可

### win10 补丁大合集

留下文件夹、audio.xml、登陆器（可能还有MySql.Data.dll），其他删除，解压补丁到客户端，修改DNF.toml中的服务器地址

### 恢复数据库出问题

1. 停止数据库服务器
2. 删除数据库文件夹 /var/lib/mysql
3. 启动数据库，此时数据库文件会重置，并提示启动成功，需要设置密码
4. 停止数据库服务
5. 将要恢复的数据库文件**覆盖**到 /var/lib/mysql
6. 启动数据库服务



### 数据库备份恢复方法

> `mysqldump`恢复时会报错，采用复制mysql目录的方式

##### 备份

```bash
# 备份虚拟机中数据库
tar zcvf /var/lib/mysql.tar.gz /var/lib/mysql
# 安装（已安装则略过，无需重新安装)
yum install -y mysql mysql-server mysql-devel
# 重置 mysql 数据库
# 删除 mysql 数据文件夹
rm -rf /var/lib/msyql
# 启动
service mysqld start
# 如果启动成功，且提示应该设置 new password 就对了
```

##### 恢复

```bash
# 将mysql.tar.gz 拷贝到云服务器根目录
service mysqld stop
cd /
tar zxvf mysql.tar.gz (不可先删除mysql！！覆盖即可)
# 如果报错 time stamp XXX in the future，加上m参数：zxmvf
service mysqld start
# 提示ok 说明成功了
```

如果要重新恢复数据库，重置 mysql 数据库 - 恢复数据

**CentOS 7**

上述的`删除mysql数据文件夹`再`启动mysql`的重置mysql数据库的方式在CentOS 7中报错

```
ERROR! Manager of pid-file quit without updating file
```

遇到这个错误，就卸载mysql，搜索删除mysql相关文件/文件夹，再重新安装即可覆盖，重新启动。

### 将虚拟机中服务端部署到云服务器

理论上仅需使用 Server.tar.gz 全新部署，部署 pvf、等级补丁、root下脚本即可

也可尝试全新部署之后，替换 /home/dxf/game、mysql 数据夹、root下脚本

---

最新测试

在服务端依赖安装完毕，部署 Server.tar.gz 之后

```bash
# 虚拟机，打包之后拷贝到云服务器
# 打包/home/dxf/game
tar -zcvf /game.tar.gz /home/dxf/game
# 打包/var/lib/mysql
tar -zcvf /mysql.tar.gz /var/lib/mysql
# 打包/root（启动/停止脚本）
tar -zcvf /root.tar.gz /root

# 云服务器
# 授权
chmod -R 777 /home/dxf/game
# 删除/home/dxf/game
rm -rf /home/dxf/game
# 删除/root下文件
rm -rf /root/*
# 重置mysql目录，注意此处不是删除
# CentOS 6
rm -rf /var/lib/mysql
service mysqld restart
# CentOS 7 卸载、搜索删除全部的mysql目录，重新安装
# 解压覆盖
tar -zxvf game.tar.gz
tar -zxvf mysql.tar.gz
tar -zxvf root.tar.gz
# 启动mysql，修改ip
service mysql start
# 替换/home/dxf下的ip
```



### 数据库信息

game

uu5!^%jg

### 删除 swap 文件

```bash
swapoff /swap/mySwap
rm -rf /swap/mySwap
```

### 开启 pkc

```bash
./pkc
```

### CentOS 8 防火墙

```bash
# 防火墙状态
systemctl status firewalld.service
# active 激活
# inactive (dead) 关闭

# 关闭防火墙和防火墙自启
systemctl stop firewalld.service
systemctl disable firewalld.service
# 开启
systemctl start firewalld.service
systemctl enable firewalld.service
```



# 疑难问题

> ![TIP]
>
> 长时间没有启动起来要注意翻看启动日志，看是否有ip错误，是否有报`Fail`

### connection faild port = 20203

加大虚拟内存，然后先不管它，后面就没有了

数据库`d_taiwan.db_connect`表中的ip没有改，导致前面一直没有初始化好，所以一直连不上 

### 单机模式 此主机支持 Intel VT-x，但 Intel VT-x 处于禁用状态

主板开启VT

### 解压avast报毒

点击文件 - 右键 - 解压到指定目录，然后avast报读时恢复并设为白名单

### Inter_AuctionNotifyAuctionService::dispatch_sig : point closed

不用管

### 卡在 CPacketTranslater::OnTcpServerLogin(TYPE:10, sock:22)

数据库导入有问题，见数据库备份恢复方法
/home/dxf/game 没有正确导入

### 灰服务器（./run1无效的情况）

同上

### 接收频道信息失败（./run1无效的情况）

同上

### 进入频道提示数据异常

同上

### 报错 Init GlobalData Fail

/root 下脚本没有拷贝

服务端拷贝不全，尝试整个替换/home/dxf/game

### mysql 报错：ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/lib/mysql/mysql.sock' (2)

mysql 服务没有启动

### 服务端启动正常，客户端报错、灰频道

检查客户端 toml、ini 文件

检查hosts 文件

管理员权限运行登陆器

### 频道能进，选择角色大概率进不去

检查客户端防火墙

卸载杀毒软件（小红伞）

### wm虚拟机输入密码不对

检查小键盘是否开启

<span id="point-centos-disabled"></span>

# CentOS 6 yum 源失效

CentOS6制作新的yum仓库（针对失效）
CentOS6 yum源失效及重新制作方法

> 由于CentOS6原仓库于2020.11.30停止维护更新且被移除了，国内各大镜像源是同步的，所以也都失效了。如果想要继续使用yum仓库的话需要进行配置文件的修改，使用官网的旧版存档 https://vault.centos.org/ ，该旧版存档源由开发者维护，所以一些安全更新等可能会不是很及时，且在国外下载获取速度相对慢些。因此我们可以选用阿里云的镜像

### 查看当前系统版本

```bash
cat /etc/issue
-> CentOS release 6.9 (Final)
-> Kernel \r on an \m
```

### 备份 /etc/yum.repos.d/CentOS-Base.repo

```bash
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
```

### 修改 /etc/yum.repos.d/CentOS-Base.repo

```bash
vim /etc/yum.repos.d/CentOS-Base.repo
```

> 修改相应的URL链接，之前查询到该系统的版本为6.9，不同版本的仓库须上其站点查看相应的路径

```bash
#CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the 
# remarked out baseurl= line instead.
#
#
[base]
name=CentOS-6.6 - Base - mirrors.aliyun.com
lovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.6/os/$basearch/
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6

#released updates 
[updates]
name=CentOS-6.6 - Updates - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.6/updates/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6

#additional packages that may be useful
[extras]
name=CentOS-6.6 - Extras - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.6/extras/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6

#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-6.6 - Plus - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.6/centosplus/$basearch/
gpgcheck=1
enabled=0
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6

[contrib]
name=CentOS-6.6 - Contrib - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos-vault/6.6/contrib/$basearch/
gpgcheck=1
enabled=0
gpgkey=http://mirrors.aliyun.com/centos-vault/RPM-GPG-KEY-CentOS-6
```

> 在 shell 工具中粘贴可能丢失前几字符，粘贴后注意检查



### 清理并重新制作缓存

yum clean all && yum makecache

### 升级内核和软件（可选）

yum -y update