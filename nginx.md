# nginx

[Basic HTTP server features](http://nginx.org/en/#basic_http_features)<br>[Other HTTP server features](http://nginx.org/en/#other_http_features)<br>[Mail proxy server features](http://nginx.org/en/#mail_proxy_server_features)<br>[TCP/UDP proxy server features](http://nginx.org/en/#generic_proxy_server_features) <br>[Architecture and scalability](http://nginx.org/en/#architecture_and_scalability) <br>[Tested OS and platforms](http://nginx.org/en/#tested_os_and_platforms) 

nginx [engine x] is an HTTP and reverse proxy server, a mail proxy server, and a generic TCP/UDP proxy server, originally written by [Igor Sysoev](http://sysoev.ru/en/). For a long time, it has been running on many heavily loaded Russian sites including [Yandex](http://www.yandex.ru/), [Mail.Ru](http://mail.ru/), [VK](http://vk.com/), and [Rambler](http://www.rambler.ru/). According to Netcraft, nginx served or proxied [22.57% busiest sites in July 2021](https://news.netcraft.com/archives/2021/07/26/july-2021-web-server-survey.html). Here are some of the success stories: [Dropbox](https://blogs.dropbox.com/tech/2017/09/optimizing-web-servers-for-high-throughput-and-low-latency/), [Netflix](https://openconnect.netflix.com/en/software/), [Wordpress.com](https://www.nginx.com/case-studies/nginx-wordpress-com/), [FastMail.FM](http://blog.fastmail.fm/2007/01/04/webimappop-frontend-proxies-changed-to-nginx/).

The sources and documentation are distributed under the [2-clause BSD-like license](http://nginx.org/LICENSE).

Commercial support is available from [Nginx, Inc.](https://www.nginx.com/)

> [http核心模块-Nginx中文文档](https://www.nginx.cn/doc/standard/httpcore.html)



# 检查连接数

```bash
netstat -a | findstr 8082
```

> 1. `listening`表示**监听** 表示这个端口**正在开放** 可以提供服务
> 2. `closing`表示**关闭的** 表示端口人为或者防火墙使其关闭(也许服务被卸载)
> 3. `time wait`表示正在**等待连接** 就是你正在向该端口发送请求连接状态
> 4. `established`表示是对方与你**已经连接** 正在通信交换数据
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
>
> [nginx Command-line parameters](http://nginx.org/en/docs/switches.html)

# 请求转发

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server {
		listen       38443;
		server_name  mywebsite.com;

        location / {
			proxy_pass https://192.168.100.7:38443/;
        }
    }
}
```



# 本地目录映射

```nginx
worker_processes  8;

events {
    worker_connections  65535;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    
    keepalive_timeout  65;

    server {
        listen       8082;
        server_name  127.0.0.1;

        send_timeout 3600;

        location /upload/ {
            root   E:/server/webapps/ROOT/upload;
            rewrite ^/upload/(.*)$ /$1 break;
        }
    }
}
```

> ## sendfile
>
> **syntax:** *sendfile [ on|off ]*
>
> **default:** *sendfile off*
>
> **context:** *http, server, location*
>
> Directive activate or deactivate the usage of`sendfile()`
>
> 大多数sendfile配置开启后，Nginx在进行数据传输，会调用sendfile()函数， Linux 2.0+ 以后的推出的一个系统调用。对比一般的数据的网络传输sendfile会有更少的切换和更少的数据拷贝。

> ## send_timeout
>
> **syntax:** *send_timeout the time*
>
> **default:** *send_timeout 60*
>
> **context:** *http, server, location*
>
> Directive assigns response timeout to client. Timeout is established not on entire transfer of answer, but only between two operations of reading, if after this time client will take nothing, then nginx is shutting down the connection.
>
> yzk_web 发现ffplay播放暂停超过60s后，点击播放，播放几秒后会卡住；当客户超过`send_timeout`时间未向服务端读取数据，nginx会关闭连接；由于ffplay没有处理此情况的机制，只能将`send_timeout`延长至1小时

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

# rtmp 推流

> 需要使用`nginx-rtmp-win32`
>
> [illuspas/nginx-rtmp-win32: Nginx-rtmp-module Windows builds. (github.com)](https://github.com/illuspas/nginx-rtmp-win32)

```nginx
rtmp {
    server {
        listen 1935;

        application live {
            live on;
        }
		
        application hls {
            live on;
            hls on;  
            hls_path temp/hls;  
            hls_fragment 8s;  
        }
    }
}

http {
    server {
        listen      28080;
		
        location / {
            root html;
        }
		
        location /stat {
            rtmp_stat all;
            rtmp_stat_stylesheet stat.xsl;
        }

        location /stat.xsl {
            root html;
        }
		
        location /hls {
            add_header 'Access-Control-Allow-Origin' '*';
            #server hls fragments  
            types{  
                application/vnd.apple.mpegurl m3u8;  
                video/mp2t ts;  
            }  
            alias temp/hls;  
            expires -1;  
        }  
    }
}
```

### 推流

```bash
ffmpeg  -re -i "rtmp://rtmp.live.com/stream" -vcodec libx264 -vprofile baseline -acodec libmp3lame -ar 44100 -ac 1 -f flv rtmp://127.0.0.1:1935/hls/http8
```

### http 流地址

```
http://127.0.0.1:28080/hls/http8.m3u8
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

# 代理 mysql/oracle
> https://blog.csdn.net/jiahao1186/article/details/111501253

```nginx
stream {
    upstream mysql3306 {
        hash $remote_addr consistent;
        server 192.168.0.6:3306 weight=5 max_fails=3 fail_timeout=30s;
    }

    server {
        listen 41386;
        proxy_connect_timeout 10s;
        proxy_timeout 200s;
        proxy_pass mysql3306;
    }
}

```

或

```nginx
stream {
    server {
        listen 41386;
        proxy_connect_timeout 10s;
        proxy_timeout 200s;
        proxy_pass 192.168.0.6:3306;
    }
}
```

# 跨域

https 下前台访问 http 网站接口（跨域），可以使用 nginx 代理，需要解决跨域问题

> [!TIP]
> 如果该 http 网站支持 https，可以将请求转换为 https 请求，在页面`<head>`中添加：
>
> ```html
> <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
> ```

```nginx

#user  nobody;
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
        listen       28481 ssl;
        # server_name  cs.qjjsxy.com;
		
		ssl_certificate     server.crt;
		ssl_certificate_key server.key;
		ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
		ssl_ciphers         HIGH:!aNULL:!MD5:!DH;
		ssl_prefer_server_ciphers on;
		
		proxy_connect_timeout 300;
		proxy_send_timeout 300;
		proxy_read_timeout 300;
		send_timeout 300;
		uwsgi_read_timeout 300;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;
		
		location /access/ {
            proxy_pass http://access.homed.me/;
		
			if ($request_method = OPTIONS) {
				add_header 'Access-Control-Allow-Origin' *;
				add_header 'Access-Control-Allow-Headers' *;
				add_header 'Access-Control-Allow-Credentials' 'true';
				add_header 'Access-Control-Allow-Methods' *;
				return 204;
			}
        }
		
		location /slave/ {
            proxy_pass http://slave.homed.me/;
		
			if ($request_method = OPTIONS) {
				add_header 'Access-Control-Allow-Origin' *;
				add_header 'Access-Control-Allow-Headers' *;
				add_header 'Access-Control-Allow-Credentials' 'true';
				add_header 'Access-Control-Allow-Methods' *;
				return 204;
			}
        }
		
		location /poster/ {
            proxy_pass http://slave.homed.me:13160/;
        }

        location /httpdvb/ {
            proxy_pass http://httpdvb.slave.homed.me:13164;
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
    }
}
```

使用场景为https代理支持跨域的网站，aka https请求前会发送`OPTION`请求，关键在于 nginx 给`OPTION`请求添加允许跨域请求头

不可所有请求都添加，因为被代理的网站会给请求添加允许跨域请求头，重复添加会报`The 'Access-Control-Allow-Origin' header contains multiple values '*, *', but only one is allowed`

> [!NOTE]
> `server`下`if`里不可以写`add_header`，在`location`下可以

# 默认配置文件

```nginx

#user  nobody;
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
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

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

> [http核心模块-Nginx中文文档](https://www.nginx.cn/doc/standard/httpcore.html)

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



