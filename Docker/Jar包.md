# Jar 包

使用 JDK 容器运行 jar 包，例如部署 ruoyi 后台。

### 程序打包

- application 中配置`ruoyi.profile`为`/home/ruoyi/uploadPath`
- logback.xml 中配置`log.path`为`/home/ruoyi/logs`

> 打包问题参看 [Spring_Boot - 打包](Spring_Boot/Spring_Boot?id=打包)

### 创建挂载目录

```bash
mkdir -p /data/docker/admin/app
mkdir -p /data/docker/admin/uploadPath
mkdir -p /data/docker/admin/logs
```

将打包的 jar 上传到 app 目录

### 运行容器

```bash
docker run -d \
 --name admin \
 -p 8080:8080 \
 --restart=always \
 -v /data/docker/admin/uploadPath:/home/ruoyi/uploadPath \
 -v /data/docker/admin/logs:/home/ruoyi/logs \
 -v /data/docker/admin/app:/app \
 openjdk:8 java -jar /app/admin.jar
```

这样后续更新程序只需重新打包传到 app 挂载目录，然后重启容器：

```bash
docker restart admin
```

> [docker部署jar包的几种方式-CSDN博客](https://blog.csdn.net/qq_39934154/article/details/121985650)

