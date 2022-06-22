# frp 内网穿透

> frp is a fast reverse proxy to help you expose a local server behind a NAT or firewall to the Internet. As of now, it supports **TCP** and **UDP**, as well as **HTTP** and **HTTPS** protocols, where requests can be forwarded to internal services by domain name.
>
> frp also has a P2P connect mode.
>
> ‎frp 是一种快速反向代理，可帮助您将 NAT 或防火墙后面的本地服务器暴露给互联网。截至目前，它支持‎**‎TCP‎**‎和‎**‎UDP‎**‎，以及‎**‎HTTP‎**‎和‎**‎HTTPS‎**‎协议，其中请求可以通过域名转发到内部服务。‎
>
> ‎frp还具有P2P连接模式。‎
>
> [fatedier/frp: A fast reverse proxy to help you expose a local server behind a NAT or firewall to the internet. (github.com)](https://github.com/fatedier/frp)

从 Releases 下载对应平台的版本，解压后文件中的 frps 是服务端，frpc 是客户端，使用有公网ip的服务器作为服务端。

# 服务端配置

默认 frps.ini

```ini
# 公共配置
[common]
# 服务端端口
bind_port = 19100

# 看板
dashboard_addr = 0.0.0.0
dashboard_port = 7101
# dashboard user and passwd for basic auth protect
dashboard_user = admin
dashboard_pwd = admin

# 日志
# console or real logFile path like ./frps.log
log_file = ./frps.log
# trace, debug, info, warn, error
log_level = info
log_max_days = 3

# token
# auth token
token = xxx
```

# 客户端配置

默认 frpc.ini

```ini
# 公共配置
[common]
# 服务端ip或域名
server_addr = xxx.com
# 服务端端口
server_port = 19100

# token，与服务端保持一致才能连接上
token = xxx

# 第一次登录失败退出，默认true，如果希望客户端在连接不到服务端依然不断重试，应设为false
# decide if exit program when first login failed, otherwise continuous relogin to frps
# default is true
login_fail_exit = false

# 日志
# console or real logFile path like ./frpc.log
log_file = ./frpc.log
# trace, debug, info, warn, error
log_level = info
log_max_days = 3
```

### 穿透 Windows 远程端口

```ini
# 自定义的服务名
[rdp]
# 类型
# tcp | udp | http | https | stcp | xtcp, default is tcp
type = tcp
# 要穿透的ip/端口
local_ip = 127.0.0.1
local_port = 3389
# 服务端端口
remote_port = 19102
```

即本地的`3389`端口穿透到服务端的`19102`端口

