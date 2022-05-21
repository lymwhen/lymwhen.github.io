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
yum install -y redhat-lsb
# 安装
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

