# ffmpeg

> [FFmpeg](http://ffmpeg.org/)
>
> [ffmpeg Documentation](https://ffmpeg.org/ffmpeg-all.html)

# 转换格式

```bash
ffmpeg -i input.mp4 output.avi
```

# 改变 h264 压缩级别

可以使用 potplayer 等查看视频的压缩级别（Profile Level）

```
Format profile : High@L5.2
```

```bash
ffmpeg -i C:\Users\lymly\Desktop\22-04-08-15-21-21_x264.mp4 -profile:v main -level 4.2 output.mp4
```

> [FFmpeg基础知识之————H264编码profile & level控制 - DoubleLi - 博客园 (cnblogs.com)](https://www.cnblogs.com/lidabo/p/7419393.html)

> [!NOTE]
>
> 解决苹果上 h264 无法播放的问题
>
> 转码为 h264 high 4.1 就基本可以支持 phone4s + 的苹果设备了。
>
> 如果 要兼容所有（包括iphone3gs 和 iphone4），那需要转为 baseline 3.1
>
> [Frequently Asked Questions (apple.com)](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/FrequentlyAskedQuestions/FrequentlyAskedQuestions.html)
>
> [ios video标签部分mp4文件无法播放的问题 - 前端小小菜 - 博客园 (cnblogs.com)](https://www.cnblogs.com/aleafo/p/7644553.html)

# 保存 rtmp 到 mp4

```bash
ffmpeg -i "rtmp://xxxxxx" -c:a copy -c:v copy D:\1.mp4
```

> [【编码推流】ffmpeg将直播转码保存到本地_jn10010537的博客-CSDN博客](https://blog.csdn.net/jn10010537/article/details/124079739)

# 推流

```bash
# mp4转rtsp（推到达尔文）
ffmpeg -re -i kdxf.mp4 -rtsp_transport udp -vcodec h264 -f rtsp rtsp://localhost/test
ffmpeg -re -i kdxf.mp4 -s 800*600 -rtsp_transport udp -vcodec h264 -f rtsp rtsp://localhost/test
ffmpeg -re -i "C:\Users\20200513170000_20200513172728~1.mp4" -c copy -f flv -y rtmp://192.168.3.180/live/live1

# tcp/udp
ffmpeg -re -i C:\Users\Administrator\Videos\test.mkv -rtsp_transport tcp -vcodec h264 -f rtsp rtsp://localhost/test
ffmpeg -re -i C:\Users\Administrator\Videos\test.mkv -rtsp_transport udp -vcodec h264 -f rtsp rtsp://localhost/test

# rtsp转hls
ffmpeg -i "rtsp://localhost/test" -c copy -f hls -hls_time 2.0 -hls_list_size 1 15 C:\Users\LYML\Desktop\nginx-rtmp-win32\temp\hls\test.m3u8
ffmpeg -rtsp_transport tcp -i rtsp://localhost/test -codec:v libx264 -map 0 -f hls -hls_list_size 6 -hls_time 10 C:\Users\LYML\Desktop\nginx-rtmp-win32\temp\hls\test.m3u8
ffmpeg -rtsp_transport udp -i rtsp://localhost/test -codec:v libx264 -map 0 -s 600x400 -f hls -hls_list_size 6 -hls_time 10 C:\Users\LYML\Desktop\nginx-rtmp-win32\temp\hls\test.m3u8

# 拉转推，rtsp转rtmp（nginx）
ffmpeg  -re -i "rtsp://localhost/test" -vcodec libx264 -vprofile baseline -acodec libmp3lame -ar 44100 -ac 1 -f flv rtmp://127.0.0.1:1935/hls/http8

# 循环推流，rtsp/rtmp
ffmpeg -re -stream_loop -1 -i kdxf.mp4 -c copy -f rtsp rtsp://localhost:8554/mystream
ffmpeg -re -stream_loop -1 -i kdxf.mp4 -c copy -f flv rtmp://localhost:8554/mystream
```

# ffplay

```bash
ffplay -rtsp_transport tcp rtsp://localhost/test
ffplay rtsp://localhost/test
```



# 其他

### FFmpeg推流中断问题解决

> [FFmpeg推流中断问题解决_薄荷味的节操的博客-CSDN博客_ffmpeg推流中断](https://blog.csdn.net/qq_38973118/article/details/105814062)
