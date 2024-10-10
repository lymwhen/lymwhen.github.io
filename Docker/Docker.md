# Docker

# 安装

##### 1、卸载系统之前可能安装的 docker（防止冲突）

卸载系统之前可能安装的 docker（防止版本不一致，发生冲突）

```shell
sudo yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine
```

##### 2、安装 Docker-CE 基本环境

安装必须的依赖

```shell
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

设置 docker repo 的 yum 位置

```shell
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

如果无法连接，可以使用阿里云源

```bash
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

安装 docker，以及 docker-cli

```shell
sudo yum -y install docker-ce docker-ce-cli containerd.io
```

这样就安装好`docker`和基本环境了，接下来就可以启动`docker`了

##### 3、启动 docker

```shell
#启动docker
sudo systemctl start docker
#查看docker服务状态 running 就是启动成功
sudo systemctl status docker
```

##### 4、设置 docker 开机自启

```shell
sudo systemctl enable docker
```

##### 5、测试 docker 常用命令

> docker命令官方文档 https://docs.docker.com/engine/reference/commandline/docker/

`Docker`的常用命令：

```shell
#镜像命令
docker images：列出所有镜像
docker search [image]：搜索 Docker 镜像
docker pull [image]：拉取指定镜像
docker rmi [image]：删除指定镜像
#容器命令
docker ps：列出当前所有正在运行的容器
docker ps -a：列出所有容器，包括已经停止的容器
docker create [image]：创建一个新的容器，但不启动它
docker start [container]：启动一个容器
docker stop [container]：停止一个容器
docker rm [container]：删除一个容器
docker exec -it [container] [command]：在运行中的容器中执行命令
#其他命令
docker info：显示 Docker 系统信息
docker version：显示 Docker 版本信息
docker logs [container]：查看容器的日志
docker network ls：列出 Docker 网络
docker network create [network]：创建一个新的 Docker 网络
docker network connect [network] [container]：将容器连接到指定的 Docker 网络
docker network disconnect [network] [container]：将容器从指定的 Docker 网络中断开连接
```



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

众所周知的原因，目前能用的镜像

```bash
{
    "registry-mirrors": [
        "https://hub.uuuadc.top",
        "https://docker.anyhub.us.kg",
        "https://dockerhub.jobcher.com",
        "https://dockerhub.icu",
        "https://docker.ckyl.me",
        "https://docker.awsl9527.cn"
    ]
}
```

> [DockerHub 国内镜像源列表（2024 年 6 月 18 日 亲测可用） - V2EX](https://www.v2ex.com/t/1050454)

> ```bash
> # 1. 拉取镜像
> docker pull dockerhub.icu/library/alpine:latest
> # 2. 重命名镜像
> docker image tag dockerhub.icu/library/alpine:latest library/alpine:latest
> # 3. 删除镜像
> docker rmi dockerhub.icu/library/alpine:latest
> ```
>
> [镜像使用说明 (dockerhub.icu)](https://dockerhub.icu/)



# 命令

##### 镜像

```bash
# 查找镜像
docker search nginx
# 拉取镜像
docker pull nginx:latest
# 查看镜像
docker images
# 删除惊喜那个
docker rmi nginx
```

##### 运行容器

```bash
# 运行容器
# --name nginx-test：容器名称。
# -p 8080:80： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。
# -d： 设置容器在在后台一直运行。
# -v：volume，持久化，挂载目录
# nginx 使用的镜像为nginx，可指定版本如nginx:latest
C:\Users\haiyi>docker run -p 8091:80 --name nginx-1 -d nginx
ba1c732c30b85462c0137202b2252b7bea7d250afe6d6c39c291949f9764bc4c

# 拷贝文件，docker cp似乎不支持通配符
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

> [!NOTE]
>
> link参数连接容器后，使用的端口应该是容器内的端口，而不是宿主机端口

##### 日志

```bash
docker logs mysql57

docker logs -f --tail=200 tomcat1
# 参数说明
# -f : 跟踪日志输出
# --since :显示某个开始时间的所有日志
# -t : 显示时间戳
# --tail :仅列出最新N条容器日志
```



### 查看 docker 安装命令

借助第三方包`get_command_4_run_container`

```bash
# 拉取包
docker pull cucker/get_command_4_run_container

# 查看命令
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock cucker/get_command_4_run_container [容器名称]/[容器ID]

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

##### 封装命令别名

```bash
# 添加别名
echo "alias docker_command='docker run --rm -v /var/run/docker.sock:/var/run/docker.sock cucker/get_command_4_run_container'" >> ~/.bashrc && . ~/.bashrc

