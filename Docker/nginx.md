# nginx

### 创建挂载目录

```bash
mkdir -p /data/docker/nginx/conf
mkdir -p /data/docker/nginx/logs

# mkdir -p /data/docker/nginx/conf.d
# mkdir -p /data/docker/nginx/html
```

> [!TIP]
>
> `conf.d`目录不用复制，它是被`nginx.conf`引用的配置文件，可以直接在`nginx.conf`中删除引用，配置我们自己的服务。
>
> `html`目录不用复制，一会从容器中拷贝。

### 临时安装

安装，用于复制文件

```bash
docker run --name nginx -p 80:80 -d nginx
```

复制文件

```bash
docker cp nginx:/etc/nginx/nginx.conf /data/docker/nginx/conf/nginx.conf
# docker cp nginx:/etc/nginx/conf.d /data/docker/nginx
docker cp nginx:/usr/share/nginx/html /data/docker/nginx
```

删除容器

```bash
docker stop nginx 
docker rm nginx
```

### 安装

```bash
docker run -d \
 --name nginx \
 -p 80:80 \
 --restart=always \
 -v /data/docker/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
 -v /data/docker/nginx/conf.d:/etc/nginx/conf.d \
 -v /data/docker/nginx/html:/usr/share/nginx/html \
 -v /data/docker/nginx/logs:/var/log/nginx \
 nginx
```

### 配置

以 ruoyi 前端为例：

```bash

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;
                charset utf-8;

        location / {
            root   /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
            index  index.html index.htm;
        }

                location /prod-api/ {
                        proxy_set_header Host $http_host;
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header REMOTE-HOST $remote_addr;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_pass http://172.17.0.1:8080/;
                }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

> [!NOTE]
>
> 此处注意，如果代理的服务位于同一个宿主机上，不能使用`localhost`，参看 [Docker - 宿主机本地端口](Docker/Docker?id=宿主机本地端口)。