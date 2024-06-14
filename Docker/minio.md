minio

```
mkdir -p /home/lymly/docker/minio/config
mkdir -p /home/lymly/docker/minio/data
```



```
docker run \
-p 9010:9000 \
-p 9090:9090 \
--name minio \
-d --restart=always \
-e "MINIO_ACCESS_KEY=admin" \
-e "MINIO_SECRET_KEY=password" \
-v /home/lymly/docker/minio/data:/data \
-v /home/lymly/docker/minio/config:/root/.minio \
 minio/minio server \
/data --console-address ":9090" --address ":9000"
```

