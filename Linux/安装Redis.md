# 安装 Redis

> [!TIP]
>
> 适用于7.0版本安装
>
> [GitHub - redis/redis: Redis is an in-memory database that persists on disk. The data model is key-value, but many different kind of values are supported: Strings, Lists, Sets, Sorted Sets, Hashes, Streams, HyperLogLogs, Bitmaps.](https://github.com/redis/redis)



# 下载

> [Download | Redis](https://redis.io/download/)
>
> [Index of /releases/ (redis.io)](https://download.redis.io/releases/)

> 使用3.0.5，高版本redis需要高版本gcc编译器

# 解压

# 编译

```bash
cd redis
make

# 指定动态内存分配
make MALLOC=libc
```



### 编译失败

```bash
# 安装需要组件
yum install -y cpp binutils glibc glibc-common glibc-devel gcc
```

# 配置

```bash
vi redis/redis.conf
# 后台运行，如不配置关闭终端 redis 就会停止运行
daemonize yes
# 密码
requirepass password
```





# 启动 redis

```bash
cd redis/src
./redis-server ../redis.conf
```

> [!NOTE]
>
> 当使用绝对路径启动时，如配置为服务时，需要配置 redis.conf `dir`参数
>
> ```
> # The working directory.
> #
> # The DB will be written inside this directory, with the filename specified
> # above using the 'dbfilename' configuration directive.
> #
> # The Append Only File will also be created inside this directory.
> #
> # Note that you must specify a directory here, not a file name.
> # 工作目录，数据库将会被以上面dbfilename配置的文件名写入这个文件夹，AOF文件也会被写入这个文件夹
> dir /usr/local/server/redis/src
> ```
>
> AOF(Append Only File，仅追加文件)，与RDB(Redis Database，redis 数据库)相对应
>
> RDB：优势：单个紧凑文件保存数据，高性能，父进程分配工作，子进程执行磁盘I/O，易于备份，灾难恢复；缺点：一段时间才进行一次fork，完成持久化到磁盘，非正常关闭可能丢失数据
>
> AOF：优势：由于仅追加，非正常关闭时容易恢复数据，AOF文件变得太大时重写它；缺点：文件较大，可能较慢
>
> [Redis persistence | Redis](https://redis.io/docs/management/persistence/#:~:text=AOF (Append Only File)%3A AOF persistence logs every,the same format as the Redis protocol itself.)

# 允许远程连接

```bash
# bind 127.0.0.1 -::1
bind 0.0.0.0 -::1
protected-mode no
```

# 问题

##### 启动redis报 Memory overcommit must be enabled

```bash
[root@localhost redis-7.2.1]# src/redis-server redis.conf 
10260:C 14 Oct 2023 02:00:08.395 # WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
```

```bash
vim /etc/sysctl.conf
vm.overcommit_memory = 1
# 使配置生效
sysctl -p
```



# 测试 redis

```bash
# 运行 redis-cli
/usr/local/redis-3.0.5/src/redis-cli
# 鉴权
auth password
# 测试
ping
# 进行存取测试
set name test
keys *
```

# 创建软连接

```bash
ln -s /usr/local/redis-3.0.5/src/redis-server /usr/bin/redis-server
ln -s /usr/local/redis-3.0.5/src/redis-cli /usr/bin/redis-cli
```

# 启动redis

```bash
redis-server /usr/local/redis-3.0.5/redis.conf
# 启动redis-cli
redis-cli
```

