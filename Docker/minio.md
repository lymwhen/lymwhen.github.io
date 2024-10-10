# minio

```
mkdir -p /home/lymly/docker/minio/config
mkdir -p /home/lymly/docker/minio/data
```



```bash
docker run \
-p 9010:9000 \
-p 9090:9090 \
--name minio \
-d --restart=always \
-e "MINIO_ACCESS_KEY=admin" \
-e "MINIO_SECRET_KEY=" \
-v /home/lymly/docker/minio/data:/data \
-v /home/lymly/docker/minio/config:/root/.minio \
 minio/minio server \
/data --console-address ":9090" --address ":9000"
```



# nginx 代理 minio

minio 端口：

Console：控制台，默认 9090

API：接口，默认9000

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    # 代理minio外网地址
    # minio控制台地址
    server {
        listen       18081;
        # 代理api
        location /files/{
            proxy_pass http://10.0.3.11:9010/;
        }
        
        # 代理console
		location /minio/ui/ {
		    rewrite ^/minio/ui/(.*) /$1 break;
		    proxy_set_header Host $http_host;
		    proxy_set_header X-Real-IP $remote_addr;
		    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		    proxy_set_header X-Forwarded-Proto $scheme;
		    proxy_set_header X-NginX-Proxy true;
		    real_ip_header X-Real-IP;
		    proxy_connect_timeout 300;
		    proxy_http_version 1.1;
		    proxy_set_header Upgrade $http_upgrade;
		    proxy_set_header Connection "upgrade";
		    chunked_transfer_encoding off;
		    proxy_pass http://minio_console;
		} 
    }

}

```

> [!NOTE]
>
> 使用路径代理控制台 console 需要配置 minio 环境变量`MINIO_BROWSER_REDIRECT_URL`，注意这个地址应该是浏览器直接访问地址，比如使用了 nginx 代理，那么这里应该配置 nginx 代理的地址。
>
> ```bash
> docker run \
> -p 9010:9000 \
> -p 9090:9090 \
> --name minio \
> -d --restart=always \
> -e "MINIO_ACCESS_KEY=admin" \
> -e "MINIO_SECRET_KEY=" \
> -e "MINIO_BROWSER_REDIRECT_URL=http://10.0.3.11:9090/minio/ui" \
> -v /home/lymly/docker/minio/data:/data \
> -v /home/lymly/docker/minio/config:/root/.minio \
>  minio/minio server \
> /data --console-address ":9090" --address ":9000"
> ```
>
> [minio自建对象存储（单机版）_minio browser配置地址-CSDN博客](https://blog.csdn.net/qq_27399407/article/details/121361894)

### 代理报错签名错误

![image-20240705201823073](assets/image-20240705201823073.png)

minio 接口正常代理即可，无需额外配置，记一次签名错误问题：

##### 获取外链

```java
/**
     * 获取文件外链
     *
     * @param bucketName 存储桶名称
     * @param objectName 文件名
     * @param expires    过期时间 <=7 秒 （外链有效时间（单位：秒））
     * @return 文件外链
     */
public static String getPreSignedObjectUrl(String bucketName, String objectName, Integer expires) throws Exception {
    GetPresignedObjectUrlArgs.Builder builder = GetPresignedObjectUrlArgs.builder();
    if(expires!=null) {
        builder.expiry(expires);
    }
    GetPresignedObjectUrlArgs args = builder
        .bucket(bucketName)
        .object(objectName.replaceAll("^/+", ""))
        .method(Method.GET)
        .build();
    return MinioConfig.minioDownloadClient.getPresignedObjectUrl(args);
}
```

例如我们要获取的对象为桶`bucket-test`的对象名称为`/face/2024/07/05/logo_20240705200640A001.png`的文件，`GetPresignedObjectUrlArgs.builder.object()`方法中传入的对象名称**不能以`/`开头**，而是应该传入`face/2024/07/05/logo_20240705200640A001.png`，**否则直接访问是可以的，使用代理访问就会报签名错误**。

# Minio Client 客户端 mc

### 安装

1. 下载 `mc` 的二进制文件：

   ```bash
   wget https://dl.min.io/client/mc/release/linux-amd64/mc
   ```

2. 为下载的文件添加执行权限：

   ```bash
   chmod +x mc
   ```

3. 将 `mc` 移动到系统的可执行路径中，例如 `/usr/local/bin`：

   ```bash
   sudo mv mc /usr/local/bin/
   ```

4. 确认 `mc` 已正确安装：

   ```bash
   mc --version
   ```

### 命令

```bash
# 添加云存储
mc config host add minio-1 http://127.0.0.1:9010 admin password
# 云存储列表
mc config host list

