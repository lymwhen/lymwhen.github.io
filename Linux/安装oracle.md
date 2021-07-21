# 安装 oracle



# 下载 oracle 11g

### 下载

linux.x64_11gR2_database_1of2.zip

linux.x64_11gR2_database_2of2.zip

> [oracle10G/11G官方迅雷下载地址合集 - 淼淼之森 - 博客园 (cnblogs.com)](https://www.cnblogs.com/mmzs/p/9030823.html)

### 上传至服务器

使用 winscp，如上传至 /usr/local/tools 下

### 解压至当前目录

```bash
unzip linux.x64_11gR2_database_1of2.zip
unzip linux.x64_11gR2_database_2of2.zip
```

> 需安装 unzip

解压出的文件夹为 /usr/local/tools/database

# 关闭 selinux

```bash
vi /etc/selinux/config
SELINUX=disabled
# 验证
setenforce 0
```

# 安装 oracle 11g 依赖包

```bash
# 检查未安装的依赖包
yum install gcc make binutils gcc-c++ compat-libstdc++-33elfutils-libelf-devel elfutils-libelf-devel-static ksh libaio libaio-develnumactl-devel sysstat unixODBC unixODBC-devel pcre-devel –y
# 安装依赖包
yum install -y gcc
```

> 离线环境参看

# 添加 oracle 用户和用户组

```
groupadd oinstall
groupadd dba
useradd -g oinstall -G dba oracle
passwd oracle
```



# 配置 sysctl.conf 系统参数

```
vi /etc/sysctl.conf
```

在末尾添加

```properties

fs.aio-max-nr = 1048576
fs.file-max = 6815744
kernel.shmall = 2097152
kernel.shmmax = 1073741824
kernel.shmmni = 4096
kernel.sem = 250 32000 100 128
net.ipv4.ip_local_port_range = 9000 65500
net.core.rmem_default = 262144
net.core.rmem_max = 4194304
net.core.wmem_default = 262144
net.core.wmem_max = 1048576 
```

>  **kernel.shmmax ：**
>
> 单位 byte，是核心参数中最重要的参数之一，用于定义单个共享内存段的最大值。设置应该足够大，能在一个共享内存段下容纳下整个的 SGA，最大值为物理内存 - 1 byte，建议设置为物理内存的一半。
>
> **kernel.shmall ：**
>
> 该参数控制可以使用的共享内存的总页数。 Linux 共享内存页大小为 4KB, 共享内存段的大小都是共享内存页大小的整数倍。一个共享内存段的最大大小是 16G ，那么需要共享内存页数是 16GB/4KB==4194304 （页）
<br>当内存为 12G 时， kernel.shmall = 3145728
<br>当内存为 16G 时， kernel.shmall = 4194304
<br>当内次为 32G 时， kernel.shmall = 8388608
<br>当内存为 64G 时， kernel.shmall = 16777216
<br>当内存为 128G 时， kernel.shmall = 33554432
> 
> 版权声明：本文为CSDN博主「不会推车的娘们」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
> 原文链接：https://blog.csdn.net/shmily_lsl/article/details/103384366

```bash
# 生效
sysctl -p
```

# 修改用户的限制文件

### /etc/security/limits.conf

```bash
vi /etc/security/limits.conf
```

在末尾添加

```bash
oracle           soft    nproc           2047
oracle           hard    nproc           16384
oracle           soft    nofile          1024
oracle           hard    nofile         65536
oracle           soft    stack           10240 
```

### /etc/pam.d/login

```bash
vi /etc/pam.d/login
```

在末尾添加

```bash
session required  /lib64/security/pam_limits.so
session required   pam_limits.so 
```

### /etc/profile

```bash
vi /etc/profile
```

在末尾添加

```sh
#oracle配置
if [ $USER = "oracle" ]; then
  if [ $SHELL = "/bin/ksh" ]; then
      ulimit -p 16384
      ulimit -n 65536
  else
      ulimit -u 16384 -n 65536
  fi
fi 
```



# 创建安装目录

```bash
mkdir -p /usr/local/oracle/product/11.2.0/db_1
mkdir /usr/local/oracle/oradata
mkdir /usr/local/oracle/inventory
mkdir /usr/local/oracle/fast_recovery_area
chown -R oracle:oinstall /usr/local/oracle
chmod -R 775 /data/oracle
```

# 设置 oracle 用户环境变量

```bash
# 切换至oracle用户
su -l oracle
vi .bash_profile
```

在末尾添加

```sh
ORACLE_BASE=/usr/local/oracle
ORACLE_HOME=$ORACLE_BASE/product/11.2.0/db_1
ORACLE_SID=orcl
PATH=$PATH:$ORACLE_HOME/bin
export ORACLE_BASE ORACLE_HOME ORACLE_SID PATH
source .bash_profile
```

> ORACLE_SID 必须与创建的数据库实例名称一致



# 安装 oracle

> 无图形界面，采用静默安装方式

### 编辑安装响应文件

```bash
# 切换至oracle用户
su -l oracle
# 备份安装相应文件
cd /usr/local/tools/database
mk response_bak
cp response/* response_bak 
# 编辑安装响应文件
vi db_install_rsp
```

```properties
oracle.install.option=INSTALL_DB_SWONLY
ORACLE_HOSTNAME=
UNIX_GROUP_NAME=oinstall
INVENTORY_LOCATION=/usr/local/oracle/inventory
SELECTED_LANGUAGES=en,zh_CN
ORACLE_HOME=/usr/local/oracle/product/11.2.0/db_1
ORACLE_BASE=/usr/local/oracle
oracle.install.db.InstallEdition=EE
oracle.install.db.DBA_GROUP=dba
oracle.install.db.OPER_GROUP=dba
# 安全更新，因oracle 11g bug，必须设为true
DECLINE_SECURITY_UPDATES=true
```

> ORACLE_HOSTNAME 是否来自环境变量 $HOSTNAME ?，测试留空则为 localhost（tnsnames.ora）

### 安装

```bash
cd /usr/local/tools/database/
./runInstaller -silent -responseFile /usr/local/tools/database/response/db_install.rsp -ignorePrereq
```



# 配置监听

```bash
# 切换到oracle用户
su -l oracle
netca /silent /responseFile /usr/local/tools/database/response/netca.rsp
```

> 注意此处，必须使用/silent /responseFile格式，而不是-silent -responseFile，因为是静默安装。

打印 Oracle Net Services configuration successful. The exit code is 0，说明运行成功；在 $ORACLE_HOME/network/admin 中生成 listener.ora 和 sqlnet.ora

### 查看 1521 端口监听

```bash
netstat -tnulp | grep 1521
```

# 创建数据库实例

### 编辑响应文件

```bash
# 切换到oracle用户
su -l oracle
vi /usr/lcoal/tools/database/response/dbca.rsp
```

```properties
[GENERAL]

# oracle版本，不能更改
RESPONSEFILE_VERSION = "11.2.0"

# Description   : Type of operation，安装类型为创建数据库
OPERATION_TYPE = "createDatabase"

[CREATEDATABASE]

# Description   : Global database name of the database
# 全局数据库的名字=SID+主机域名
# 第三方工具链接数据库的时候使用的service名称
GDBNAME = "ORCL"

# Description   : System identifier (SID) of the database
# 对应的实例名字
SID = "orcl"

# Description   : Name of the template
# 建库用的模板文件
TEMPLATENAME = "General_Purpose.dbc"

# Description   : Password for SYS user
# SYS管理员密码
SYSPASSWORD = "123456"

# Description   : Password for SYSTEM user
# SYSTEM管理员密码
SYSTEMPASSWORD = "123456"

# Description   : Password for SYSMAN user
# SYSMAN管理员密码
SYSMANPASSWORD = "123456"

# Description   : Password for DBSNMP user
# DBSNMP管理员密码
DBSNMPPASSWORD = "123456"

# Description   : Location of the data file's
# 数据文件存放目录
DATAFILEDESTINATION =/usr/local/oracle/oradata

# Description   : Location of the data file's
# 恢复数据存放目录
RECOVERYAREADESTINATION=/usr/local/oracle/fast_recovery_area

# Description   : Character set of the database
# 字符集，重要!!! 建库后一般不能更改，所以建库前要确定清楚。
# (CHARACTERSET = "AL32UTF8" NATIONALCHARACTERSET= "UTF8")
CHARACTERSET = "ZHS16GBK"

# Description   : total memory in MB to allocate to Oracle
# oracle内存1638MB,物理内存2G*80%
# 不，此处应保留默认值800
TOTALMEMORY = "800" 
```

> GDBNAME 表示服务名，service_name，监听文件为 $ORACLE_HOME/network/admin/tnsnames.ora中可查看，如 plsql 中使用 192.168.3.127:1521/ORCL 连接数据库
>
> ```properties
> # tnsnames.ora Network Configuration File: /usr/local/oracle/product/11.2.0/db_1/network/admin/tnsnames.ora
> # Generated by Oracle configuration tools.
> 
> ORCL =
>   (DESCRIPTION =
>     (ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))
>     (CONNECT_DATA =
>       (SERVER = DEDICATED)
>       (SERVICE_NAME = ORCL)
>     )
>   )
> ```



> DATAFILEDESTINATION 表空间文件默认位置，select * from dba_data_files 可查看，如 system 表空间位置为 /home/oracle/oradata/orcl/system01.dbf



> OTALMEMORY 应保留默认值 800，不然调整 memory_target，启动时报 ORA-00838: Specified value of MEMORY_TARGET is too small 或 ORA-00845: MEMORY_TARGET not supported on this system

### 创建数据库实例

```bash
dbca -silent -responseFile /home/oracle/response/dbca.rsp
```

打印 100% complete 说明创建完成

检查进程

```bash
ps -ef | grep ora_ | grep -v grep
```



# 连接数据库

```bash
# 连接数据库
sqlplus / as sysdba
```

### 检查自动内存管理

```bash
show parameter memory
```

如 memory_max_target 和 memory_target 为0，说明 dbca.rsp 中的 TOTALMEMORY 配置有误（过大？），此时调整将无法启动

# 调整内存

```bash
alter system set memory_max_target = 60G scope = spfile;
alter system set memory_target = 40G scope = spfile;
shutdown immediate;
startup;
```

> memory_max_target 和 memory_target 的值不要超过物理内存的 3/4



> startup 报：ORA-00845: MEMORY_TARGET not supported on this system
>
> memory_max_target 大于 shm 分区，shm分区（mounted on /dev/shm）默认为物理内存的一半，可尝试增大该分区🥱

> [oracle调整内存大小 - 落魄运维 - 博客园 (cnblogs.com)](https://www.cnblogs.com/Dev0ps/p/9908997.html)

### 调整内存无法启动解决办法

##### ORA-00838: Specified value of MEMORY_TARGET is too small 或 ORA-00845: MEMORY_TARGET not supported on this system

创建实例时响应文件 dbca.ora 时设置了 TOTALMEMORY，经测试，保留默认值800，之后再调整内存可以

##### ORA-00845: MEMORY_TARGET not supported on this system

重建 spfile

```bash
sqlplus / as sysdba
# 重建 spfile
create spfile from pfile
# 启动
startup
```

如重建 spfile 提示 initorcl.ora 文件不存在

```bash
# 切换到oracle用户
su -l oracle
# 拷贝initorcl.ora
cp /usr/local/oracle/admin/orcl/pfile/init.ora.xxxx /usr/oracle/product/11.2.0/orcl/dbs/initorcl.ora
```

> cp 到 $ORACLE_HOME/orcl/dbs/initorcl.ora ?



##### 如遇到无法关闭也无法重启的情况

```bash
shutdown abort
```



# 删除实例

### 编辑响应文件

修改/home/oracle/response/dbca.rsp文件里以下几个参数，下面三个参数根据建库实际情况进行修改：

```properties
# 操作类型为删除数据库
OPERATION_TYPE = "deleteDatabase"
SOURCEDB = "orcl"
SYSDBAUSERNAME = "sys"
SYSDBAPASSWORD = "123456"
```

### 删除实例

```bash
dbca -silent -responseFile /home/oracle/response/dbca.rsp
```

> ORA-00845: MEMORY_TARGET not supported on this system
>
> 调整内存无法启动解决办法

# 卸载数据库

```bash
dbca -silent -delete Database -responseFile dbca.rsp
```

> 测试貌似无用
>
> [linux安装Oracle11G - 淼淼之森 - 博客园 (cnblogs.com)](https://www.cnblogs.com/mmzs/p/9033112.html)

### 使用 deinstall 工具卸载

```bash
// 切换到oracle用户
su -l oracle
cd $ORACLE_HOME
cd deinstall
./deinstall
```

> Oracle官方推荐的做法是使用后者，也就是专门的删除工具。原因是内置的deinstall工具脚本中常常带有很多bug，很多时候不能完全的将其删除干净。特别是Windows环境下的卸载工具，不能正常工作的场景很多。
>
> [使用Deinstall专用工具删除Oracle Database_ITPUB博客](http://blog.itpub.net/17203031/viewspace-711809/)

