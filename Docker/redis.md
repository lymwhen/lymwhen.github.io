# redis

### Docker 安装

```bash
# 创建目录
mkdir -p /opt/redis/conf
mkdir -p /opt/redis/data

# 创建配置文件
vim /opt/redis/conf/redis.conf
bind 0.0.0.0
protected-mode no
daemonize no
appendonly yes
requirepass root
```

```bash
docker run -p 6379:6379 --name redis --restart=always -v /opt/redis/conf/redis.conf:/etc/redis/redis.conf -v /opt/redis/data:/data -d redis:5.0 redis-server /etc/redis/redis.conf --appendonly yes
```

### 客户端连接

```bash
redis-cli -h 10.0.3.12 -p 6379 -a root

docker exec -it redis redis-cli
```

# 集群

### 模式

1. **主从复制模式（Master-Slave Replication）**：
   - 一个主节点可以有多个从节点，主节点处理写操作，从节点同步主节点的数据。
   - 优点包括数据冗余和备份，读写分离提高性能。
   - 缺点是主节点故障时需要手动切换到从节点，可用性较低。
2. **哨兵模式（Sentinel）**：
   - 哨兵模式在主从复制的基础上增加了监控和自动故障转移功能。
   - 哨兵可以监控主节点的健康状态，并在主节点故障时自动选举新的主节点。
   - 提供了高可用性，但仍然存在单点写入的性能瓶颈。
3. **Cluster模式（Redis Cluster）**：
   - Redis Cluster是官方提供的分布式解决方案，支持数据分片和自动故障转移。
   - 集群由多个节点组成，每个节点负责一部分数据分片（slots），总共有16384个slots。
   - 优点是去中心化，支持在线扩容和缩容，具有高可用性和线性扩展能力。
   - 缺点是不支持多键操作，如同时操作多个键的事务。

简单来说优缺点：

- 主从复制：数据备份，没有自动故障转移，需要手动处理
- 哨兵模式：在主从复制上增加了自动故障转移功能，但写入由主节点 master 负担，存在性能瓶颈
- 集群模式：解决数据分片、高性能、高可用问题，需要的服务器较多，至少 3 台（等于哨兵模式），有效 6 台

### 术语

sentinel：哨兵，检测主节点 master，通过投票对主节点是否宕机进行判断

SDown：主观下线，某一哨兵认为主节点宕机

ODown：客观下线，哨兵通过投票认定主节点宕机，将进行故障转移

quorum：人数/票数，`sentinel monitor`中的配置参数，超过此数值的主观下线，认定为客观下线

Failover：故障转移，操作从节点 slave 成为 主节点 master

Election：选举领导者，进行故障转移

majority：多数票，选举中能够胜出的票数，如 2 个哨兵时为2， 3 个哨兵时为 2，5 个哨兵时为 3

# 主从复制

master：主，无需额外配置

```bash
bind 0.0.0.0
protected-mode no
daemonize no
appendonly yes
requirepass root
masterauth root
```

> [!NOTE]
>
> 一说是为了 master 上线后 sentinel 将其切换回 master，所以主节点也需要配置`masterauth`，即自己的密码。
>
> ```
> vim /opt/redis/conf/redis.conf
> masterauth root
> ```

slave：从：

```bash
bind 0.0.0.0
protected-mode no
daemonize no
appendonly yes
requirepass root
slaveof 10.0.3.11 6379
masterauth root
```

### 验证

```bash
# 查看服务器信息
redis-cli info replication
docker exec -it redis redis-cli -p 6379 -a root info replication
```



```bash
# master
# Replication
role:master
connected_slaves:1
slave0:ip=10.0.3.12,port=6379,state=online,offset=14,lag=1
master_replid:82228761cd7257148907cc60238a08ae33446e39
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:14
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:14

# slave
# Replication
role:slave
master_host:10.0.3.11
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_repl_offset:28
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:82228761cd7257148907cc60238a08ae33446e39
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:28
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:28
```

可以看到服务器所属的角色（主或从），以及连接的从数量

> [!TIP]
>
> 如果没有连上，检查：
>
> 1. 主从之间网络是否通畅
> 2. slave 上配置的 master 密码是否正确

### 测试

- 在 master 上 set 值，slave 上可以看到
- 在 slave 上无法写入值，因为默认 slave 是只读的

所以主从复制可以解决：

- 数据备份
- slave 可以用于分担读的压力

无法解决：

- master 主从关系是固定的，无法自动故障切换，需要人工介入用 slave 替换 master

# sentinel 哨兵

