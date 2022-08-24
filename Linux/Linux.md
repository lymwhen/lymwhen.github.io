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
# 创建文件夹，p参数会创建路径中的文件夹
mkdir -p /usr/local/test1
mkdir /usr/local/test1
# 创建文件
touch test.txt
# 写入文件
echo 'hello' > test.txt
# 追加写入
echo 'hello' >> test.txt

# 重命名
mv tools tools1
# 移动
mv tools test/tools
# 移动时排除
# 把除了data1/2的文件和目录移动到bak1中
mv !(bak1|bak2) bak1
# 复制
cp response/* response_bak
# 复制文件和文件夹
cp -r * bak
# 复制文件和文件夹，并连同所具有的权限一同复制
# 正常情况应该是用这个，但貌似不带p也会连同权限一同复制，待探究
cp -rp * bak
# 复制时排除某文件或目录
# 把除了data1/2的文件和目录复制到bak1中
cp -rp !(bak1|bak2) bak1

# 文件列表
ls
# 文件列表，列出权限
ls -l
# 解压
tar -xvf repo.tar
tar -zxvf repo.tar.gz
# 压缩repo文件夹
tar -zxvf repo.tar.gz repo
# 指定解压目录
tar -zxvf mysql-xxx.tar.gz -C /usr/local
```

> [!TIP]
>
> 如果`mv`报错：`!: event not  `，需要执行：
>
> ```
> shopt -s extglob
> ```
>
> 表示扩展模式匹配操作符，就可以使用更多的通配符。
>
> [linux mv命令排除某个文件或文件夹_庭前荷雨的博客-CSDN博客_mv 排除](https://blog.csdn.net/motingqian/article/details/84308629)

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

# 脚本

```bash
# 开头
#!/bin/bash

# 定位到当前目录
cd `dirname $0`

# 回显
echo "test"
echo `cat ./tomcat.pid`

# 后台启动
./startup.sh &
# 后台启动，当关闭shell窗口时不会被挂断
nohup ./startup.sh &

# 时间
date;sleep 2s;date

# 延时，默认s（秒）
sleep 2
sleep 2s
sleep 2m

# 条件表达式
# 文件存在
[ -f ./tomcat.pid ] && echo 'exists.'
# 取反
[ ! -f ./tomcat.pid ] && echo 'not exists.'
# if
if [ -f ./tomcat.pid ]; then
    echo "exists."
elif [ -f ./tomcat1.pid ]
then
    echo "exists 1."
else
    echo "not exists."
fi
```

> [!TIP]
>
> `if [ -f ./tomcat.pid ]; then`中的分号表示命令结束，即一行内区分多个命令，如
>
> ```bash
> date;sleep 2;date
> ```
> 
> 如果不使用分号，那么应该分多行写。

> [!TIP]
>
> 类似 js ES6 模板语法，可以获得其他命令的返回值
>
> ```bash
> kill -9 `lsof -t -i:8080`
> ```

> 文件测试
>
> - -d：测试是否为目录(Directory)。
>
> - -e：测试目录或文件是否存在(Exist)。
>
> - -f：测试是否为文件(File)。
>
> - -r：测试当前用户是否有权限读取(Read)。
>
> - -w：测试当前用户是否有权限写入(Write)。
>
> - -x：测试是否设置有可执行(Excute)权限。
>

> [shell if 取反_Shell脚本的应用（二）_weixin_39665379的博客-CSDN博客](https://blog.csdn.net/weixin_39665379/article/details/111171632)
>
> [linux后台运行shell脚本_我心无悔dcw的博客-CSDN博客](https://blog.csdn.net/dcwnb1/article/details/12993889)



> [!NOTE]
>
> 脚本必须为`unix`格式
>
> vim：命令`set ff=unix`
>
> notepad++：右下角确认编码为`Unix (LF)`，否则右键切换。

# 网络

### ssh

```bash
ssh root@172.17.1.7
# 指定端口
ssh root@172.17.1.7 -p 22
```

### 端口占用情况

```bash
# 查看端口占用
netstat -nltp | gerp 80
```

> yum install net-tools

##### lsof

```bash
# 查看端口占用 -t:进程号
lsof -i：8080
# 结束进程
kill -9 17084
# 结束指定端口的进程
kill -9 `lsof -t -i:8080`
```

### 端口活动情况/端口流量

```bash
yum -y install iptraf
iptraf
```

> [linux查看某个端口的流量_linux流量查看工具汇总_weixin_39895977的博客-CSDN博客](https://blog.csdn.net/weixin_39895977/article/details/111755204)

### nmap

```bash
# 查看端口开启状态
# tcp
nmap -sT 172.16.100.73 -p 22222 -Pn
# tcp/udp，多端口
nmap -sTU 172.16.100.73 -p 22222,8080 -Pn
```

> [nmap常用命令检查主机在线与在线主机端口开放情况 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1696459)

### curl

```bash
# 查看服务器信息
curl -I 172.16.1.7:8080
```



# 编译安装

### 卸载

```bash
make uninstall
make clean
```

接下来就可以从`configure`那一步开始重新安装了

> [一个软件包通过编译源代码安装后，如何完全的卸载？？ _advance1989的博客-CSDN博客_编译安装的软件包如何卸载](https://blog.csdn.net/advance1989/article/details/6527704)
