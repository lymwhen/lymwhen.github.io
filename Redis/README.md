# Redis

> [Redis](https://redis.io/)
>
> [microsoftarchive/redis: Redis is an in-memory database that persists on disk. The data model is key-value, but many different kind of values are supported: Strings, Lists, Sets, Sorted Sets, Hashes (github.com)](https://github.com/microsoftarchive/redis)

Linux 下安装参看[Linux/安装Redis](Linux/安装Redis)

# 配置

```properties
# 密码
requirepass password
```

# 命令

|通配符	|含义	|举例|
|----	|----	|----|
|?	|匹配任意的一个字符	|“a?”可以匹配“ab”，“aa”等字符串|
|*	|匹配任意个字符（可以是0个）	|“a*”可以匹配“a”，“abc”等字符串|
|[]	|匹配括号中的任意一个字符	|“a[ab]”可以匹配“aa”，“ab”两个字符串，其它的不可以匹配|
|\	|转义，转义“?”这种特殊字符，使其变为一般字符	|“a\?”匹配的是“a?”字符串，取消了“?”符号的含义|

|命令	|功能	|返回值|
|----	|----	|----|
|KEYS	|得到指定的key	|key的名称|
|EXISTS	|判断指定的key是否存在	|存在返回1，不存在返回0|
|TYPE	|得到指定的key的类型	|存在返回key的类型，不存在返回none|
|DEL	|删除指定的key	|返回成功删除元素的个数|

```bash
# 验证密码
127.0.0.1:6379> auth password
OK
# 所有key
127.0.0.1:6379> keys *
# 通配符查找key
127.0.0.1:6379> keys test_*
# 设置key
127.0.0.1:6379> set test1 haiyiya
OK
127.0.0.1:6379> ttl test1
(integer) -1
# 设置key，带过期时间（秒）
127.0.0.1:6379> set test2 haierya ex 60
OK
127.0.0.1:6379> ttl test2
(integer) 58
# 清空
flushall
```

