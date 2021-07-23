cat /proc/cpuinfo

cat /proc/meminfo



磁盘分区

fdisk -l

找到用于部署的硬盘，如/dev/sdb: 2199.0 GB

parted /dev/sdb

#转换为分区表为gpt格式

mklabel gpt

#创建主分区，从0到2199GB

mkpart primary 0 2199gb

查看硬盘信息

print

#退出

q



#查看分区信息

fdisk -l /dev/sdb

#格式化分区

mkfs.ext4 /dev/sdb1

#查看分区格式、UUID等

blkid /dev/sdb1

#开机自动挂载分区

echo '/dev/sdb1 /home ext4 defaults 0 0' >> /etc/fstab



配置本地yum 源

#关闭seLinux

vi /etc/selinux/config

selinux=disabled

reboot

#查看修改后状态

getenforce 

## 创建挂载路径

```
mkdir -p  /mnt/iso
```

## 创建挂载点

```
mount -o loop xxxx.iso /mnt/ios
```

## 修改repo文件

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

## 清除cache

```
yum clean all
```

## 验证

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

使用

yum install gcc







sqlplus / as sysdba

shutdown immediate

shutdown abort

startup



create spfile from pfile

cp /home/oracle/admin/orcl/pfile/init.ora.xxxx /home/oracle/product/11.xxx/orcl/dbs/initorcl.ora



dbca -silent -responseFile /home/oracle/response/dbca.rsp

修改/home/oracle/response/dbca.rsp文件里以下几个参数，下面三个参数根据建库实际情况进行修改：

OPERATION_TYPE = "deleteDatabase"

SOURCEDB = "orcl"

SYSDBAUSERNAME = "sys"

SYSDBAPASSWORD = "123456"

dbca -silent -responseFile /home/oracle/response/dbca.rsp





userdel -r oracle

groupdel oinstall

.bash_profile readonly

[linux系统.bash_profile readonly问题解决_Amy_liu0923的博客-CSDN博客](https://blog.csdn.net/Amy_liu0923/article/details/100819965)









drop user ABC cascade;



 --删除空的表空间，但是不包含物理文件
drop tablespace tablespace_name;
--删除非空表空间，但是不包含物理文件
drop tablespace tablespace_name including contents;
--删除空表空间，包含物理文件
drop tablespace tablespace_name including datafiles;
--删除非空表空间，包含物理文件
drop tablespace YNTSJY_EFLOW including contents and datafiles;
————————————————
版权声明：本文为CSDN博主「gbj890229」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/gbj890229/article/details/6623996





create tablespace YNTSJY_NEFLOW datafile '/usr/local/oracle/oradata/ORCL/yntsjy_neflow_001.dbf' size 2000m autoextend on next 1000m maxsize unlimited;



create user YNTSJY_NEFLOW identified by "BF603k7BFhAichunshu2021" default tablespace YNTSJY_NEFLOW profile DEFAULT ACCOUNT UNLOCK;

grant dba to YNTSJY_NEFLOW;

grant resource to YNTSJY_NEFLOW;

grant connect to YNTSJY_NEFLOW;



# 数据库导出和导入





show sga;
