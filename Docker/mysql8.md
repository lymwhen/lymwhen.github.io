# Mysql8

# 安装

```bash
# 持久化目录
mkdir -p opt/mysql/conf
mkdir -p opt/mysql/log
mkdir -p opt/mysql/data

# 创建配置文件
vim /opt/mysql/conf/my.cnf
[mysqld]
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
# innodb_buffer_pool_size = 128M
#
# Remove the leading "# " to disable binary logging
# Binary logging captures changes between backups and is enabled by
# default. It's default setting is log_bin=binlog
# disable_log_bin
#
# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
# join_buffer_size = 128M
# sort_buffer_size = 2M
# read_rnd_buffer_size = 2M
#
# Remove leading # to revert to previous value for default_authentication_plugin,
# this will increase compatibility with older clients. For background, see:
# https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_default_authentication_plugin
# default-authentication-plugin=mysql_native_password

datadir=/data/mysql/data
socket=/var/lib/mysql/mysql.sock

log-error=/data/mysql/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

lower_case_table_names=1
# skip-grant-tables
```

```bash
# 启动容器
docker run -p 3306:3306 --name mysql -v /opt/mysql/log:/var/log/mysql -v /opt/mysql/data:/var/lib/mysql -v /opt/mysql/conf:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=root -d mysql:8.0

# 进入容器，密码为root
docker exec -it mysql mysql -uroot -p

# 修改'root'@'localhost'密码、创建应用连接的用户和授权等
```



### 配置文件

` /etc/my.cnf` > `/etc/mysql/my.cnf`

`/etc/my.cnf`内容：

```bash
[mysqld]
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
# innodb_buffer_pool_size = 128M
#
# Remove the leading "# " to disable binary logging
# Binary logging captures changes between backups and is enabled by
# default. It's default setting is log_bin=binlog
# disable_log_bin
#
# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
# join_buffer_size = 128M
# sort_buffer_size = 2M
# read_rnd_buffer_size = 2M
#
# Remove leading # to revert to previous value for default_authentication_plugin,
# this will increase compatibility with older clients. For background, see:
# https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_default_authentication_plugin
# default-authentication-plugin=mysql_native_password

# 自定义的数据目录
datadir=/data/mysql/data
socket=/var/lib/mysql/mysql.sock

# 自定义的日志位置
log-error=/data/mysql/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
```

它包含了`/etc/mysql/conf.d/`下的配置文件，描述为自定义配置应该放在此处，所以 docker`-v`参数持久化的目录配置这个`conf.d`即可。

> [【MySQL】MySQL的配置文件的区别和说明_my.conf文件和cnf-CSDN博客](https://blog.csdn.net/XY1790026787/article/details/104596519)

### 创建用户和授权

```sql
mysql> create user 'root'@'192.168.1.39' identified by 'root';
Query OK, 0 rows affected (0.03 sec)

mysql> grant all privileges on *.* to 'root'@'192.168.1.39';
Query OK, 0 rows affected (0.01 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.02 sec)
```

> [!NOTE]
>
> mysql 5.7 可以通过`grant`直接创建用户，mysql8 需要首先创建用户。如果提示`ERROR 1396 (HY000): Operation CREATE USER failed for 'root'@'%'`，说明用户已存在，直接授权即可。

### 修改密码

```sql
alter user 'root'@'localhost' IDENTIFIED BY 'root';
```

##### 无密码登录

若忘记密码了，或一开始安装的时候没有设置密码，找到mysql安装目录下的my.ini，并在最后一行 添加skip-grant-tables

```sql
skip-grant-tables
```

无密码模式修改密码会提示：

```
ERROR 1290 (HY000): The MySQL server is running with the --skip-grant-tables option so it cannot execute this statement
```

执行`flush privileges`后，再修改密码

---

##### 方法二

```bash
# 停止mysql服务
systemctl stop mysqld
# 无密码启动
/usr/sbin/mysqld --skip-grant-tables --user=mysql
```

此时窗口会被阻塞，使用另一个窗口执行`mysql -uroot -p`，然后输入任意密码即可进入

### Docker mysql 导出

```sql
# 导出全部
docker exec -it mysql8 mysqldump -uroot -proot -A > /home/lymly/docker/mysql8.sql
# 导出指定数据库
docker exec -it mysql8 mysqldump -uroot -proot ktz_web > /home/lymly/docker/mysql8.sql
```

> [!NOTE]
>
> 使用`-A`参数导出时，导入的时候也是全部数据库导入，无法具体指定哪个库，所以建议还是数据库分开导出，同时表结构和数据、存储过程、事件、触发器最好也分开导出，这点待测试。
>
> **导出之后，需要打开检查导出的文件，因为如果导出出错，控制台不会有显示，而是写入到目标 sql 文件中。**

> 参考`mysqldump`参数：
>
> ```sql
> 导出数据库，表结构和数据
> mysqldump -u root -p admin > C:\kakeiinput.sql
> 导出存储过程和函数
> mysqldump -R -ndt admin -u root -p > C:\prorandfunc.sql
> 导出事件
> mysqldump -E -ndt admin -u root -p > C:\events.sql
> 导出触发器
> mysqldump -triggers admin -u root -p > C:\triggers.sql
> ```
>
> [Docker使用mysqldump命令备份导出mysql容器中的数据_docker mysqldump-CSDN博客](https://blog.csdn.net/wwj256/article/details/121951871)

### Docker mysql 导入

> [!NOTE]
>
> 如果导出时命令行中包含密码，目标 sql 文件前面会有警告信息：
>
> ```bash
> mysqldump: [Warning] Using a password on the command line interface can be insecure.
> ```
>
> 导入之前需要将它删除。

> [!NOTE]
>
> 只导出某个库的话，导入之前需要先创建数据库。

```sql
docker exec -i mysql8 mysql -uroot -proot ktz_web < /home/lymly/docker/mysql8.sql
```

### Docker mysql 修改 lower_case_table_names

> [!NOTE]
>
> 这个操作是删除数据，重新用配置文件配置 mysql，仅仅是比重新安装好点:dog:

```bash
# 导出数据
docker exec -it mysql8 mysqldump -uroot -proot yzs_web > /home/lymly/docker/yzs_web.sql
# 修改配置文件，加入lower_case_table_names配置
sudo vim my.cnf
[mysqld]
lower_case_table_names=1
# 进入容器
docker exec -it mysql8 /bin/bash
# 删除数据目录
rm -rf /var/lib/mysql/*
# 重新配置
mysqld --initialize-insecure --user=mysql --datadir=/var/lib/mysql
# 重启mysql容器
docker restart mysql8
```

