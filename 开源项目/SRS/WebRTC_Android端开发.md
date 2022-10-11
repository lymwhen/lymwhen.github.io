# WebRTC Android 端开发

SRS 只提供了 webrtc 推拉流功能，信令和鉴权自行开发，流程上可以比 Licode 简化的多。

# 服务端配置

```nginx
# main config for srs.
# @see full.conf for detail config.

listen              1935;
max_connections     1000;
#srs_log_tank        file;
#srs_log_file        ./objs/srs.log;
daemon              on;
http_api {
    enabled         off;
    listen          1985;
	https{
		enabled on;
		listen 18444;
        key ./conf/server.key;
        cert ./conf/server.crt;
	}
}
rtc_server {
    enabled on;
    listen 8000; # UDP port
    # @see https://github.com/ossrs/srs/wiki/v4_CN_WebRTC#config-candidate
    candidate 192.168.3.200;
}
vhost __defaultVhost__ {
    hls {
        enabled         on;
    }
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
    }
    rtc {
        enabled     on;
    }
}
```

# 推拉流流程

#### `http` http api publish

**↑** post

```json
{"sdp": "", "streamurl": "webrtc://192.168.3.200/live/liveStream"}
```

sdp 为本地创建的 offerSDP，streamurl 为 srs 配置文件中的 rtc_server 地址/[app]/[stream]，可带参数。

**↓** response

```json
{"code": 0, "sdp": ""}
```

sdp 为 answerSDP，完成 SDP 交换即开始推流。

#### `http` http api play

**↑** post

```json
{"sdp": "", "streamurl": "webrtc://192.168.3.200/live/liveStream"}
```

sdp 为本地创建的 offerSDP，streamurl 为要播放的流的地址。

**↓** response

```json
{"code": 0, "sdp": ""}
```

sdp 为 answerSDP，完成 SDP 交换即开始拉流。

# 问题

### http api publish 返回 code 400

offerSDP 不合法，在创建 offerSDP 前应完成添加本地的音视频流。

### SDP 交换后 serve error code=4043

实测这个4043不代表失败，实际可以通过 srs 自带的测试页测试：

```
https://192.168.3.200:18443/players/rtc_player.html?schema=https&port=18443&api=18443
```

播放地址：

```
webrtc://192.168.3.200:18444/live/live3
```

上述的`18443`为 http server ssl 端口，`18444`为 http api 的 ssl 端口

