# 安装 mysql

# 卸载CentOS7系统自带mariadb

```bash
# 查看系统自带的Mariadb
rpm -qa|grep mariadb
# 卸载系统自带的Mariadb
rpm -e --nodeps mariadb-libs-5.5.44-2.el7.centos.x86_64
# 删除etc目录下的my.cnf，mysql 默认使用 /%basedir%/my.cnf，其次默认 /etc/my.cnf
# 我们使用 basedir（mysql 目录下）
rm /etc/my.cnf

#检查mysql是否存在（存在则卸载）
rpm -qa | grep mysql
```





# 查看mysql用户和组是否存在

> mysql安装和运行在独立用户下，以保证其他用户系统的安全性

```bash
# 检查mysql组和用户是否存在，如无则创建
cat /etc/group | grep mysql
cat /etc/passwd | grep mysql 
# 如不存在，创建mysql用户组
groupadd mysql
# 创建一个用户名为mysql的用户，并加入mysql用户组
useradd -g mysql mysql
# 设置mysql用户的密码
passwd mysql
```



```bash
# 查询所有用户
cat /etc/passwd|grep -v nologin|grep -v halt|grep -v shutdown|awk -F ":" '{print $1 "|" $3 "1" $4}' | more
```





# 上传mysql安装包

WinSCP上传mysql安装包到/usr/local/

```bash
# 解压缩到/usr/local/
tar -zxvf mysql-5.7.25-linux-glibc2.12-x86_64.tar.gz
# 重命名文件夹为mysql
mv mysql-5.7.25-linux-glibc2.12-x86_64 mysql
# 更改所属的组和用户
chown -R mysql mysql/
chgrp -R mysql mysql/
```


# 在mysql文件夹下创建配置文件my.cnf

> mysql 默认使用 /%basedir%/my.cnf，其次默认 /etc/my.cnf，我们使用 basedir

```bash
cd /usr/local/mysql
vi my.cnf
内容见下方
Esc - :wq
```

> my.cnf 中配置的log文件均在/mysql/data 下
>
> vim 中粘贴可能丢失前几个字符，造成报错，注意检查

# 安装mysql

```bash
# 进入mysql目录
cd /usr/local/mysql
# 在mysql下创建数据文件夹data
mkdir data
chown -R mysql:mysql data
# 安装，结果末尾会打印root密码，记录密码
./bin/mysqld --initialize --user=mysql
./bin/mysqld --initialize --user=mysql --basedir=/usr/local/svr/mysql --datadir=/usr/local/svr/database
```

> [!NOTE]
>
> 如果mysql没有放在默认位置`/usr/local/mysql`，需要指定`basedir`和`datadir`，否则无法启动

# 开机启动和系统服务

> [!NOTE]
>
> 修改了安装参数或my.cnf指定了basedir之后，还需要在mysql 服务启动文件`.support-files/mysql.server`中指定 `basedir`、`datadir`
>
> ```bash
> vim support-files/mysql.server
> # If you change base dir, you must also change datadir. These may get
> # overwritten by settings in the MySQL configuration files.
> 
> basedir=/usr/local/server/mysql
> datadir=/usr/local/server/database
> ```

```bash
# 添加mysql server到系统服务
cp ./support-files/mysql.server /etc/rc.d/init.d/mysqld
# 添加权限
chmod +x /etc/rc.d/init.d/mysqld
# 开机启动
chkconfig --add mysqld
# 检查mysqld服务是否已经生效
chkconfig --list mysqld
# 切换至mysql用户，启动mysql
su mysql
service mysqld start
```

# mysql环境变量

```bash
# 切换至mysql用户
su - mysql
# 修改配置文件
vi ~/.bash_profile
增加export PATH=$PATH:/usr/local/mysql/bin
# 立即生效
source ~/.bash_profile
```

# 修改root密码

```bash
# 登陆mysql
mysql -uroot -p
# 输入刚刚记录的密码
# 修改root用户密码
set password for root@localhost=password("password");
```

# 数据备份与还原

> mysqldump 位于basedir/bin下，已经在环境变量中，Windows和Linux都可以直接使用

