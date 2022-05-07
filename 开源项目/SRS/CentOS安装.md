# CentOS 安装

编译安装与 ubuntu 差不多

> [v4_CN_Home · ossrs/srs Wiki (github.com)](https://github.com/ossrs/srs/wiki/v4_CN_Home)
>
> [v4_CN_LinuxService · ossrs/srs Wiki (github.com)](https://github.com/ossrs/srs/wiki/v4_CN_LinuxService#systemctl)

# 安装版

SRS 提供了 CentOS 的安装版，[Releases · ossrs/srs (github.com)](https://github.com/ossrs/srs/releases)

```bash
# 解压zip
cd SRS-CentOS7-x86_64-4.0-b10
# 安装可能提示安装组件
./INSTALL
cd ../srs
```



```bash
[root@localhost SRS-CentOS7-x86_64-4.0-b10]# ./INSTALL 
argv[0]=./INSTALL
execute scripts in file: ./INSTALL
create log( /usr/local/SRS-CentOS7-x86_64-4.0-b10/logs/package.1651115435.log ) success      [  OK  ]
see detail log: tailf /usr/local/SRS-CentOS7-x86_64-4.0-b10/logs/package.1651115435.log      [  OK  ]
check tools                                                                                  [  OK  ]
check previous install                                                                       [  OK  ]
previous install checked                                                                     [  OK  ]
backup old srs                                                                               [  OK  ]
old srs backuped                                                                             [  OK  ]
prepare files                                                                                [  OK  ]
prepare files success                                                                        [  OK  ]
copy core components                                                                         [  OK  ]
copy core components success                                                                 [  OK  ]
install init.d scripts                                                                       [  OK  ]
install init.d scripts success                                                               [  OK  ]
install srs.service for systemctl                                                            [  OK  ]
install srs.service for systemctl success                                                    [  OK  ]
install system service for CentOS                                                            [  OK  ]
Created symlink from /etc/systemd/system/multi-user.target.wants/srs.service to /usr/lib/systemd/system/srs.service.
install system service success                                                               [  OK  ]

see: https://github.com/ossrs/srs/wiki/v4_CN_LinuxService
install success, you can start SRS on CentOS6:
      sudo /etc/init.d/srs start
or CentOS7:
      sudo systemctl start srs
srs root is /usr/local/srs

```

```bash
# systemctl管理服务
systemstl start/stop/restart/status srs
# 查看srs运行状态
./etc/init.d/srs status
# 查看日志
tail -n 30 -f ./objs/srs.log
```



# 使用

srs 正常启动后，可以在 http://localhost:8080/ 查看 SRS 控制台，SRS 提示可以推流到

```bash
rtmp://192.168.3.180/live/livestream
```

其中，`live`为`app`，`livestream`为`stream`，播放后，可以在 SRS 播放器中播放

```bash
http://192.168.3.180:8080/live/livestream.flv
```

支持的播放格式有：

> 打开下面的页面播放流（若SRS不在本机，请将localhost更换成服务器IP）:
>
> - RTMP (by [VLC](https://www.videolan.org/)): rtmp://localhost/live/livestream
> - H5(HTTP-FLV): [http://localhost:8080/live/livestream.flv](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.flv&port=8080&schema=http)
> - H5(HLS): [http://localhost:8080/live/livestream.m3u8](http://localhost:8080/players/srs_player.html?autostart=true&stream=livestream.m3u8&port=8080&schema=http)
>
> 注意如果RTMP转WebRTC流播放，必须使用配置文件[`rtmp2rtc.conf`](https://github.com/ossrs/srs/issues/2728#rtmp2rtc-cn-guide):
>
> - H5(WebRTC): [webrtc://localhost/live/livestream](http://localhost:8080/players/rtc_player.html?autostart=true)

# 配置

srs 配置文件位于`.conf/srs.conf`，里面的其他配置文件貌似是各个功能的配置示例:dog:

```nginx
# main config for srs.
# @see full.conf for detail config.

# rtmp推/拉流端口
listen              1935;
max_connections     1000;
#srs_log_tank        file;
#srs_log_file        ./objs/srs.log;
daemon              on;
# api配置
http_api {
    enabled         on;
    listen          1985;
}
# http流配置
http_server {
	# 此处关闭即关闭http端口
    enabled         off;
    listen          18080;
    dir             ./objs/nginx/html;
    # https配置
	https{
		enabled on;
		listen 18443;
        key ./conf/server.key;
        cert ./conf/server.crt;
	}
}
rtc_server {
    enabled on;
    listen 8000; # UDP port
    # @see https://github.com/ossrs/srs/wiki/v4_CN_WebRTC#config-candidate
    candidate $CANDIDATE;
}
vhost __defaultVhost__ {
	# hls配置
    hls {
        enabled         on;
    }
    # http-flv配置
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
    }
    rtc {
        enabled     on;
        # @see https://github.com/ossrs/srs/wiki/v4_CN_WebRTC#rtmp-to-rtc
        rtmp_to_rtc off;
        # @see https://github.com/ossrs/srs/wiki/v4_CN_WebRTC#rtc-to-rtmp
        rtc_to_rtmp off;
    }
    // http回调配置，回调地址改为https即可回调到https接口
    http_hooks {
        enabled         on;
        # 推流连接
        on_connect      https://192.168.3.106:8443/srs/api/v1/clients;
        on_close        https://192.168.3.106:8443/srs/api/v1/clients;
        # 推流
        on_publish      https://192.168.3.106:8443/srs/api/v1/streams;
        on_unpublish    https://192.168.3.106:8443/srs/api/v1/streams;
        # 播放
        on_play         https://192.168.3.106:8443/srs/api/v1/sessions;
        on_stop         https://192.168.3.106:8443/srs/api/v1/sessions;
    }
}
```

### 鉴权

可以利用 http callback 功能实现推流、播放鉴权

> 服务器端定制的实现方式，就是HTTP回调。譬如当客户端连接到SRS时，回调指定的http地址，这样可以实现验证功能。
>
> 关于Token认证，即基于http回调的认证，参考：[Token Authentication](https://github.com/ossrs/srs/wiki/v4_CN_DRM#token-authentication)
>
> [v4_CN_HTTPCallback · ossrs/srs Wiki (github.com)](https://github.com/ossrs/srs/wiki/v4_CN_HTTPCallback#https-callback)

接口返回`0`表示鉴权通过，返回其他，如`1`表示失败

##### http 回调消息体

```log
2022-05-06 10:59:35  INFO SrsApiController.clients:21 : {"app":"live","tcUrl":"rtmp://192.168.3.180/live","vhost":"__defaultVhost__","stream":"live3","param":"?token=11350-768715","ip":"192.168.3.106","action":"on_connect","pageUrl":"","server_id":"vid-14a82k7","client_id":"1760y012"}
2022-05-06 10:59:35  INFO SrsApiController.streams:31 : {"app":"live","tcUrl":"rtmp://192.168.3.180/live","vhost":"__defaultVhost__","stream":"live3","param":"?token=11350-768715","ip":"192.168.3.106","action":"on_publish","server_id":"vid-14a82k7","client_id":"1760y012"}
2022-05-06 10:59:36  INFO SrsApiController.streams:31 : {"app":"live","vhost":"__defaultVhost__","stream":"live3","param":"?token=11350-768715","ip":"192.168.3.106","action":"on_unpublish","server_id":"vid-14a82k7","client_id":"1760y012"}
2022-05-06 10:59:36  INFO SrsApiController.clients:21 : {"app":"live","vhost":"__defaultVhost__","recv_bytes":347479,"ip":"192.168.3.106","action":"on_close","server_id":"vid-14a82k7","send_bytes":4166,"client_id":"1760y012"}

2022-05-06 14:33:43  INFO SrsApiController.sessions:147 : [z4398hex] sessions: {"app":"live","vhost":"__defaultVhost__","stream":"97165dd0-2adb-4569-8cdc-c889f5f67b80","param":"","ip":"192.168.3.106","action":"on_play","pageUrl":"","server_id":"vid-14a82k7","client_id":"z4398hex"}
2022-05-06 14:33:43  INFO SrsApiController.sessions:147 : [7smnl29t] sessions: {"app":"live","vhost":"__defaultVhost__","stream":"97165dd0-2adb-4569-8cdc-c889f5f67b80","param":"","ip":"192.168.3.106","action":"on_play","pageUrl":"","server_id":"vid-14a82k7","client_id":"7smnl29t"}

```

### 录制

可以利用 http callback 功能实现控制是否录制

> [v4_CN_DVR · ossrs/srs Wiki (github.com)](https://github.com/ossrs/srs/wiki/v4_CN_DVR)
