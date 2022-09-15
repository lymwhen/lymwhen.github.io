# Ubuntu 安装

> [v4_CN_Home · ossrs/srs Wiki (github.com)](https://github.com/ossrs/srs/wiki/v4_CN_Home)
>
> [【RTMP推流】SRS在UBUNTU平台上的编译以及使用方法_与光同程的博客-CSDN博客](https://blog.csdn.net/yy197696/article/details/105750128)
>
> [SRS 4.0 学习笔记 SRS4.0环境的搭建（1） - Cyan_Cloud - 博客园 (cnblogs.com)](https://www.cnblogs.com/CyanCloud/p/14771076.html)
>
> [ubuntu搭建SRS服务器实现RTMP拉流推流_FarryNiu的博客-CSDN博客_ubuntu 推流](https://blog.csdn.net/qq_43474959/article/details/121777642#:~:text=可以不修改，可以修改端口号、推流地址.%2Fconf%2Fsrs.conf 启动 在srs目录下.%2Fobjs%2Fsrs,-c conf%2Fsrs.conf 关闭：.%2Fscripts%2Fstop.sh)

下载源码，推荐用CentOS7系统：

```
git clone -b 4.0release https://gitee.com/ossrs/srs.git
```

编译，注意需要切换到`srs/trunk`目录：

```
cd srs/trunk
./configure
make
```

启动服务器：

```
./objs/srs -c conf/srs.conf
```

检查SRS是否成功启动，可以打开 http://localhost:8080/ ，或者执行命令：

```
# 查看SRS的状态
./etc/init.d/srs status

# 或者看SRS的日志
tail -n 30 -f ./objs/srs.log
```

# 缺点

SRS 支持 rtmp/flv/hls/webrtc 等协议格式，作为直播、音视频互动已经很完美。

作为流媒体服务器的缺点：

##### 正式版本不支持 GB28181

> 我们目前达成的一致是：要把GB的SIP支持从SRS中移除，只支持媒体处理部分。
>
> 我现在考虑的是：是否可以更进一步，完全不支持GB28181的接入。
>
> 原因有：
>
> - 监控场景主要是RTSP，用FFmpeg拉RTSP后转RTMP推SRS，参考 [FAQ: RTSP](https://github.com/ossrs/srs/issues/2716#rtsp)
> - GB场景很小，而且可以用其他的开源项目完成协议转换，比如 [ZLM](https://github.com/ZLMediaKit/ZLMediaKit)
> - 就算SRS支持GB，也只支持GB的媒体部分，还需要花大量时间对接SIP项目，维护文档，以及后续的更新支持
>
> 目前我们的方向太多了，比如API完善、RTC的完善、QUIC、JS虚拟机、切片协议完善等等。
>
> 问了一圈，大家还是想继续支持，那就新建一个仓库吧，owner是 [@xialixin](https://github.com/xialixin) [@duiniuluantanqin](https://github.com/duiniuluantanqin) 仓库地址 [ossrs/srs-gb28181](https://github.com/ossrs/srs-gb28181)
>
> GB独立发展，让子弹飞一会儿，搞不好飞得也挺好。
>
> [GB28181: I'm thingking about saying goodbye，我在想是否不支持 · Issue #2845 · ossrs/srs (github.com)](https://github.com/ossrs/srs/issues/2845)

> Moved to [ossrs/srs-gb28181#4](https://github.com/ossrs/srs-gb28181/issues/4)
>
> GB已经放到独立的仓库 [srs-gb28181](https://github.com/ossrs/srs-gb28181)， 请参考 [#2845](https://github.com/ossrs/srs/issues/2845)
> 问题请提交到GB的仓库[bug](https://github.com/ossrs/srs-gb28181/issues)，或者[pr](https://github.com/ossrs/srs-gb28181/pulls)
>
> [支持对接GB28181吗？监控，智能摄像头，国标推流 · Issue #1500 · ossrs/srs (github.com)](https://github.com/ossrs/srs/issues/1500)

##### 不支持 RTSP

> 关于RTSP先说结论：SRS不直接支持RTSP，现有的推RTSP到SRS功能会设置为Deprecated并在未来删除。SRS可以用Ingester(FFmpeg)拉RTSP流转成RTMP后推给SRS，当然这实际上是FFmpeg支持的功能了。
>
> [PUSH RTSP is removed，不支持RTSP推流 · Issue #2304 · ossrs/srs (github.com)](https://github.com/ossrs/srs/issues/2304)

### GB28181

> 编译SRS，需要切换到Develop分支，并开启gb28181功能：
>
> ```bash
> git checkout feature/gb28181 &&
> ./configure --with-gb28181 && 
> make clean && make
> ```
>
> 然后使用配置文件`conf/push.gb28181.conf `启动：
>
> ```bash
> ./objs/srs -c conf/push.gb28181.conf 
> ```
>
> [支持对接GB28181吗？监控，智能摄像头，国标推流 #1500 · Issue #4 · ossrs/srs-gb28181 (github.com)](https://github.com/ossrs/srs-gb28181/issues/4)

摄像头配置

[支持对接GB28181吗？监控，智能摄像头，国标推流 #1500 · Issue #4 · ossrs/srs-gb28181 (github.com)](https://github.com/ossrs/srs-gb28181/issues/4)

[支持对接GB28181吗？监控，智能摄像头，国标推流 · Issue #1500 · ossrs/srs (github.com)](https://github.com/ossrs/srs/issues/1500#issuecomment-657480580)

[srs_code_note/srs_gb28181.md at master · xialixin/srs_code_note (github.com)](https://github.com/xialixin/srs_code_note/blob/master/doc/srs_gb28181.md)

# 疑难问题

### 查看SRS的状态为 Failed

查看日志文件`./objs/srs.log`

```log
[2022-04-29 00:20:27.549][Error][48212][5477ne6p][98] Failed, code=1002 : run : daemon run hybrid : hybrid run : run server : listen : http stream listen : http stream listen 0.0.0.0:8080 : buffered tcp listen : listen at 0.0.0.0:8080 : fd=10 : bind
thread [48212][5477ne6p]: do_main() [src/main/srs_main_server.cpp:199][errno=98]
thread [48212][5477ne6p]: run_directly_or_daemon() [src/main/srs_main_server.cpp:445][errno=98]
thread [48212][5477ne6p]: run_hybrid_server() [src/main/srs_main_server.cpp:478][errno=98]
thread [48212][5477ne6p]: run() [src/app/srs_app_hybrid.cpp:276][errno=98]
thread [48212][5477ne6p]: run() [src/app/srs_app_hybrid.cpp:161][errno=98]
thread [48212][5477ne6p]: listen() [src/app/srs_app_server.cpp:765][errno=98]
thread [48212][5477ne6p]: listen_http_stream() [src/app/srs_app_server.cpp:1251][errno=98]
thread [48212][5477ne6p]: listen() [src/app/srs_app_server.cpp:99][errno=98]
thread [48212][5477ne6p]: listen() [src/app/srs_app_listener.cpp:241][errno=98]
thread [48212][5477ne6p]: srs_tcp_listen() [src/protocol/srs_service_st.cpp:265][errno=98]
thread [48212][5477ne6p]: do_srs_tcp_listen() [src/protocol/srs_service_st.cpp:223][errno=98](Address already in use)
```

可以看到 8080 端口被占用，可以在`./conf/srs.conf`中修改端口