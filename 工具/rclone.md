```bash
yum -y install unzip
curl https://rclone.org/install.sh | sudo bash
```

```bash
[root@yun36 tmp]# rclone config
Current remotes:

Name                 Type
====                 ====
minio                s3

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
```



```bash
mkdir -p touch /root/.config/rclone
vim /root/.config/rclone/rclone.conf

[minio]
type = s3
provider = Minio
access_key_id = admin
secret_access_key = password
endpoint = http://10.0.3.11:9010
```

> [rclone的基本用法 - hiyang - 博客园 (cnblogs.com)](https://www.cnblogs.com/hiyang/p/12841418.html)

```bash

# 本地到网盘
rclone [功能选项] <本地路径> <配置名称:路径> [参数] [参数]
# 网盘到本地
rclone [功能选项] <配置名称:路径> <本地路径> [参数] [参数]
# 网盘到网盘
rclone [功能选项] <配置名称:路径> <配置名称:路径> [参数] [参数]
 
# [参数]为可选项
```

> [实用工具|教你如何使用备份神器 Rclone，手把手保姆级教程-CSDN博客](https://blog.csdn.net/qq_22903531/article/details/131434705)

```bash
# 将face0807下的文件复制到指定目录，不需要事先对目标目录mkdir
rclone copy face0807 minio:kmdx-ai/face/2024/08/07
# 将face0807下的文件同步到指定目录，不需要事先对目标目录mkdir，注意会删除目标目录中的文件
rclone sync face0807 minio:kmdx-ai/face/2024/08/07
```