```
[2022-09-26 23:26:21.113][Error][2857][06d73d95][0] serve error code=4043 : parse message : parse message : grow buffer : read bytes : SSL_read r0=0, r1=6, r2=0, r3=1
thread [2857][06d73d95]: process_requests() [src/app/srs_app_http_conn.cpp:183][errno=0]
thread [2857][06d73d95]: parse_message() [src/protocol/srs_service_http_conn.cpp:98][errno=0]
thread [2857][06d73d95]: parse_message_imp() [src/protocol/srs_service_http_conn.cpp:161][errno=0]
thread [2857][06d73d95]: grow() [src/protocol/srs_protocol_stream.cpp:162][errno=0]
thread [2857][06d73d95]: read() [src/app/srs_app_conn.cpp:810][errno=0]
[2022-09-26 23:26:21.113][Trace][2857][9k1s5w0h] TCP: clear zombies=1 resources, conns=1, removing=0, unsubs=0
[2022-09-26 23:26:21.113][Trace][2857][06d73d95] TCP: disposing #0 resource(HttpsConn)(0x2790510), conns=1, disposing=1, zombies=0
[2022-09-26 23:26:21.171][Trace][2857][06d73d95] RTC: session address init 192.168.3.213:42157
[2022-09-26 23:26:21.172][Trace][2857][06d73d95] RTC: session STUN done, waiting DTLS handshake.
[2022-09-26 23:26:21.172][Trace][2857][95933902] <- RTC RECV #13, udp 184, pps 15/1, schedule 184
[2022-09-26 23:26:21.179][Trace][2857][06d73d95] DTLS: State Passive RECV, done=0, arq=0/0, r0=1, r1=0, len=155, cnt=22, size=142, hs=1
[2022-09-26 23:26:21.179][Trace][2857][06d73d95] DTLS: State Passive SEND, done=0, arq=0/0, r0=-1, r1=2, len=679, cnt=22, size=82, hs=2
[2022-09-26 23:26:21.192][Trace][2857][06d73d95] DTLS: State Passive RECV, done=0, arq=0/0, r0=1, r1=0, len=577, cnt=22, size=299, hs=11
[2022-09-26 23:26:21.193][Trace][2857][06d73d95] DTLS: State Passive SEND, done=1, arq=0/0, r0=1, r1=0, len=554, cnt=22, size=466, hs=4
[2022-09-26 23:26:21.193][Trace][2857][06d73d95] RTC: DTLS handshake done.
[2022-09-26 23:26:21.193][Trace][2857][06d73d95] RTC: session pub=1, sub=0, to=30000ms connection established
[2022-09-26 23:26:21.193][Trace][2857][06d73d95] RTC: Publisher url=/live/live3 established
[2022-09-26 23:26:21.193][Trace][2857][06d73d95] hls: win=60000ms, frag=10000ms, prefix=, path=./objs/nginx/html, m3u8=[app]/[stream].m3u8, ts=[app]/[stream]-[seq].ts, aof=2.00, floor=0, clean=1, waitk=1, dispose=0ms, dts_directly=1
[2022-09-26 23:26:21.193][Trace][2857][06d73d95] ignore disabled exec for vhost=__defaultVhost__
[2022-09-26 23:26:21.194][Trace][2857][06d73d95] http: mount flv stream for sid=/live/live3, mount=/live/live3.flv
[2022-09-26 23:26:23.847][Trace][2857][y9053053] Hybrid cpu=2.00%,12MB, cid=17,2, timer=61,2,13, clock=0,33,14,1,1,0,0,0,0, free=1, objs=(pkt:59,raw:16,fua:43,msg:59,oth:1,buf:43)
[2022-09-26 23:26:23.847][Trace][2857][y9053053] RTC: Server conns=1
[2022-09-26 23:26:25.397][Trace][2857][06d73d95] 39B video sh,  codec(7, profile=High, level=3.1, 960x540, 0kbps, 0.0fps, 0.0s)
[2022-09-26 23:26:25.397][Trace][2857][06d73d95] set ts=3425798668, header=11222, lost=11223
[2022-09-26 23:26:25.735][Trace][2857][06d73d95] 7B audio sh, codec(10, profile=LC, 2channels, 0kbps, 48000HZ), flv(16bits, 2channels, 44100HZ)
[2022-09-26 23:26:25.827][Warn][2857][06d73d95][11] VIDEO: stream not monotonically increase, please open mix_correct.
[2022-09-26 23:26:27.152][Trace][2857][y9053053] RTC: Need PLI ssrc=713090540, play=[y9053053], publish=[06d73d95], count=1/1
[2022-09-26 23:26:27.152][Trace][2857][06d73d95] RTC: Request PLI ssrc=713090540, play=[y9053053], count=1/1, bytes=12B
[2022-09-26 23:26:27.198][Trace][2857][06d73d95] 39B video sh,  codec(7, profile=High, level=3.1, 960x540, 0kbps, 0.0fps, 0.0s)
[2022-09-26 23:26:27.198][Trace][2857][06d73d95] set ts=3425978578, header=11507, lost=11508
[2022-09-26 23:26:28.847][Trace][2857][y9053053] Hybrid cpu=4.00%,14MB, cid=17,2, timer=61,2,13, clock=0,33,14,1,1,0,0,0,0, free=1, objs=(pkt:59,raw:16,fua:43,msg:59,oth:1,buf:43)
[2022-09-26 23:26:28.847][Trace][2857][y9053053] RTC: Server conns=1
[2022-09-26 23:26:29.436][Trace][2857][06d73d95] 39B video sh,  codec(7, profile=High, level=3.1, 1280x720, 0kbps, 0.0fps, 0.0s)
[2022-09-26 23:26:29.436][Trace][2857][06d73d95] set ts=3426159028, header=11888, lost=11889
[2022-09-26 23:26:31.086][Trace][2857][06d73d95] -> HLS time=10003396ms, sno=1, ts=live3-0.ts, dur=5874ms, dva=0p
[2022-09-26 23:26:31.169][Trace][2857][95933902] <- RTC RECV #13, udp 2086, pps 29/208, schedule 2086
[2022-09-26 23:26:33.256][Trace][2857][06d73d95] 39B video sh,  codec(7, profile=High, level=3.1, 1280x720, 0kbps, 0.0fps, 0.0s)
[2022-09-26 23:26:33.256][Trace][2857][06d73d95] set ts=3426522988, header=12796, lost=12797
[2022-09-26 23:26:33.847][Trace][2857][y9053053] Hybrid cpu=5.00%,14MB, cid=17,2, timer=61,2,13, clock=0,33,14,1,1,0,0,0,0, free=1, objs=(pkt:59,raw:16,fua:43,msg:59,oth:1,buf:43)
[2022-09-26 23:26:33.847][Trace][2857][y9053053] RTC: Server conns=1
[2022-09-26 23:26:38.848][Trace][2857][y9053053] Hybrid cpu=4.00%,14MB, cid=51,5, timer=61,10,48, clock=0,31,16,0,0,0,0,0,0, objs=(pkt:499,raw:50,fua:448,msg:635,oth:1,buf:274)
[2022-09-26 23:26:38.848][Trace][2857][y9053053] RTC: Server conns=1, rpkts=(280,rtp:274,stun:1,rtcp:5), spkts=(14,rtp:0,stun:1,rtcp:23), rtcp=(pli:1,twcc:9,rr:1), snk=(96,a:48,v:48,h:0), fid=(id:0,fid:280,ffid:0,addr:1,faddr:280)
[2022-09-26 23:26:39.235][Trace][2857][y9053053] RTC: Need PLI ssrc=713090540, play=[y9053053], publish=[06d73d95], count=3/3
[2022-09-26 23:26:39.235][Trace][2857][06d73d95] RTC: Request PLI ssrc=713090540, play=[y9053053], count=3/3, bytes=12B
[2022-09-26 23:26:39.296][Trace][2857][06d73d95] 39B video sh,  codec(7, profile=High, level=3.1, 1280x720, 0kbps, 0.0fps, 0.0s)
[2022-09-26 23:26:39.296][Trace][2857][06d73d95] set ts=3427066588, header=14495, lost=14496
[2022-09-26 23:26:41.102][Trace][2857][06d73d95] -> HLS time=20007135ms, sno=2, ts=live3-1.ts, dur=1804ms, dva=0p

```



