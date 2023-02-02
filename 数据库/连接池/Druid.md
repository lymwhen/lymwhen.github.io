# Druid

测试：[奇奇怪怪的问题-Druid+Oracle连接超时关闭问题-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/814058)

# 参数

#### minEvictableIdleTimeMillis 和 maxEvictableIdleTimeMillis

minEvictableIdleTimeMillis：连接空闲时间大于该值并且池中空闲连接大于minIdle则关闭该连接

maxEvictableIdleTimeMillis：连接空闲时间大于该值，不管minIdle都关闭该连接

> ```java
> //关闭条件，空闲时间大于minEvictableIdleTimeMillis，并且空闲连接大于minIdle，
> // 其中checkCount为poolingCount - minIdle，即可能被关闭的连接数量
> //或者空闲时间大于maxEvictableIdleTimeMillis
> if (idleMillis >= minEvictableIdleTimeMillis) {
>     if (checkTime && i < checkCount) {
>         evictConnections[evictCount++] = connection;
>         continue;
>     } else if (idleMillis > maxEvictableIdleTimeMillis) {
>         evictConnections[evictCount++] = connection;
>         continue;
>     }
> }
> ```
>
> [Druid配置参数详解-maxEvictableIdleTimeMillis,minEvictableIdleTimeMillis - 简书 (jianshu.com)](https://www.jianshu.com/p/be9dbe640daf)