```bash
vim /opt/redis/conf/sentinel.conf
bind 0.0.0.0
port 26379
protected-mode no
sentinel monitor redis-master 10.0.3.12 6379 1
sentinel down-after-milliseconds redis-master 2000
sentinel auth-pass redis-master root
sentinel announce-ip "10.0.3.12"
sentinel announce-port 26379
```

> [!TIP]
>
> 可以看到此处仅配置了主节点 master 的密码，故障转移时，sentinel 切换主从使用的都是这个密码，所以需要主从 redis 配置相同的密码。

### 配置说明

```bash
sentinel monitor <master-name> <ip> <redis-port> <quorum>
```

master-name：主节点名称，可以自行指定，但多个哨兵之间要保持一致。

ip/port：master 的 ip 和端口。

quorum：投票数，达到此数量哨兵标记为主观下线时，服务器才会被标注为客观下线。

所有哨兵都指向master，会自动检测slave。

---

```bash
sentinel down-after-milliseconds redis-master 2000
```

若服务器在给定的毫秒数之内， 没有返回Sentinel发送的PING命令的回复，或者返回一个错误， 那么Sentinel将这个服务器标记为主观下线（subjectively down，简称SDOWN）。

不过只有一个Sentinel将服务器标记为主观下线并不一定会引起服务器的自动故障迁移：只有在足够数量的Sentinel都将一个服务器标记为主观下线之后， 服务器才会被标记为客观下线（objectively down，简称ODOWN），这时自动故障迁移才会执行。

---

```bash
sentinel auth-pass redis-master root
```

主节点密码，当 redis 配置了密码（`requirepass password`）时，此处应需要配置密码。

---

```bash
sentinel announce-ip "10.0.3.12"
sentinel announce-port 26379
```

在 Docker 等网络/端口映射的情况下，需要声明对外的 ip 和 端口。如果`info sentinel`检查正常，但无法自动转移，务必检查此项配置。

> [!TIP]
>
> 实测在 Docker 环境下部署，这里的配置基本都是必要配置。

### 启动容器

```bash
docker run -p 26379:26379 --name redis-sentinel --restart=always -v /opt/redis/conf/sentinel.conf:/etc/redis/sentinel.conf -d redis:5 redis-sentinel /etc/redis/sentinel.conf
```

### 检查

```bash
# 查看哨兵信息
redis-cli -p 26379 info sentinel
docker exec -it redis-sentinel redis-cli -p 26379 info sentinel
# 可以打开 redis-sentinel 容器日志，观看故障、投票、主从切换的过程
docker logs -f redis-sentinel
# 主从切换后，可以查看redis的主从情况
docker exec -it redis redis-cli -p 6379 -a root info replication
```

```bash
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=redis-master,status=ok,address=10.0.3.11:6379,slaves=1,sentinels=2
```

可以看到最后一行描述节点群组0、名称、连接状态为ok（未连接为down）、主节点 master ip/端口、从节点 slave 1个，哨兵 2 个。

查看 sentinel 配置文件，发现已经被自动更改。

```bash
vim /opt/redis/conf/sentinel.conf
sentinel myid 1c10608d73996655525c6903f492da6f5896dfe0
# Generated by CONFIG REWRITE
bind 0.0.0.0
port 26379
protected-mode no
dir "/data"
sentinel deny-scripts-reconfig yes
sentinel monitor redis-master 10.0.3.11 6379 1
sentinel down-after-milliseconds redis-master 2000
sentinel auth-pass redis-master root
sentinel config-epoch redis-master 22
sentinel leader-epoch redis-master 24
# 发现的从节点
sentinel known-replica redis-master 10.0.3.12 6379
# 发现的其他哨兵
sentinel known-sentinel redis-master 10.0.3.11 26379 71bbae66cbb326afce41e2675e345e8aae84f2c7
sentinel current-epoch 24
sentinel announce-ip "10.0.3.12"
sentinel announce-port 26379
```

> [!TIP]
>
> redis sentinel 会将配置写回配置文件，以便关闭时记住状态？当然我们自行配置的关键项不会被抹去。

### 测试

服务器：

- 10.0.3.11：master
- 10.0.3.12：slave

关闭 11 redis，主备切换

