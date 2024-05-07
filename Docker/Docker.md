# Docker

# 设置镜像

windows

设置 - Docker Engine

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://rtyjkv7z.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com",
    "http://hub-mirror.c.163.com",
    "https://registry.docker-cn.com"
  ]
}
```

### Linux

```bash
# 第一步：新建或编辑daemon.json
vim /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://rtyjkv7z.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com",
    "http://hub-mirror.c.163.com",
    "https://registry.docker-cn.com"
  ]
}

# 重启docker
systemctl restart docker
```

# 命令

```bash
# 查找镜像
docker search nginx
# 拉取镜像
docker pull nginx:latest
# 查看镜像
docker images

# 运行容器
# --name nginx-test：容器名称。
# -p 8080:80： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
# -d： 设置容器在在后台一直运行。
# -v：volume，持久化
# nginx 使用的镜像为nginx，可指定版本如nginx:latest
C:\Users\haiyi>docker run -p 8091:80 --name nginx-1 -d nginx
ba1c732c30b85462c0137202b2252b7bea7d250afe6d6c39c291949f9764bc4c

# 拷贝文件
C:\Users\haiyi>docker cp nginx-1:/etc/nginx/nginx.conf D:\docker-files\nginx-1
C:\Users\haiyi>docker cp nginx-1:/etc/nginx/conf.d D:\docker-files\nginx-1
C:\Users\haiyi>docker cp nginx-1:/etc/nginx/html D:\docker-files\nginx-1
Successfully copied 2.56kB to D:\docker-files\nginx-1

# 运行状态
docker ps

# 停止容器
docker stop nginx-1

# 删除容器
docker rm nginx-1

# 正式运行
docker run -p 8091:80 --name nginx-1 -v D:\docker-files\nginx-1\nginx.conf:/etc/nginx/nginx.conf -v D:\docker-files\nginx-1\conf.d:/etc/nginx/conf.d -v D:\docker-files\nginx-1\log:/var/log/nginx -v D:\docker-files\nginx-1\html:/usr/share/nginx/html -d nginx

# 修改映射的文件后重启
docker restart nginx-1

# 执行命令
docker exec -it mysql8 mysql -uroot -proot
docker exec -it mysql8 mysqldump -uroot -proot ytz-web > /root/ytz-web.sql
docker exec -i mysql8 mysql -uroot -proot ytz-web < /root/ytz-web.sql

# 进入正在运行的容器
docker exec -it nginx-1 /bin/bash

# docker开机启动
systemctl enable docker
# 容器开机启动
docker run -d --restart=always --name redis
（上面命令  --name后面两个参数根据实际情况自行修改）
 
# Docker 容器的重启策略如下：
 --restart具体参数值详细信息：
       no　　　　　　　 // 默认策略,容器退出时不重启容器；
       on-failure　　  // 在容器非正常退出时（退出状态非0）才重新启动容器；
       on-failure:3    // 在容器非正常退出时重启容器，最多重启3次；
       always　　　　  // 无论退出状态是如何，都重启容器；
       unless-stopped  // 在容器退出时总是重启容器，但是不考虑在 Docker 守护进程启动时就已经停止了的容器。
       
# 更新容器配置
docker update --restart=always redis1
```

> link参数连接容器后，使用的端口应该是容器内的端口，而不是宿主机端口

### 查看 docker 安装命令

借助第三方包`get_command_4_run_container`

```bash
# 拉取包
docker pull cucker/get_command_4_run_container

# docker run --rm -v /var/run/docker.sock:/var/run/docker.sock cucker/get_command_4_run_container [容器名称]/[容器ID]
get_run_command mysql8
docker run -d \
 --name mysql8 \
 --cgroupns host \
 --env MYSQL_ROOT_PASSWORD=root \
 -p 3308:3306/tcp \
 --restart=always \
 -v /home/lymly/docker/mysql8/log:/var/log/mysql \
 -v /home/lymly/docker/mysql8/data:/var/lib/mysql \
 -v /home/lymly/docker/mysql8/conf:/etc/mysql/conf.d \
 mysql:8.0
```

将其封装成一个别名：

```bash
# 添加别名
echo "alias get_run_command='docker run --rm -v /var/run/docker.sock:/var/run/docker.sock cucker/get_command_4_run_container'" >> ~/.bashrc \
&& \
. ~/.bashrc

# 使用命令
get_run_command mysql8
```

> [Docker--查看容器的启动参数(命令)--方法/实例_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr-CSDN博客](https://blog.csdn.net/feiying0canglang/article/details/126435646)