参看[数据库/mysql/命令行 - 备份还原](数据库/mysql/命令行.md?id=备份还原)

# 验证mysql用户

```bash
ps aux|grep mysqld
```

查看mysql进程信息中是否包含 --user=mysql，即由 mysql 用户运行的

# 报错

查看my.cnf中的 log-error配置的文件的内容

##### Unable to create socket-lock 

删除my.cnf中的socket配置，即使用默认配置

##### 安装报 error while loading shared libraries: libaio.so.1:

安装libaio

##### Tomcat 报 Table not exist

配置文件未生效，service mysqld restart

##### 启动报 Found option without preceding group in config file

配置文件存在错误

##### Windows 下修改 basedir 启动报错

新的数据文件夹安全选项卡下需要添加`NETWORK-SERVICE`用户/组，勾选完全控制

##### 没有使用默认的安装路径，但安装时报错默认路径（/usr/local/mysql）不存在

安装时指定basedir

##### 没有使用默认的安装路径，但启动时报错默认路径（/usr/local/mysql）不存在

mysql 服务文件中的需要指定`basedir`、`datadir`

- .support-files/mysql.server

- /etc/rc.d/init.d/mysqld

# 升级 mysql

查询版本号

```sql
select @@version;
select version();
```



### 备份数据

```bash
mysqldump -uroot -p -A > /usr/local/mysql/bak20220822.sql
# 远程备份
mysqldump -h192.168.3.200 -uroot -p -A > /usr/local/mysql/bak20220822.sql
```

### 关闭服务

升级最好不使用快速关闭