### SDP 中音视频存在位置相反的情况

未测试是否有影响，可手动交换一下

```java
public static String convertAnswerSdp(String offerSdp, String answerSdp){
    if(offerSdp == null || answerSdp == null){
        return answerSdp;
    }

    int ovi = offerSdp.indexOf("m=video");
    int oai = offerSdp.indexOf("m=audio");
    int avi = answerSdp.indexOf("m=video");
    int aai = answerSdp.indexOf("m=audio");

    if(avi == -1 || aai == -1){
        return answerSdp;
    }

    boolean isovFirst = ovi < oai;
    boolean isavFirst = avi < aai;
    if(isovFirst == isavFirst){
        return answerSdp;
    }else{
        return answerSdp.substring(0, Math.min(avi, aai)) +
            answerSdp.substring(Math.max(avi, aai)) +
            answerSdp.substring(Math.min(avi, aai), Math.max(avi, aai));
    }
}
```

> [shenbengit/WebRTC-SRS: Android WebRTC 向 SRS 服务器推拉流 (github.com)](https://github.com/shenbengit/WebRTC-SRS)

### 回声消除（啸叫）

##### 创建音频源`AudioSource`的时候要设置过滤器

```java
public static MediaConstraints getAudioConstraints(){
    MediaConstraints audioConstraints = new MediaConstraints();
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googEchoCancellation", "true"));
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googEchoCancellation2", "true"));
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googDAEchoCancellation", "true"));
    //自动增益
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googAutoGainControl", "true"));
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googAutoGainControl2", "true"));
    //噪音处理
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googNoiseSuppression", "true"));
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googNoiseSuppression2", "true"));
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googTypingNoiseDetection", "true"));
    //高音过滤
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googAudioMirroring", "false"));
    audioConstraints.mandatory.add(new MediaConstraints.KeyValuePair("googHighpassFilter", "true"));
    return audioConstraints;
}
```

```java
AudioSource audioSource = peerConnectionFactory.createAudioSource(ChatConstants.getAudioConstraints());
```

但似乎效果不太行

##### 使用手机自带的降噪

```java
// 音频管理器
audioManager = (AudioManager)getSystemService(Context.AUDIO_SERVICE);
// mode为AudioManager.MODE_IN_COMMUNICATION可开启手机自带的麦克风降噪
audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
// 设置音量
audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL, (int) (audioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL) * 1f), AudioManager.FX_KEY_CLICK);
// 开启外放
audioManager.setSpeakerphoneOn(true);
```

> [shenbengit/WebRTC-SRS: Android WebRTC 向 SRS 服务器推拉流 (github.com)](https://github.com/shenbengit/WebRTC-SRS)
>
> [shenbengit/SrsRtcAndroidClient: 基于SRS视频服务器实现简易音视频通话系统——Android客户端 (github.com)](https://github.com/shenbengit/SrsRtcAndroidClient)

##### AEC（AcousticEchoCanceler）

实际效果待测试

```java
if(WebRtcAudioUtils.isAcousticEchoCancelerSupported()){
    Log.d(TAG, "device support AEC, disabled webrtc based AEC");
    WebRtcAudioUtils.setWebRtcBasedAcousticEchoCanceler(false);
}else{
    Log.d(TAG, "device NOT support AEC, enabled webrtc based AEC");
    WebRtcAudioUtils.setWebRtcBasedAcousticEchoCanceler(true);
}
```

> //如果设备支持，禁用内置的AEC
> WebRtcAudioUtils.setWebRtcBasedAcousticEchoCanceler(true);
>
> //如果设备不支持，则启用内置的AEC“
>  WebRtcAudioUtils.setWebRtcBasedAcousticEchoCanceler(false);
>
> [WebRTC回声消除 · Issue #4 · JumpingYang001/webrtc (github.com)](https://github.com/JumpingYang001/webrtc/issues/4)

### http api 暴漏给客户端的问题

srs webrtc 推拉流使用的时 http api 中的接口，而 http api 太过强大，不应全部暴漏给客户端。实测`publish`、`play`请求可经由其他服务器完成，仅需将`rtc_server`端口暴漏给客户端。

### 拉流播放失败

需要设置节点的收发器类型为：仅接收。所以推流也应该设置为仅发送

```java
peerConnection.addTransceiver(MediaStreamTrack.MediaType.MEDIA_TYPE_VIDEO, new RtpTransceiver.RtpTransceiverInit(RtpTransceiver.RtpTransceiverDirection.RECV_ONLY));
peerConnection.addTransceiver(MediaStreamTrack.MediaType.MEDIA_TYPE_AUDIO, new RtpTransceiver.RtpTransceiverInit(RtpTransceiver.RtpTransceiverDirection.RECV_ONLY));
```

### 推拉流鉴权

可在推拉流地址`streamurl`中加入参数，同时在服务端配置 http callback，在回调中进行鉴权。

```nginx
vhost __defaultVhost__ {
	http_hooks {
        enabled         on;
        on_connect      https://192.168.3.106:8443/srs/api/chat/v1/clients;
        on_close        https://192.168.3.106:8443/srs/api/chat/v1/clients;
        on_publish      https://192.168.3.106:8443/srs/api/chat/v1/streams;
        on_unpublish    https://192.168.3.106:8443/srs/api/chat/v1/streams;
        on_play         https://192.168.3.106:8443/srs/api/chat/v1/sessions;
		on_stop         https://192.168.3.106:8443/srs/api/chat/v1/sessions;
		
        # on_dvr          http://127.0.0.1:8085/api/v1/dvrs;
        # on_hls          http://127.0.0.1:8085/api/v1/hls;
        # on_hls_notify   http://127.0.0.1:8085/api/v1/hls/[app]/[stream]/[ts_url][param];
    }
}
```

### 录制

srs webrtc 也支持录制

```nginx
vhost __defaultVhost__ {
    dvr {
        enabled      on;
        dvr_path     ./dvr/[app]/[stream]/[2006].[01].[02].[15].[04].[05].[999].mp4;
        dvr_plan     session;
    }
}
```

### 对象销毁

webrtc 涉及到了众多的对象，`PeerConnection`、`MediaStream`、`MediaTrack`，实测销毁方法为

```java
peerConnection.dispose();
peerConnection = null;
```

`dispose`方法会同时销毁`MediaStream`、`MediaTrack`

> [提交 · SrsChatClientPeer节点改用List统一管理，全屏、小窗切换及相关逻辑、完善SrsChatClientPeer节点销毁机制和信令逻辑 · jds_jwt_android · 云效 Codeup (aliyun.com)](https://codeup.aliyun.com/chunshu/jds_jwt_android/commit/4a702806202d4743ec7fd8e8fe0c129d28a72bd0?branch=master#anchor_file_a377d8da1638e9a807582eeea3772d1bc94a37b8)

### SurfaceView 相互覆盖

```java
// 需要置于底部的SurfaceView设置false，否则设true
surfaceViewRenderer.setZOrderOnTop(true);
surfaceViewRenderer.setZOrderMediaOverlay(true);
```

> [SurfaceView相互叠加的坑_Jesse_liao的博客-CSDN博客_surfaceview 叠加](https://blog.csdn.net/oDongFangZhiZi/article/details/103890344)

> [!TIP]
>
> `SurfaceViewRenderer`继承于`SurfaceView`

### SurfaceView 清除画布

试了多种方法仍不行：

```java
surfaceViewRenderer.release();
surfaceViewRenderer.clearImage();
surfaceViewRenderer.invalidate();
Canvas c = surfaceViewRenderer.getHolder().lockCanvas();
c.drawColor(Color.TRANSPARENT);
surfaceViewRenderer.getHolder().unlockCanvasAndPost(c);
```

> [Android，canvas：如何清除（删除）位于surfaceView中的画布（=位图）的内容？ (qastack.cn)](https://qastack.cn/programming/5729377/android-canvas-how-do-i-clear-delete-contents-of-a-canvas-bitmaps-livin)
>
> [SurfaceView清空Canvas如何操作_qingfengzaishou的博客-CSDN博客_surfaceview 清空画布](https://blog.csdn.net/qingfengzaishou/article/details/51163848)
>
> [SurfaceView清空画布的解决方案_lohas2014的博客-CSDN博客_surfaceview清空](https://blog.csdn.net/zhangfengwu2014/article/details/78126241)

用 View 显示隐藏解决吧

[提交 · SrsChatClientPeer节点改用List统一管理，全屏、小窗切换及相关逻辑、完善SrsChatClientPeer节点销毁机制和信令逻辑 · jds_jwt_android · 云效 Codeup (aliyun.com)](https://codeup.aliyun.com/chunshu/jds_jwt_android/commit/4a702806202d4743ec7fd8e8fe0c129d28a72bd0?branch=master#anchor_file_a377d8da1638e9a807582eeea3772d1bc94a37b8)