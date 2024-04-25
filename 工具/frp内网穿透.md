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

```bash
./frps -c frps.toml
frpc.exe -c frpc.toml
```

配置参考[configuration-files - fatedier/frp: A fast reverse proxy to help you expose a local server behind a NAT or firewall to the internet. (github.com)](https://github.com/fatedier/frp?tab=readme-ov-file#configuration-files)链接中的服务端/客户端完整配置。

# 服务端配置

```toml
# 服务端地址端口
bindAddr = "0.0.0.0"
bindPort = 20211

# token
auth.token = "123456"

# dashboard仪表盘
webServer.addr = "0.0.0.0"
webServer.port = 20214
webServer.user = "admin"
webServer.password = "1234"
# 开启监控数据
# enablePrometheus = true
```

> #### Prometheus
>
> 一堆看不懂的东西，没必要开
>
> Enable dashboard first, then configure `enablePrometheus = true` in `frps.toml`.
>
> `http://{dashboard_addr}/metrics` will provide prometheus monitor data.

# 客户端配置

### 公共

```bash
# 服务端地址（域名也可）
# serverAddr = "192.168.31.222"
serverAddr = "0.0.0.0"
serverPort = 20211

# token，与服务端一致
auth.token = "123456"
```

### 代理服务

```bash
# 固定值，每个代理服务以它开头
[[proxies]]
# 每个代理服务的唯一名称
name = "tpx"
# 协议
type = "tcp"
# 其他配置参数
localIP = "127.0.0.1"
localPort = 3389
remotePort = 20212
```

> [!TIP]
>
> 这种方式也适用于通过 ip 访问 http 服务。

### Windows 远程端口

```toml
[[proxies]]
name = "tpx"
type = "tcp"
localIP = "127.0.0.1"
localPort = 3389
remotePort = 20212

[[proxies]]
name = "tpxd"
type = "udp"
localIP = "127.0.0.1"
localPort = 3389
remotePort = 20212
```

### Http

##### 服务端

```toml
vhostHttpPort = 20240
```

##### 客户端

```
[[proxies]]
name = "web1"
type = "http"
localPort = 8080
customDomains = ["www.yourdomain.com"]
```

> [!NOTE]
>
> 这种方式必须使用域名访问，如果以 ip 访问，参看 tcp 配置。

> # 旧版本配置
>
> 经实际使用功能非常强大，`tcp`：http、oracle，`udp`：webrtc 都能良好支持。
>
> ```
> ./frps -c frps.ini
> frpc.exe -c frpc.ini
> ```
>
> 
>
> # 服务端配置
>
> 默认 frps.ini
>
> ```ini
> # 公共配置
> [common]
> # 服务端端口
> bind_port = 19100
> 
> # 看板
> dashboard_addr = 0.0.0.0
> dashboard_port = 7101
> # dashboard user and passwd for basic auth protect
> dashboard_user = admin
> dashboard_pwd = admin
> 
> # 日志
> # console or real logFile path like ./frps.log
> log_file = ./frps.log
> # trace, debug, info, warn, error
> log_level = info
> log_max_days = 3
> 
> # token
> # auth token
> token = xxx
> ```
>
> # 客户端配置
>
> 默认 frpc.ini
>
> ```ini
> # 公共配置
> [common]
> # 服务端ip或域名
> server_addr = xxx.com
> # 服务端端口
> server_port = 19100
> 
> # token，与服务端保持一致才能连接上
> token = xxx
> 
> # 第一次登录失败退出，默认true，如果希望客户端在连接不到服务端依然不断重试，应设为false
> # decide if exit program when first login failed, otherwise continuous relogin to frps
> # default is true
> login_fail_exit = false
> 
> # 日志
> # console or real logFile path like ./frpc.log
> log_file = ./frpc.log
> # trace, debug, info, warn, error
> log_level = info
> log_max_days = 3
> ```
>
> ### 穿透 Windows 远程端口
>
> ```ini
> # 自定义的服务名
> [rdp]
> # 类型
> # tcp | udp | http | https | stcp | xtcp, default is tcp
> type = tcp
> # 要穿透的ip/端口
> local_ip = 127.0.0.1
> local_port = 3389
> # 服务端端口
> remote_port = 19102
> 
> [rdpudp]
> type = udp
> local_ip = 127.0.0.1
> local_port = 3389
> remote_port = 19102
> ```
>
> 即本地的`3389`端口穿透到服务端的`19102`端口
>
> > 同时启用`tcp`和`udp`端口可以改善网络质量
>
> ### 本地 http 服务穿透到外网
>
> 服务端
>
> ```ini
> [common]
> vhost_http_port = 80
> ```
>
> 客户端
>
> ```ini
> [http1]
> type = http
> local_ip = 127.0.0.1
> local_port = 8080
> custom_domains = xxxx.cn
> ```
>
> `http://xxxx.cn` → `http://127.0.0.1:8080`
>
> > [!TIP]
> >
> > `custom_domains`指用户访问的地址，填已解析的域名或 IP 地址；填自定义的域名需要配置 hosts。
>
> ### 本地 http 服务穿透到外网 https
>
> 调试微信支付时需要穿透到外网 https
>
> 
>
> 服务端
>
> ```ini
> [common]
> vhost_http_port = 443
> ```
>
> 客户端
>
> ```ini
> [https1]
> type = https
> custom_domains = xxxx.cn
> plugin = https2http
> plugin_local_addr = 127.0.0.1:8080
> plugin_crt_path = ./xxxx.cn_chain.crt
> plugin_key_path = ./xxxx.cn_key.key
> plugin_host_header_rewrite = xxxx.cn
> plugin_header_X-From-Where = frp
> ```
>
> `https://xxxx.cn` → `http://127.0.0.1:8080`
