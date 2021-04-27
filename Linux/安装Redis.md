# 安装 Redis

# 下载

> 使用3.0.5，高版本redis需要高版本gcc编译器

# 解压

# 编译

```bash
cd redis
make
```



### 编译失败

```bash
# 安装需要组件
yum install cpp
yum install binutils
yum install glibc
yum install glibc-common
yum install glibc-devel
yum install gcc
```

# 配置

```bash
cd redis
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

# 测试 redis

```bash
# 运行 redis-cli
/usr/local/redis-3.0.5/src/redis-cli
# 鉴权
auth password
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

