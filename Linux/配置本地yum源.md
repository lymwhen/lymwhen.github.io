# 配置本地yum源

离线环境部署 Linux 时，如需要使用 yum 安装软件，需要配置本地 yum 源

# 下载 CentOS 镜像

> 需下载 Everything 版本

> https://mirrors.aliyun.com/centos
>
> [Index of /centos/7.9.2009/isos/x86_64/ (aliyun.com)](https://mirrors.aliyun.com/centos/7.9.2009/isos/x86_64/)

# 关闭 SELinux

```bash
vi /etc/selinux/config
selinux=disabled

reboot

# 查看修改后状态
getenforce 
```

# 创建挂载点

```
mkdir -p /mnt/iso
```

# 挂载

```
[root@localhost tools]# mount -o loop CentOS-7-x86_64-Everything-2009.iso /mnt/iso
mount: /dev/loop0 is write-protected, mounting read-only
```

# 修改repo文件

```
cd /etc/yum.repos.d/
mkdir bak
mv CentOS* bak/
vi CentOS-Media.repo //创建文件，将下面内容复制进文件中
[c7-media]
name=CentOS-$releasever - Media
baseurl=file:///mnt/iso/
gpgcheck=1
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
```

# 清除cache

```
yum clean all
```

# 验证

```
yum repolist
已加载插件：fastestmirror
Determining fastest mirrors
c7-media                                                                                                                   | 3.6 kB  00:00:00     
(1/2): c7-media/group_gz                                                                                                   | 166 kB  00:00:00     
(2/2): c7-media/primary_db                                                                                                 | 5.9 MB  00:00:00     
源标识                                                            源名称                                                                     状态
c7-media                                                          CentOS-7 - Media                                                           9,911
repolist: 9,911
```

# 使用

```bash
yum -y install gcc

yum      install       softwarename        安装
yum      repolist                          列出设定yum源的信息
yum      remove        softwarename        卸载
yum      list          softwarename      查看软件源中是否有此软件
yum      list all                         列出所有软件名称
yum      list installd                    列出已经安装的软件名称
yum      list available               列出可以用yum安装的软件名称
yum      clean all                        清空yum缓存
yum      search         softwarename    根据软件信息搜索软件名字
yum      whatprovides   filename       在yum源中查找包含filename文件的软件包
yum      update                           更新软件
yum      history                          查看系统软件改变历史
yum      reinstall       softwarename     重新安装
yum      info            softwarename     查看软件信息
yum      groups list                      查看软件组信息
yum      groups info     softwaregroup    查看软件组内包含的软件
yum      groups install  softwaregroup    安装组件
```

> [linux下yum命令使用及软件安装_chao199512的博客-CSDN博客_yum安装](https://blog.csdn.net/chao199512/article/details/80089234)

