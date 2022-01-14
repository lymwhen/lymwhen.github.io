# Linux 服务器

Linux，全称GNU/Linux，是一种免费使用和自由传播的[类UNIX](https://baike.baidu.com/item/类UNIX/9032872)操作系统，其内核由[林纳斯·本纳第克特·托瓦兹](https://baike.baidu.com/item/林纳斯·本纳第克特·托瓦兹/1034429)于1991年10月5日首次发布，它主要受到[Minix](https://baike.baidu.com/item/Minix/7106045)和Unix思想的启发，是一个基于[POSIX](https://baike.baidu.com/item/POSIX)的多用户、[多任务](https://baike.baidu.com/item/多任务/1011764)、支持[多线程](https://baike.baidu.com/item/多线程/1190404)和多[CPU](https://baike.baidu.com/item/CPU)的操作系统。它能运行主要的[Unix](https://baike.baidu.com/item/Unix/219943)工具软件、应用程序和网络协议。它支持[32位](https://baike.baidu.com/item/32位/5812218)和[64位](https://baike.baidu.com/item/64位)硬件。Linux继承了Unix以网络为核心的设计思想，是一个性能稳定的多用户网络操作系统。Linux有上百种不同的发行版，如基于社区开发的[debian](https://baike.baidu.com/item/debian/748667)、[archlinux](https://baike.baidu.com/item/archlinux/10857530)，和基于商业开发的[Red Hat Enterprise Linux](https://baike.baidu.com/item/Red Hat Enterprise Linux/10770503)、[SUSE](https://baike.baidu.com/item/SUSE/60409)、[Oracle Linux](https://baike.baidu.com/item/Oracle Linux/6876458)等。





# 系统

```bash
# CentOS版本
rpm -q centos-release
cat /etc/redhat-release
uname -a
# cpu
cat /proc/cpuinfo
# 内存
cat /proc/meminfo
# 内存占用
free -m
# 硬盘
fdisk -l
# 分区挂载情况
df -h
# 任务管理器
top
```

# 用户

```bash
# 切换用户
su -l oracle
# 退出用户
exit
```



# 文件

```bash
# 重命名
mv tools tools1
# 移动
mv tools test/tools
# 复制
cp response/* response_bak
# 文件列表
ls
# 文件列表，列出权限
ls -l
# 解压
tar -xvf repo.tar
tar -zxvf repo.tar.gz
# 压缩repo文件夹
tar -zxvf repo.tar.gz repo
```

### 十位权限

```bash
[root@localhost test]# ls -l ./
total 12
drwxr-xr-x 2 root root 4096 Jul 31 15:49 0
-rw-r--r-- 1 root root    1 Jul 31 15:36 1
-rwxrwxrwx 1 root root    1 Jul 31 15:36 2
```

##### 第一位

`d`代表的是目录(directroy)

`-`代表的是文件(regular file)

`s`代表的是套字文件(socket)

`p`代表的管道文件(pipe)或命名管道文件(named pipe)

`l`代表的是符号链接文件(symbolic link)

`b`代表的是该文件是面向块的设备文件(block-oriented device file)

`c`代表的是该文件是面向字符的设备文件(charcter-oriented device file)

##### 后九位

9位二进制/3位八进制数分别表示所有者`u`、所属组`g`、其他人`o`的权限

`u`代表所有者

`g`代表所属组

`o`代表其他人

`a`代表所有



`-`代表无权限

`r`代表读权限

`w`代表写权限

`x`代表执行权限

```properties
r-- = 100 = 4
-w- = 010 = 2
--x = 001 = 1
--- = 000 = 0
```

```properties
rw-r--r-- = 644
rwxrwxrwx = 777
```

### 授权

```bash
chmod [可选项] <mode> <file...>

可选项：
 
  -c, --changes          like verbose but report only when a change is made (若该档案权限确实已经更改，才显示其更改动作)
  -f, --silent, --quiet  suppress most error messages  （若该档案权限无法被更改也不要显示错误讯息）
  -v, --verbose          output a diagnostic for every file processed（显示权限变更的详细资料）
       --no-preserve-root  do not treat '/' specially (the default)
       --preserve-root    fail to operate recursively on '/'
       --reference=RFILE  use RFILE's mode instead of MODE values
  -R, --recursive        change files and directories recursively （以递归的方式对目前目录下的所有档案与子目录进行相同的权限变更)
       --help        显示此帮助信息
       --version        显示版本信息
mode ：
权限设定字串，详细格式如下 ：
[ugoa...][[+-=][rwxX]...][,...]，
其中
[ugoa...]
u 表示该档案的拥有者，g 表示与该档案的拥有者属于同一个群体(group)者，o 表示其他以外的人，a 表示所有（包含上面三者）。
[+-=]
+ 表示增加权限，- 表示取消权限，= 表示唯一设定权限。
[rwxX]
r 表示可读取，w 表示可写入，x 表示可执行，X 表示只有当该档案是个子目录或者该档案已经被设定过为可执行。
     
file...
```



```bash
# 授权
chmod 777 1.txt
# 连同子目录授权
chmod -R 777 text
# 添加其他人的执行权限
chmod o+x 1.txt
# 移除所属组的写权限
chmod g-w 1.txt
```

### 查找

```bash
find path -option [-print ] [ -exec -ok   command] {} \;
find 根据下列规则判断 path 和 expression，在命令列上第一个 - ( ) , ! 之前的部份为 path，之后的是 expression。如果 path 是空字串则使用目前路径，如果 expression 是空字串则使用 -print 为预设 expression。

expression 中可使用的选项有二三十个之多，在此只介绍最常用的部份。
-mount, -xdev : 只检查和指定目录在同一个文件系统下的文件，避免列出其它文件系统中的文件
-amin n : 在过去 n 分钟内被读取过
-anewer file : 比文件 file 更晚被读取过的文件
-atime n : 在过去n天内被读取过的文件
-cmin n : 在过去 n 分钟内被修改过
-cnewer file :比文件 file 更新的文件
-ctime n : 在过去n天内被修改过的文件
-empty : 空的文件-gid n or -group name : gid 是 n 或是 group 名称是 name
-ipath p, -path p : 路径名称符合 p 的文件，ipath 会忽略大小写
-name name, -iname name : 文件名称符合 name 的文件。iname 会忽略大小写
-size n : 文件大小 是 n 单位，b 代表 512 位元组的区块，c 表示字元数，k 表示 kilo bytes，w 是二个位元组。
-type c : 文件类型是 c 的文件。
d: 目录
c: 字型装置文件
b: 区块装置文件
p: 具名贮列
f: 一般文件
l: 符号连结
s: socket
-pid n : process id 是 n 的文件
你可以使用 ( ) 将运算式分隔，并使用下列运算。
exp1 -and exp2
! expr
-not expr
exp1 -or exp2
exp1, exp2
```

`-o`或者

`-a`而且

`-not`相反

```bash
# 算数优先级
find -not \( -name wenben1 -a -name wenben2 \)
```

```bash
find . -type f
find . -name "*.c"
# 将当前目录及其子目录下所有最近 20 天内更新过的文件列出
find . -ctime -20
# 查找系统中所有文件长度为 0 的普通文件，并列出它们的完整路径
find / -type f -size 0 -exec ls -l {} \;
# 查找大于20k并且小于50k的文件，并显示其详细信息
find /etc -size +20k -a -size -50k -exec ls -lh {}\;

# 查找当前目录中文件属主具有读、写权限，并且文件所属组的用户和其他用户具有读权限的文件
find . -type f -perm 644 -exec ls -l {} \;
# 查找ORACLE_BASE下，其他用户有写权限和执行权限的普通文件，-o+w：普通文件 其他人 有写权限
find $ORACLE_BASE/ -type f \( -perm -o+w -a -perm -o+x \)|xargs ls -al
```

> [Linux find 命令 | 菜鸟教程 (runoob.com)](https://www.runoob.com/linux/linux-comm-find.html)
>
> [linux命令(find中-a,-o,not的用法)_liuhuiyan_2014的专栏-CSDN博客](https://blog.csdn.net/liuhuiyan_2014/article/details/45053919)
>
> [find与逻辑关系运算_勿弃字纸-CSDN博客](https://blog.csdn.net/zhaoyangkl2000/article/details/76407820)

# 网络

```bash
# 查看端口占用
netstat -nltp | gerp 80
```

> yum install net-tools

# lsof

```bash
# 查看端口占用 -t:进程号
lsof -i：8080
# 结束进程
kill -9 17084
# 结束指定端口的进程
kill -9 `lsof -t -i:8080`
```
