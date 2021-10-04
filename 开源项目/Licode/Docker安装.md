# Docker 安装

```bash
docker run --cap-add=SYS_PTRACE --security-opt seccomp=unconfined -v /docker:/soft -p 3000:3000 -p 30000-30050:30000-30050/udp -p 3001:3001 -p 3004:3004 -p 9229:9229 -p 8080:8080 -e "MIN_PORT=30000" -e "MAX_PORT=30050" -e "PUBLIC_IP=192.168.3.185" lynckia/licode
```