# 使用命令
docker_command mysql8
```

> [Docker--查看容器的启动参数(命令)--方法/实例_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr-CSDN博客](https://blog.csdn.net/feiying0canglang/article/details/126435646)

> [!TIP]
>
> 上述命令在 root 用户下使用，如果需要在其他用户下`sudo docker_command xxx`使用，需要在使用别名的用户下也要执行上述命令，同时添加`sudo`别名：
>
> ```bash
> echo "alias sudo='sudo '" >> ~/.bashrc && . ~/.bashrc
> ```
>
> ##### 原因
>
> > `sudo`会忽略通过`.bashrc`文件、`.bash_aliases`文件或者`alias`命令设置的别名命令(aliased commands)。
> >
> > [如何在 sudo 提权后使用别名命令-CSDN博客](https://blog.csdn.net/easylife206/article/details/129019611)
>
> ##### 解决办法
>
> Linux 会检查命令的**第一个单词**是否有别名，且如果**别名的末尾有空格或制表符，还会检查下一个单词是否有别名**，所以将`sudo`添加别名可解决此问题。
>
> > [如何在 Linux 中使用 sudo 运行别名 (linux-console.net)](https://cn.linux-console.net/?p=20072)



# 访问外部端口

### 宿主机远端端口

众所周知容器中是可以正常访问宿主机网络环境中的 ip 和端口的，比如 java 访问远端数据库、redis 等服务。

### 宿主机本地端口

例如 nginx 代理宿主机上的 tomcat

在安装Docker的时候，会在宿主机安装一个虚拟网关`docker0`，查询docker0的IP地址

```bash
> ip addr show docker0
3: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:72:ad:b3:b1 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:72ff:fead:b3b1/64 scope link
       valid_lft forever preferred_lft forever
```

可见宿主机在 docker 容器中的 ip 是`172.17.0.1`

```bash
# 注意 upstream 没有http, 这里的ip就是上面对于docker来说宿主机的ip
upstream music {
    server 172.17.0.1:8080;
}
server {
    listen 80;
    # 如果由域名配置为域名即可，如果没有域名配置为本机ip地址
    # 如果想要外部访问就配置为本机的外网ip
    server_name xx.xx.xx.xx;
    location / {
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # 这里就是上面的upstream
        proxy_pass http://music;
    }
}
```

> [!NOTE]
>
> 宿主机端口使用`localhost`或者`127.0.0.1`是不行的，因为他们指的是容器本身，而非宿主机。

### 其他容器端口

通过`--link`参数可以在容器中通过容器名访问其他容器，如`mysql57:mysql`，容器中即可通过`mysql:3306`访问名为`mysql57`容器的数据库。

> `mysql57`：被访问的容器名称
>
> `mysql`：被访问的容器在本容器中映射的名称

> [!TIP]
>
> 如果被访问容器向宿主机映射了端口，那么可以通过上述的宿主机本地端口访问，也可以使用连接方式（`link`）访问；否则只能通过连接方式访问。

# 代理

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
# 创建代理配置文件，名称不限制
sudo touch proxy.conf

[Service]
Environment="HTTP_PROXY=http://proxy.example.com:8080/"
Environment="HTTPS_PROXY=http://proxy.example.com:8080/"
Environment="NO_PROXY=localhost,127.0.0.1,.example.com"

// 重新加载系统配置
sudo systemctl daemon-reload
sudo systemctl restart docker
```

> [快速设置 Docker 的三种网络代理配置_docker 代理-CSDN博客](https://blog.csdn.net/peng2hui1314/article/details/124267333)

### 取消代理

注释`/etc/systemd/system/docker.service.d/proxy.conf`中的配置，或者修改文件名，然后重新加载系统配置，重启 docker。

# 普通用户 Docker 权限

例如用户 user1

```bash
# 如果没有docker用户组
cat /etc/group | grep docker
groupadd docker

# 将用户添加到docker用户组
usermod -aG docker user1
# 或，$USER表示当前登录用户
usermod -aG docker $USER
# 如果不生效：
gpasswd -a user1 docker

# Docker 守护进程在启动时自动以 docker 用户组运行
vim /etc/docker/daemon.json
{
  "group": "docker"
}
systemctl daemon-reload
systemctl restart docker

# 测试
docker ps
```



# 问题

### missing signature key

> 重装，测试有效：[Docker提示missing signature key解决方案 | 时鹏亮的Blog (shipengliang.com)](https://shipengliang.com/other/docker提示missing-signature-key解决方案.html)
>
> 不重装，暂未测试成功：[docker拉取镜像错误missing signature key - 岁月淡忘了谁 - 博客园 (cnblogs.com)](https://www.cnblogs.com/henuyuxiang/p/17879277.html)