# 查看桶
mc ls minio-master
```

> [MinIO Client(mc)完全指南 - 吕振江 - 博客园 (cnblogs.com)](https://www.cnblogs.com/lvzhenjiang/p/14944821.html)

### 数据同步

```bash
--watch 或 -w：持续监控源端的变化，并将这些变化实时同步到目标端。
--overwrite：覆盖目标端的文件，如果源端的文件有所更新。
--remove：删除目标端不存在于源端的文件。
--region：指定在目标端创建新存储桶时使用的区域，默认为 "us-east-1"。
--preserve 或 -a：在同步时保留源端文件系统属性和存储桶策略。
--md5：强制所有上传计算 md5 校验和。
--active-active：启用主动-主动多站点配置。
--disable-multipart：禁用分块上传功能。
--exclude：排除匹配指定模式的对象。
--older-than：只同步指定时间前的对象。
--newer-than：只同步指定时间后的对象。
--storage-class 或 --sc：指定新对象在目标端的存储类别。
--attr：为所有对象添加自定义元数据。
--monitoring-address：如果指定，将创建一个新的 Prometheus 端点来报告镜像活动。
```



```bash
# 同步数据，minio-master→minio-slave
mc mirror --remove --overwrite minio-master minio-slave
# 同步数据，并监听持续同步
mc mirror --remove --overwrite --watch minio-master minio-slave
# 双向同步
mc mirror --active-active --remove --overwrite --watch minio-master minio-slave
```

> [!WARNING]
>
> 注意`--remove`参数会删除目标端不存在于源端的文件。

# 双机热备

### 同步服务

创建同步脚本

```bash
mkdir -p /opt/minio
vim /opt/minio/minio-mirror-master-to-slave.sh
```

同步 master 到 slave 的脚本

```bash
#!/bin/bash

/usr/local/bin/mc mirror --remove --overwrite --watch minio-master minio-slave
```

```bash
chmod +x /opt/minio/minio-mirror-to-slave.sh
```

创建服务

```bash
vim /etc/systemd/system/minio-mirror.service
[Unit]
Description=MinIO Mirror Service
After=network.target
Requires=docker.service

[Service]
Type=simple
ExecStart=/opt/minio/minio-mirror.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

服务启动

```bash
systemctl start minio-mirror
```

> [!NOTE]
>
> 不可配置开机自启，因为同步配置是以 master 的数据覆盖 slave 的数据。当 master 宕机时，数据将会被存储到 slave 上。
>
> master 服务恢复后，不可直接运行此脚本，应由运维人员先将 slave 的数据同步到 master 上。
>
> ```bash
> mc mirror --overwrite minio-slave minio-master
> ```
>
> 这个操作最主要是要将在 slave 新增的数据同步到 master 上，最好不添加` --delete`参数：
>
> - 好处：防止有可能有部分数据还未从 master 同步到 slave，这样会导致它被删除
> - 坏处：宕机期间从 slave 上删除的数据，不会在 master 上删除，master 及其同步服务恢复后，在 slave 上的数据也会被同步恢复，但总比数据丢失好



# ~~双机热备~~

> [!WARNING]
>
> 此方法存在无法解决的问题

### 同步服务

同步方向，即都是从对方同步：

- 1：2 → 1
- 2：1 → 2

创建同步脚本

```bash
mkdir -p /opt/minio
vim /opt/minio/minio-mirror.sh
```

minio-mirror.sh

```bash
#!/bin/bash
# 等待本机minio服务启动
while ! nc -z 127.0.0.1 9010; do
  sleep 1
done

# 执行 mc mirror 命令，从对方minio同步数据
/usr/local/bin/mc mirror --active-active --remove --overwrite --watch minio-2 minio-1
```

```bash
chmod +x /opt/minio/minio-mirror.sh
```

创建服务

```bash
vim /etc/systemd/system/minio-mirror.service
[Unit]
Description=MinIO Mirror Service
After=network.target
Requires=docker.service

[Service]
Type=simple
ExecStart=/opt/minio/minio-mirror.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

服务启动

```bash
systemctl enable minio-mirror
systemctl start minio-mirror
```

服务器2同理。

实测数据双向同步没有问题，但**如果minio-1宕机，宕机期间数据存入minio-2，然后1恢复，双向同步会把该部分数据从2中删除，而不是同步到1中**：

```bash
# minio-1
Sep 18 15:18:16 localhost.localdomain minio-mirror.sh[1012]: `minio-2/kmdx-ai/car/2024/图片1.png` -> `minio-1/kmdx-ai/car/2024/图片1.png`
Sep 18 15:18:16 localhost.localdomain minio-mirror.sh[1012]: [2024-09-18T07:18:16.008Z] Removed `minio-1/kmdx-ai/car/2024/图片1.png`

# minio-2
Sep 18 15:18:16 localhost.localdomain minio-mirror.sh[13079]: `` -> `minio-2/kmdx-ai/car/2024/图片1.png`
```

看日志似乎是2告诉1，有这个文件，1同时也告诉2，没有这个文件，然后文件就被删除了
