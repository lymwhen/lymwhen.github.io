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