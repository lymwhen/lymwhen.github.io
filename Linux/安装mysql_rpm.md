# rpm 方式安装 mysql

在有外网的情况下，比起源码方式，rpm 方式更方便。以在 CentOS7 下安装 mysql 8.0 为例。



# 安装 mysql 源

卸载已安装的 mysql

> 参看 [Linux/安装mysql - 卸载centos7系统自带mariadb](Linux/安装mysql?id=卸载centos7系统自带mariadb)

下载 mysql 8.0 源安装包

```bash
wget http://dev.mysql.com/get/mysql80-community-release-el7-8.noarch.rpm
```

> **`mysql80-community-release-el7-8.noarch.rpm`** 是一个 RPM 包，它用于在 CentOS 7 系统上配置 MySQL 8.0 Community Edition 的官方 Yum 仓库。这个包安装后，系统就能够通过 Yum 命令从官方仓库中安装、更新或卸载 MySQL 8.0 的相关软件包。
>
> 简要说明：
>
> - `mysql80`：标识这是 MySQL 8.0 版本的配置包。
> - `community-release`：表明这是 MySQL 社区版的发布包，非商业版。
> - `el7`：代表这个包适用于基于 Red Hat Enterprise Linux 7 或与其兼容的操作系统，比如 CentOS 7。
> - `8`：可能是该配置包的版本号。
> - `noarch`：表示这是一个与架构无关的包，也就是说它可以在任意 CPU 架构的 CentOS 7 系统上安装。
>
> 安装这个包之后，可以通过 `yum repolist` 查看已添加的仓库，然后使用 `yum install mysql-community-server` 安装 MySQL 8.0 Server。

安装mysql源

```bash
yum localinstall -y mysql80-community-release-el7-8.noarch.rpm
```

检查源是否安装成功

```bash
> yum repolist enabled | grep mysql
mysql-connectors-community/x86_64 MySQL Connectors Community                 242
mysql-tools-community/x86_64      MySQL Tools Community                      104
mysql80-community/x86_64          MySQL 8.0 Community Server                 465
```

### 安装mysql

```bash
yum install -y mysql-community-server
```

> [!NOTE]
>
> 安装提示错误
>
> ```bash
> Failing package is: mysql-community-client-8.0.36-1.el7.x86_64
> GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
> ```
>
> **这个是由于由于GPG密钥验证问题引起的**
>
> **解决方法1：**
>
> 需要禁掉GPG验证检查：
>
> ```bash
> yum -y install mysql-community-server --nogpgcheck
> ```

> [最新 CentOS7 上使用 yum 安装 MySQL8 超详细教程_centos 7.9yum安装mysql8-CSDN博客](https://blog.csdn.net/zp8126/article/details/137084854)

# 修改配置

### 创建所需目录

```bash
mkdir -p /data/mysql/data
mkdir -p /data/mysql/log
```



### 编辑配置文件

```bash
> vim /etc/my.cnf
# http://dev.mysql.com/doc/refman/8.0/en/server-configuration-defaults.html

[mysqld]
#
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

# datadir=/var/lib/mysql
datadir=/data/mysql/data
socket=/var/lib/mysql/mysql.sock

# log-error=/var/log/mysqld.log
log-error=/data/mysql/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pi

lower_case_table_names=1
```

> [!ATTENTION]
>
> 如果修改`socket`文件位置，即使连同`client`项一起修改：
>
> ```bash
> [client]
> socket=/xxx/xxx.sock
> ```
>
> 在客户端连接`mysql -uroot -p`时，会提示找不到`/var/lib/mysql/mysql.sock`（默认的socket位置），可见客户端仍然去原来的位置找 socket 文件，咱不知道如何解决，所以不建议修改。

### 重新配置

```bash
/usr/sbin/mysqld --user=mysql --initialize
```

> [!NOTE]
>
> 执行此命令之前，需要保证数据目录为空
>
> ```bash
> cd /data/mysql/data
> rm -rf *
> ```
>
> 如果成功，此命令应该会执行一小段时间

> [!TIP]
>
> 如果执行错误，可以查看错误信息：
>
> ```bash
> systemctl status mysqld
> ```
>
> 或者看日志文件：
>
> ```bash
> cat /data/mysql/log/mysqld.logxxxxxxxxxx cat /data/mysql/log/mysqld.logcat 
> ```
>
> 

> [!TIP]
>
> 可以修改 my.cnf 配置文件位置：
>
> ```bash
> # 复制配置文件
> cp /etc/my.cnf /data/mysql/
> # 指定配置文件
> /usr/sbin/mysqld --defaults-file=/data/mysql/my.cnf --user=mysql --initialize
> 
> # 完整命令：
> # mysqld --defaults-file=/etc/my.cnf (--basedir=/usr/local/mysql/ 可选项) --datadir=/data/mysql/(自定义路径) --user=mysql --initialize
> ```

> [linux安装mysql8.0使用rpm，以及解决更改datadir路径问题_mysql8.0.35rpm安装 linux 修改安装目录-CSDN博客](https://blog.csdn.net/m0_46661708/article/details/135084980)

### 启动mysql

```bash
# 启动mysql
systemctl start mysql
```

查看 mysql 临时密码

```bash
cat /data/mysql/log/mysqld.log
```

