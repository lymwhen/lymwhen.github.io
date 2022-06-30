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