```bash
1:X 14 Sep 2024 15:13:09.037 # +odown master redis-master 10.0.3.11 6379 #quorum 1/1
1:X 14 Sep 2024 15:13:35.665 # +new-epoch 26
1:X 14 Sep 2024 15:13:35.665 # +try-failover master redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:35.679 # +vote-for-leader 1c10608d73996655525c6903f492da6f5896dfe0 26
1:X 14 Sep 2024 15:13:35.690 # 71bbae66cbb326afce41e2675e345e8aae84f2c7 voted for 1c10608d73996655525c6903f492da6f5896dfe0 26
1:X 14 Sep 2024 15:13:35.737 # +elected-leader master redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:35.737 # +failover-state-select-slave master redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:35.813 # +selected-slave slave 10.0.3.12:6379 10.0.3.12 6379 @ redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:35.813 * +failover-state-send-slaveof-noone slave 10.0.3.12:6379 10.0.3.12 6379 @ redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:35.869 * +failover-state-wait-promotion slave 10.0.3.12:6379 10.0.3.12 6379 @ redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:36.022 # +promoted-slave slave 10.0.3.12:6379 10.0.3.12 6379 @ redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:36.022 # +failover-state-reconf-slaves master redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:36.065 # +failover-end master redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:13:36.066 # +switch-master redis-master 10.0.3.11 6379 10.0.3.12 6379
1:X 14 Sep 2024 15:13:36.066 * +slave slave 10.0.3.11:6379 10.0.3.11 6379 @ redis-master 10.0.3.12 6379
1:X 14 Sep 2024 15:13:38.075 # +sdown slave 10.0.3.11:6379 10.0.3.11 6379 @ redis-master 10.0.3.12 6379
```

发现12已变为主

```bash
10.0.3.12:6379> info replication
# Replication
role:master
connected_slaves:0
master_replid:45696833aa47a2ce140bfe615854c39d1369547c
master_replid2:8859bdcbe41922d9dc2faad9e0be8c2c6990ebc5
master_repl_offset:49490
second_repl_offset:29174
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:49490
```

启动11 redis，它被设为slave

```bash
1:X 14 Sep 2024 15:16:32.360 # -sdown slave 10.0.3.11:6379 10.0.3.11 6379 @ redis-master 10.0.3.12 6379
1:X 14 Sep 2024 15:16:42.357 * +convert-to-slave slave 10.0.3.11:6379 10.0.3.11 6379 @ redis-master 10.0.3.12 6379
```

```bash
10.0.3.11:6379> info replication
# Replication
role:slave
master_host:10.0.3.12
master_port:6379
master_link_status:up
master_last_io_seconds_ago:0
master_sync_in_progress:0
slave_repl_offset:92291
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:45696833aa47a2ce140bfe615854c39d1369547c
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:92291
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:54667
repl_backlog_histlen:37625
```

同理，此时关闭 12 redis，11 会被切换成 master。

# 主从切换失败的情况

复现：直接关闭11电源

```bash
# 新时代32，即第32此选举
1:X 14 Sep 2024 15:35:52.262 # +new-epoch 32
# 尝试故障转移
1:X 14 Sep 2024 15:35:52.262 # +try-failover master redis-master 10.0.3.11 6379
# 开始选举领导者
1:X 14 Sep 2024 15:35:52.276 # +vote-for-leader 1c10608d73996655525c6903f492da6f5896dfe0 32
# 没有当选的领导者，故障转移中止
1:X 14 Sep 2024 15:36:02.427 # -failover-abort-not-elected master redis-master 10.0.3.11 6379
1:X 14 Sep 2024 15:36:02.494 # Next failover delay: I will not start a failover before Sat Sep 14 15:36:12 2024
```

从主节点宕机到故障转移，需要经过两个步骤

1. 主节点出现故障，哨兵节点通过心跳检测发现主节点不可用。
2. 多个哨兵节点对主节点的故障达成一致，即客观下线。
3. 哨兵节点之间进行领导者选举。
4. 选举出的领导者哨兵负责故障转移，选择一个从节点提升为新的主节点，并更新其他从节点的配置，指向新的主节点。

**在 Redis Sentinel 中，如果只有两个哨兵，其中一个哨兵掉线，剩下的一个哨兵将无法进行故障转移的领导者选举，因为根据Redis Sentinel的工作原理，至少需要`max(quorum, num(sentinels)/2+1)`个哨兵同意才能选出领导者。如果哨兵数量为2，那么至少需要2个哨兵中的大多数（即2个）同意才能进行领导者选举。在这种情况下，只剩下一个哨兵，无法满足选举条件，因此无法进行故障转移。**

**在实际部署中，建议至少部署三个哨兵节点，以确保在至少一个哨兵节点故障时，系统仍然能够进行领导者选举和故障转移。此外，`quorum`参数的设置也非常重要，它决定了需要多少个哨兵节点同意才能认为主节点客观下线，以及进行领导者选举。通常建议将`quorum`设置为哨兵节点数的一半加一，以确保系统的高可用性和避免脑裂现象。**仅两台服务器无法实现真正意义的双机热备，网上教程中的双机热备，没有考虑主节点和哨兵一起宕机的情况。
