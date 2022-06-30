# Http 代理

```bash
su root
vi /etc/profile
# 添加
export proxy="http://192.168.1.2:12345"
export http_proxy=$proxy
export https_proxy=$proxy
export ftp_proxy=$proxy
export no_proxy="localhost, 127.0.0.1, ::1"
# 刷新配置文件
source /etc/profile
# 测试
wget www.google.com

# 关闭代理
unset http_proxy
unset https_proxy
unset ftp_proxy
unset no_proxy
# 刷新配置文件
source /etc/profile
```

> [CentOS-7 配置全局http代理 - ihawo](https://www.ihawo.com/archives/139.html)