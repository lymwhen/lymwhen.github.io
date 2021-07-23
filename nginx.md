检查连接数

netstat -a | findstr 8082

1. "listening":表示**监听** 表示这个端口**正在开放** 可以提供服务
2. "closing"：表示**关闭的** 表示端口人为或者防火墙使其关闭(也许服务被卸载)
3. "time wait" ：表示正在**等待连接** 就是你正在向该端口发送请求连接状态
4. "established"：表示是对方与你**已经连接** 正在通信交换数据



本地目录映射

```
        location /upload/ {
            root   E:/server/webapps/ROOT/upload;
            rewrite ^/upload/(.*)$ /$1 break;
        }
```

> [通过nginx实现windows系统下本地目录的映射_CherishL_的专栏-CSDN博客](https://blog.csdn.net/lovelovelovelovelo/article/details/75038594)

参数配置

```
keepalive_timeout 60;
tcp_nodelay on;
client_header_buffer_size 4k;
open_file_cache max=102400 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 1;
client_header_timeout 15;
client_body_timeout 15;
reset_timedout_connection on;
send_timeout 15;
server_tokens off;
client_max_body_size 10m;

```

keepalived_timeout ：客户端连接保持会话超时时间，超过这个时间，服务器断开这个链接。

tcp_nodelay：也是防止网络阻塞，不过要包涵在keepalived参数才有效。

client_header_buffer_size 4k：客户端请求头部的缓冲区大小，这个可以根据你的系统分页大小来设置，一般一个请求头的大小不会超过 1k，不过由于一般系统分页都要大于1k，所以这里设置为分页大小。分页大小可以用命令getconf PAGESIZE取得。

open_file_cache max=102400 inactive=20s ：这个将为打开文件指定缓存，默认是没有启用的，max指定缓存数量，建议和打开文件数一致，inactive 是指经过多长时间文件没被请求后删除缓存。

open_file_cache_valid 30s：这个是指多长时间检查一次缓存的有效信息。

open_file_cache_min_uses 1 ：open_file_cache指令中的inactive 参数时间内文件的最少使用次数，如果超过这个数字，文件描述符一直是在缓存中打开的，如上例，如果有一个文件在inactive 时间内一次没被使用，它将被移除。

client_header_timeout ： 设置请求头的超时时间。我们也可以把这个设置低些，如果超过这个时间没有发送任何数据，nginx将返回request time out的错误。

client_body_timeout设置请求体的超时时间。我们也可以把这个设置低些，超过这个时间没有发送任何数据，和上面一样的错误提示。

reset_timeout_connection ：告诉nginx关闭不响应的客户端连接。这将会释放那个客户端所占有的内存空间。

send_timeout ：响应客户端超时时间，这个超时时间仅限于两个活动之间的时间，如果超过这个时间，客户端没有任何活动，nginx关闭连接。

server_tokens ：并不会让nginx执行的速度更快，但它可以关闭在错误页面中的nginx版本数字，这样对于安全性是有好处的。

client_max_body_size：上传文件大小限制。

> [Nginx 性能优化有这篇就够了！ - 技术颜良 - 博客园 (cnblogs.com)](https://www.cnblogs.com/cheyunhua/p/10670070.html)

> yzk_web 视频暂停15s后播放会卡住，配置send_timeout解决

最大连接数配置

```
events {
  use  epoll;
  worker_connections  10240;
}
```

nginx 启动命令

```
# 重启
nginx -s reload
```

> [Nginx的启动、停止与重启 - codingcloud - 博客园 (cnblogs.com)](https://www.cnblogs.com/codingcloud/p/5095066.html)



负载均衡

```properties
events {
    worker_connections  10240;
}

http {
   upstream  myserver {
       server    172.16.10.100:8080;
       ip_hash;
   }

   server {
       listen       8080;
       server_name  localhost;

       location / {
           proxy_pass  http://myserver;
        }
    }
}
```

