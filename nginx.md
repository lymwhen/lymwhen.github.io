# nginx

[Basic HTTP server features](http://nginx.org/en/#basic_http_features)<br>[Other HTTP server features](http://nginx.org/en/#other_http_features)<br>[Mail proxy server features](http://nginx.org/en/#mail_proxy_server_features)<br>[TCP/UDP proxy server features](http://nginx.org/en/#generic_proxy_server_features) <br>[Architecture and scalability](http://nginx.org/en/#architecture_and_scalability) <br>[Tested OS and platforms](http://nginx.org/en/#tested_os_and_platforms) 

nginx [engine x] is an HTTP and reverse proxy server, a mail proxy server, and a generic TCP/UDP proxy server, originally written by [Igor Sysoev](http://sysoev.ru/en/). For a long time, it has been running on many heavily loaded Russian sites including [Yandex](http://www.yandex.ru/), [Mail.Ru](http://mail.ru/), [VK](http://vk.com/), and [Rambler](http://www.rambler.ru/). According to Netcraft, nginx served or proxied [22.57% busiest sites in July 2021](https://news.netcraft.com/archives/2021/07/26/july-2021-web-server-survey.html). Here are some of the success stories: [Dropbox](https://blogs.dropbox.com/tech/2017/09/optimizing-web-servers-for-high-throughput-and-low-latency/), [Netflix](https://openconnect.netflix.com/en/software/), [Wordpress.com](https://www.nginx.com/case-studies/nginx-wordpress-com/), [FastMail.FM](http://blog.fastmail.fm/2007/01/04/webimappop-frontend-proxies-changed-to-nginx/).

The sources and documentation are distributed under the [2-clause BSD-like license](http://nginx.org/LICENSE).

Commercial support is available from [Nginx, Inc.](https://www.nginx.com/)



# 检查连接数

```bash
netstat -a | findstr 8082
```

> 1. "listening":表示**监听** 表示这个端口**正在开放** 可以提供服务
> 2. "closing"：表示**关闭的** 表示端口人为或者防火墙使其关闭(也许服务被卸载)
> 3. "time wait" ：表示正在**等待连接** 就是你正在向该端口发送请求连接状态
> 4. "established"：表示是对方与你**已经连接** 正在通信交换数据
>

# nginx 命令

```
# 启动
nginx
# 重启
nginx -s reload
# 停止
nginx -s stop
# 检查配置文件
nginx -t
```

> [Nginx的启动、停止与重启 - codingcloud - 博客园 (cnblogs.com)](https://www.cnblogs.com/codingcloud/p/5095066.html)



# 本地目录映射

```nginx
location /upload/ {
    root   E:/server/webapps/ROOT/upload;
    rewrite ^/upload/(.*)$ /$1 break;
}
```

> [通过nginx实现windows系统下本地目录的映射_CherishL_的专栏-CSDN博客](https://blog.csdn.net/lovelovelovelovelo/article/details/75038594)

# 负载均衡

```nginx
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

# hls 流转发

```nginx
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       83 ssl;
        server_name  mywebsite.com;
		
		ssl_certificate     D:/nginx-1.18.0/conf/qjjsxy.com_with_chain.crt;
		ssl_certificate_key D:/nginx-1.18.0/conf/qjjsxy.com_server.key;
		ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
		ssl_ciphers         HIGH:!aNULL:!MD5:!DH;
		ssl_prefer_server_ciphers on;
		
		proxy_connect_timeout 300;
		proxy_send_timeout 300;
		proxy_read_timeout 300;
		send_timeout 300;
		uwsgi_read_timeout 300;

        location /openUrl/ {
        #    root   html;
        #    index  index.html index.htm;
            proxy_pass http://192.168.30.210:83/openUrl/;
            types {
				application/vnd.apple.mpegurl m3u8;
				video/mp2t ts;
			}
            
			add_header Cache-Control no-cache;
			client_max_body_size 50m; #允许客户端请求的最大单文件字节数
			client_body_buffer_size 1m;#缓冲区代理缓冲用户端请求的最大字节数，
			proxy_buffer_size 256k;#设置代理服务器（nginx）保存用户头信息的缓冲区大小
			proxy_buffers 4 256k;  #proxy_buffers缓冲区，网页平均在256k下，这样设置
			proxy_busy_buffers_size 256k; #高负荷下缓冲大小（proxy_buffers*2）
			proxy_temp_file_write_size 256k;  #设定缓存文件夹大小
			proxy_next_upstream error timeout invalid_header http_500 http_503 http_404;
			proxy_max_temp_file_size 128m;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```



# https 配置

```nginx
server {
    listen       83 ssl;
    server_name  mywebsite.com;

    ssl_certificate     D:/nginx-1.18.0/conf/mywebsite.com_with_chain.crt;
    ssl_certificate_key D:/nginx-1.18.0/conf/mywebsite.com_server.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5:!DH;
    ssl_prefer_server_ciphers on;
}
```



# 参数配置

```nginx
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

> yzk_web 视频暂停60s后播放会卡住，配置send_timeout解决

### 进程数

```nginx
worker_processes  8;
```

> 一般配置为 CPU 核心数，如 4 核 8 线程，配置为8

### 最大连接数

```nginx
events {
    worker_connections  10240;
}
```