> innodb_fast_shutdown有3个值：
>
> 默认是1 可选0 1 2
>
> 支持全动态局设置
>
> 使用场景：在做数据库关闭升级的时候 set global innodb_fast_shutdown=0，这个时候能最大保障数据的完整性。
>
> 设置为1：关闭MySQL的时候不会做清除脏页和插入缓冲区的合并操作，也不会将脏页刷新到磁盘
>
> 设置为0：会做清除脏页和插入缓冲区的合并操作，也会将脏页全部刷新到磁盘上面去，但是这个时候关闭的速度也是最慢的
>
> 设置为2：不会做清除脏页和插入缓冲区的合并操作，也不会将脏页刷新到磁盘，但是会刷新到redo log里面，再下次启动mysql的时候恢复
>
> [Mysql innodb_fast_shutdown - Presley - 博客园 (cnblogs.com)](https://www.cnblogs.com/Presley-lpc/p/9177081.html)

```bash
mysql -uroot -p
# 查询innodb_fast_shutdown值
mysql> select @@innodb_fast_shutdown;
# 设置为0
mysql> set global innodb_fast_shutdown=0;
# 关闭mysql
cd /usr/local/mysql/bin
./mysqladmin -uroot -p shutdown
```

### 备份数据目录

```bash
cd /usr/local/datadisk
cp -rp data data_old
```

### 替换新版的 mysql 目录

> [!TIP]
>
> 此步骤涉及`/usr/local`目录操作，通常 mysql 只有`mysql`目录的权限，所以需要切换到 root 执行

```bash
tar -zxvf mysql-xxx.tar.gz -C /usr/local
cd /usr/local
mv mysql mysql_old
mv mysql-xxx mysql
# 将新版mysql所有者和属组给到mysql
chown -R mysql:mysql mysql

# 拷贝配置文件
cp -p mysql_old/my.cnf mysql
# 如果数据目录也在mysql目录中，也需要拷贝
```

> [!TIP]
>
> 建议不要将数据目录放在安装目录下，以便于安装，而且如果数据目录是挂载的硬盘，将会不好处理。

### 升级

```bash
# 定位到新版mysql目录
cd /usr/local/mysql
cd bin
# 启动mysql
./mysqld_safe --defaults-file=/usr/local/mysql/my.cnf
# 正常上一句就可以，也可以用下句，参数作用待查明
./mysqld_safe --defaults-file=/usr/local/mysql/my.cnf --pid-file=/usr/local/datadisk/data/mysql.upgrade.pid
```

启动成功的话，这里会阻塞 shell 终端，所以下面应该新开一个终端。如果报错可根据提示查看错误日志文件。

```bash
# 运行升级程序
./mysql_upgrade -uroot -p
# 关闭mysql
./mysqladmin -uroot -p shutdown
# 启动mysql服务
service mysqld start
```

查询版本号验证，查看数据是否正常。

> [记录mysql扫描漏洞，小版本升级_studymary的博客-CSDN博客_mysql漏洞扫描](https://blog.csdn.net/studymary/article/details/125797829)

# 配置文件

> [!TIP]
>
> 修改 mysql 监听端口应该修改`[mysqld]`下的`port`。

### my.cnf

```properties
# Other default tuning values
# MySQL Server Instance Configuration File
# ----------------------------------------------------------------------
# Generated by the MySQL Server Instance Configuration Wizard
#
#
# Installation Instructions
# ----------------------------------------------------------------------
#
# On Linux you can copy this file to /etc/my.cnf to set global options,
# mysql-data-dir/my.cnf to set server-specific options
# (@localstatedir@ for this installation) or to
# ~/.my.cnf to set user-specific options.
#
# On Windows you should keep this file in the installation directory 
# of your server (e.g. C:\Program Files\MySQL\MySQL Server X.Y). To
# make sure the server reads the config file use the startup option 
# "--defaults-file". 
#
# To run the server from the command line, execute this in a 
# command line shell, e.g.
# mysqld --defaults-file="C:\Program Files\MySQL\MySQL Server X.Y\my.ini"
#
# To install the server as a Windows service manually, execute this in a 
# command line shell, e.g.
# mysqld --install MySQLXY --defaults-file="C:\Program Files\MySQL\MySQL Server X.Y\my.ini"
#
# And then execute this in a command line shell to start the server, e.g.
# net start MySQLXY
#
#
# Guidelines for editing this file
# ----------------------------------------------------------------------
#
# In this file, you can use all long options that the program supports.
# If you want to know the options a program supports, start the program
# with the "--help" option.
#
# More detailed information about the individual options can also be
# found in the manual.
#
# For advice on how to change settings please see
# http://dev.mysql.com/doc/refman/5.7/en/server-configuration-defaults.html
#
#
# CLIENT SECTION
# ----------------------------------------------------------------------
#
# The following options will be read by MySQL client applications.
# Note that only client applications shipped by MySQL are guaranteed
# to read this section. If you want your own MySQL client program to
# honor these values, you need to specify it as an option during the
# MySQL client library initialization.
#
[client]

# pipe=

# socket=MYSQL

port=3306

[mysql]
no-beep

# default-character-set=


# SERVER SECTION
# ----------------------------------------------------------------------
#
# The following options will be read by the MySQL Server. Make sure that
# you have installed the server correctly (see above) so it reads this 
# file.
#
# server_type=3
[mysqld]

# The next three options are mutually exclusive to SERVER_PORT below.
# skip-networking
# enable-named-pipe
# shared-memory

# shared-memory-base-name=MYSQL

# The Pipe the MySQL Server will use
# socket=MYSQL

# The TCP/IP Port the MySQL Server will listen on
port=3306

# Path to installation directory. All paths are usually resolved relative to this.
# basedir="C:/Program Files/MySQL/MySQL Server 5.7/"

# Path to the database root
datadir=/usr/local/mysql/data

# The default character set that will be used when a new schema or table is
# created and no character set is defined
# character-set-server=

# The default storage engine that will be used when create new tables when
default-storage-engine=INNODB

# Set the SQL mode to strict
sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"

# General and Slow logging.
log-output=FILE

general-log=0

general_log_file="lyml.com.log"

slow-query-log=1

slow_query_log_file="lyml.com-slow.log"

long_query_time=10

# Binary Logging.
# log-bin

# Error Logging.
log-error="lyml.com.err"

# Server Id.
server-id=1

# Specifies the on how table names are stored in the metadata.
# If set to 0, will throw an error on case-insensitive operative systems
# If set to 1, table names are stored in lowercase on disk and comparisons are not case sensitive.
# If set to 2, table names are stored as given but compared in lowercase.
# This option also applies to database names and table aliases.
lower_case_table_names=1

# Secure File Priv.

# The maximum amount of concurrent sessions the MySQL server will
# allow. One of these connections will be reserved for a user with
# SUPER privileges to allow the administrator to login even if the
# connection limit has been reached.
max_connections=1000

# The number of open tables for all threads. Increasing this value
# increases the number of file descriptors that mysqld requires.
# Therefore you have to make sure to set the amount of open files
# allowed to at least 4096 in the variable "open-files-limit" in
# section [mysqld_safe]
table_open_cache=2000

# Maximum size for internal (in-memory) temporary tables. If a table
# grows larger than this value, it is automatically converted to disk
# based table This limitation is for a single table. There can be many
# of them.
tmp_table_size=16M

# How many threads we should keep in a cache for reuse. When a client
# disconnects, the client's threads are put in the cache if there aren't
# more than thread_cache_size threads from before.  This greatly reduces
# the amount of thread creations needed if you have a lot of new
# connections. (Normally this doesn't give a notable performance
# improvement if you have a good thread implementation.)
thread_cache_size=10

#*** MyISAM Specific options
# The maximum size of the temporary file MySQL is allowed to use while
# recreating the index (during REPAIR, ALTER TABLE or LOAD DATA INFILE.
# If the file-size would be bigger than this, the index will be created
# through the key cache (which is slower).
myisam_max_sort_file_size=100G

# If the temporary file used for fast index creation would be bigger
# than using the key cache by the amount specified here, then prefer the
# key cache method.  This is mainly used to force long character keys in
# large tables to use the slower key cache method to create the index.
myisam_sort_buffer_size=8M

# Size of the Key Buffer, used to cache index blocks for MyISAM tables.
# Do not set it larger than 30% of your available memory, as some memory
# is also required by the OS to cache rows. Even if you're not using
# MyISAM tables, you should still set it to 8-64M as it will also be
# used for internal temporary disk tables.
key_buffer_size=8M

# Size of the buffer used for doing full table scans of MyISAM tables.
# Allocated per thread, if a full scan is needed.
read_buffer_size=0

read_rnd_buffer_size=0

#*** INNODB Specific options ***
# innodb_data_home_dir=

# Use this option if you have a MySQL server with InnoDB support enabled
# but you do not plan to use it. This will save memory and disk space
# and speed up some things.
# skip-innodb

# If set to 1, InnoDB will flush (fsync) the transaction logs to the
# disk at each commit, which offers full ACID behavior. If you are
# willing to compromise this safety, and you are running small
# transactions, you may set this to 0 or 2 to reduce disk I/O to the
# logs. Value 0 means that the log is only written to the log file and
# the log file flushed to disk approximately once per second. Value 2
# means the log is written to the log file at each commit, but the log
# file is only flushed to disk approximately once per second.
innodb_flush_log_at_trx_commit=1

# The size of the buffer InnoDB uses for buffering log data. As soon as
# it is full, InnoDB will have to flush it to disk. As it is flushed
# once per second anyway, it does not make sense to have it very large
# (even with long transactions).
innodb_log_buffer_size=1M

# InnoDB, unlike MyISAM, uses a buffer pool to cache both indexes and
# row data. The bigger you set this the less disk I/O is needed to
# access data in tables. On a dedicated database server you may set this
# parameter up to 80% of the machine physical memory size. Do not set it
# too large, though, because competition of the physical memory may
# cause paging in the operating system.  Note that on 32bit systems you
# might be limited to 2-3.5G of user level memory per process, so do not
# set it too high.
innodb_buffer_pool_size=8M

# Size of each log file in a log group. You should set the combined size
# of log files to about 25%-100% of your buffer pool size to avoid
# unneeded buffer pool flush activity on log file overwrite. However,
# note that a larger logfile size will increase the time needed for the
# recovery process.
innodb_log_file_size=48M

# Number of threads allowed inside the InnoDB kernel. The optimal value
# depends highly on the application, hardware as well as the OS
# scheduler properties. A too high value may lead to thread thrashing.
innodb_thread_concurrency=9

# The increment size (in MB) for extending the size of an auto-extend InnoDB system tablespace file when it becomes full.
innodb_autoextend_increment=64

# The number of regions that the InnoDB buffer pool is divided into.
# For systems with buffer pools in the multi-gigabyte range, dividing the buffer pool into separate instances can improve concurrency,
# by reducing contention as different threads read and write to cached pages.
innodb_buffer_pool_instances=8

# Determines the number of threads that can enter InnoDB concurrently.
innodb_concurrency_tickets=5000

# Specifies how long in milliseconds (ms) a block inserted into the old sublist must stay there after its first access before
# it can be moved to the new sublist.
innodb_old_blocks_time=1000

# It specifies the maximum number of .ibd files that MySQL can keep open at one time. The minimum value is 10.
innodb_open_files=300

# When this variable is enabled, InnoDB updates statistics during metadata statements.
innodb_stats_on_metadata=0

# When innodb_file_per_table is enabled (the default in 5.6.6 and higher), InnoDB stores the data and indexes for each newly created table
# in a separate .ibd file, rather than in the system tablespace.
innodb_file_per_table=1

# Use the following list of values: 0 for crc32, 1 for strict_crc32, 2 for innodb, 3 for strict_innodb, 4 for none, 5 for strict_none.
innodb_checksum_algorithm=0

# The number of outstanding connection requests MySQL can have.
# This option is useful when the main MySQL thread gets many connection requests in a very short time.
# It then takes some time (although very little) for the main thread to check the connection and start a new thread.
# The back_log value indicates how many requests can be stacked during this short time before MySQL momentarily
# stops answering new requests.
# You need to increase this only if you expect a large number of connections in a short period of time.
back_log=80

# If this is set to a nonzero value, all tables are closed every flush_time seconds to free up resources and
# synchronize unflushed data to disk.
# This option is best used only on systems with minimal resources.
flush_time=0

# The minimum size of the buffer that is used for plain index scans, range index scans, and joins that do not use
# indexes and thus perform full table scans.
join_buffer_size=256K

# The maximum size of one packet or any generated or intermediate string, or any parameter sent by the
# mysql_stmt_send_long_data() C API function.
max_allowed_packet=4M

# If more than this many successive connection requests from a host are interrupted without a successful connection,
# the server blocks that host from performing further connections.
max_connect_errors=100

# Changes the number of file descriptors available to mysqld.
# You should try increasing the value of this option if mysqld gives you the error "Too many open files".
open_files_limit=4161

# If you see many sort_merge_passes per second in SHOW GLOBAL STATUS output, you can consider increasing the
# sort_buffer_size value to speed up ORDER BY or GROUP BY operations that cannot be improved with query optimization
# or improved indexing.
sort_buffer_size=256K

# The number of table definitions (from .frm files) that can be stored in the definition cache.
# If you use a large number of tables, you can create a large table definition cache to speed up opening of tables.
# The table definition cache takes less space and does not use file descriptors, unlike the normal table cache.
# The minimum and default values are both 400.
table_definition_cache=1400

# Specify the maximum size of a row-based binary log event, in bytes.
# Rows are grouped into events smaller than this size if possible. The value should be a multiple of 256.
binlog_row_event_max_size=8K

# If the value of this variable is greater than 0, a replication slave synchronizes its master.info file to disk.
# (using fdatasync()) after every sync_master_info events.
sync_master_info=10000

# If the value of this variable is greater than 0, the MySQL server synchronizes its relay log to disk.
# (using fdatasync()) after every sync_relay_log writes to the relay log.
sync_relay_log=10000

# If the value of this variable is greater than 0, a replication slave synchronizes its relay-log.info file to disk.
# (using fdatasync()) after every sync_relay_log_info transactions.
sync_relay_log_info=10000

# Load mysql plugins at start."plugin_x ; plugin_y".
# plugin_load

# The TCP/IP Port the MySQL Server X Protocol will listen on.
# loose_mysqlx_port=33060
```

