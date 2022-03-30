# Android 端开发

> [lynckia/licode: Open Source Communication Provider based on WebRTC and Cloud technologies](https://github.com/lynckia/licode)

官方没有提供 Android 端代码，需要参考官方 web 端行为和大佬的 Android 实现代码😭

实现的网络环境是局域网环境，需要搞清楚 ICE 与 内网 P2P 的关系；同时由于浏览器限制非本地访问摄像头、麦克风必须使用 https，即基于不安全的 https （内网 https），需要解决网络库的限制

比较接近 licode v9 版本的是 `alex`大佬的 Android 端实现：[songmm8998/Licode-for-Android: can run with android](https://github.com/songmm8998/Licode-for-Android)，但是很遗憾实测不能正常运行，说明并不是基于 v9 版本

> [haiyiya/LicodeTest1-Android](https://github.com/haiyiya/LicodeTest1-Android)

# 主要技术栈

### WebRTC

Web Real-Time Communications，浏览器之间点对点连接的实时通信技术（P2P），可以传输视频、音频或其他任意格式的数据

参看 [Android/WebRTC](../../Android/WebRtc)

> [Introduction to WebRTC protocols - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Protocols)

### Socket.IO

Socket.IO 是一个库，可在客户端和服务器之间实现低延迟、双向和基于事件的通信。

参看 [Android/WebRTC](../../Android/WebRtc)

# 连接 licode 服务端信令流程

#### `http` createToken

**↑** post

```json
port: {
    "mediaConfiguration": "default",
    "role": "presenter",
    "room": "basicExampleRoom",
    "type": "erizo",
    "username": "user98"
}
```

**↓** response

```
eyJ0b2tlbklkIjoiNjIzOWU5NDY2OGRmMzEwNmU2Njk5ZjMxIiwiaG9zdCI6IjE5Mi4xNjguMzEuMTUzOjgwODAiLCJzZWN1cmUiOnRydWUsInNpZ25hdHVyZSI6IlpqUm1aR1l6TlRKak0yWTRPR1JqTURrNE1ESXlObU5tTUdNd1lUa3daRFkzWlRBNE9XTXpNdz09In0
```

decode

```json
{
    "tokenId": "",
    "host": "",
    "secure": "",
    "signature": ""
}
```

#### `socket` 连接 signal server

```
https://192.168.31.153:8080/?singlePC=true&tokenId=%s&host=%s&secure=%s&signature=%s
```

#### `socket` signal server 连接成功

**↓** connected

```json
[
    {
        "socketgd": 0,
        "msg": {
            "streams": [],
            "id": "615ad262ce39f957af385b00",
            "clientId": "9c0d4a9c-7936-48a5-bbd3-05e297c9b645",
            "singlePC": "",
            "streamPriorityStrategy": false,
            "connectionTargetBw": 0,
            "defaultVideoBW": 300,
            "maxVideoBW": 300,
            "iceServers": []
        }
    },
    null
]
```

#### `socket` 发送 publish

**↑** publish

```json
{
    "options": {
        "attributes": {},
        "audio": true,
        "data": true,
        "encryptTransport": true,
        "label": "11350768715",
        "maxVideoBW": 300,
        "metadata": {
            "type": "publisher"
        },
        "minVideoBW": 0,
        "muteStream": {
            "audio": false,
            "video": false
        },
        "screen": false,
        "state": "erizo",
        "video": true
    }
}
```

**↓** ack

```json
[
    463685688956473700,
    "b35397cf-1308-6dc6-1b3d-d944e02ef17c",
    "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_1"
]
```

分别为 clientId, erizoId, connectionId

#### `socket` 发送 offer SDP

**↑** connectionMessage

```json
{
    "options": {
        "msg": {
            "type": "offer",
            "sdp": "v=0\r\no=- 1228173916970047020 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1\r\na=msid-semantic: WMS 11350768715\r\nm=video 9 UDP\/TLS\/RTP\/SAVPF 96 97 98 99 100 101 127 123 125\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:FRQW\r\na=ice-pwd:k5L\/MvwEuXcaZL\/Gqm1Cg41V\r\na=ice-options:trickle renomination\r\na=fingerprint:sha-256 2F:2B:BA:13:92:76:9B:88:51:62:90:B0:D6:2A:68:8E:CE:31:00:54:75:76:C9:C5:EF:A4:E0:1F:FC:5F:19:D5\r\na=setup:actpass\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time\r\na=extmap:3 urn:3gpp:video-orientation\r\na=extmap:4 http:\/\/www.ietf.org\/id\/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/playout-delay\r\na=extmap:6 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/video-content-type\r\na=extmap:7 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/video-timing\r\na=extmap:8 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/color-space\r\na=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:11350768715 100\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8\/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx\/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:98 VP9\/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=rtpmap:99 rtx\/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:100 H264\/90000\r\na=rtcp-fb:100 goog-remb\r\na=rtcp-fb:100 transport-cc\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=fmtp:100 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:101 rtx\/90000\r\na=fmtp:101 apt=100\r\na=rtpmap:127 red\/90000\r\na=rtpmap:123 rtx\/90000\r\na=fmtp:123 apt=127\r\na=rtpmap:125 ulpfec\/90000\r\na=ssrc-group:FID 1799458262 658344046\r\na=ssrc:1799458262 cname:nZKXT1Wids+WbJPa\r\na=ssrc:1799458262 msid:11350768715 100\r\na=ssrc:1799458262 mslabel:11350768715\r\na=ssrc:1799458262 label:100\r\na=ssrc:658344046 cname:nZKXT1Wids+WbJPa\r\na=ssrc:658344046 msid:11350768715 100\r\na=ssrc:658344046 mslabel:11350768715\r\na=ssrc:658344046 label:100\r\nm=audio 9 UDP\/TLS\/RTP\/SAVPF 111 103 104 9 102 0 8 106 105 13 110 112 113 126\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:FRQW\r\na=ice-pwd:k5L\/MvwEuXcaZL\/Gqm1Cg41V\r\na=ice-options:trickle renomination\r\na=fingerprint:sha-256 2F:2B:BA:13:92:76:9B:88:51:62:90:B0:D6:2A:68:8E:CE:31:00:54:75:76:C9:C5:EF:A4:E0:1F:FC:5F:19:D5\r\na=setup:actpass\r\na=mid:1\r\na=extmap:14 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:2 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time\r\na=extmap:4 http:\/\/www.ietf.org\/id\/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:11350768715 101\r\na=rtcp-mux\r\na=rtpmap:111 opus\/48000\/2\r\na=rtcp-fb:111 transport-cc\r\na=fmtp:111 minptime=10;useinbandfec=1\r\na=rtpmap:103 ISAC\/16000\r\na=rtpmap:104 ISAC\/32000\r\na=rtpmap:9 G722\/8000\r\na=rtpmap:102 ILBC\/8000\r\na=rtpmap:0 PCMU\/8000\r\na=rtpmap:8 PCMA\/8000\r\na=rtpmap:106 CN\/32000\r\na=rtpmap:105 CN\/16000\r\na=rtpmap:13 CN\/8000\r\na=rtpmap:110 telephone-event\/48000\r\na=rtpmap:112 telephone-event\/32000\r\na=rtpmap:113 telephone-event\/16000\r\na=rtpmap:126 telephone-event\/8000\r\na=ssrc:2702282454 cname:nZKXT1Wids+WbJPa\r\na=ssrc:2702282454 msid:11350768715 101\r\na=ssrc:2702282454 mslabel:11350768715\r\na=ssrc:2702282454 label:101\r\n"
        },
        "browser": "chrome-stable",
        "connectionId": "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_1",
        "erizoId": "b35397cf-1308-6dc6-1b3d-d944e02ef17c"
    }
}
```

#### `scoket` 收到 anwser SDP

**↓** connection_message_erizo

```json
[
    {
        "socketgd": 1,
        "msg": {
            "connectionId": "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_1",
            "info": 202,
            "evt": {
                "type": "answer",
                "sdp": "v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\ns=LicodeMCU\r\nt=0 0\r\na=msid-semantic: WMS *\r\na=group:BUNDLE 0 1\r\nm=video 9 UDP\/TLS\/RTP\/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtpmap:96 VP8\/90000\/2\r\na=rtcp:1 IN IP4 0.0.0.0\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtcp-fb:96 goog-remb\r\na=extmap:1 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time\r\na=extmap:3 urn:3gpp:video-orientation\r\na=extmap:5 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/playout-delay\r\na=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=setup:active\r\na=mid:0\r\na=recvonly\r\na=ice-ufrag:0eb9fc34\r\na=ice-pwd:e98f9fc07f1737f6fd399ca9f46a528d\r\na=fingerprint:sha-256 37:BA:96:E4:C1:DF:1B:E0:8C:FE:A7:7E:03:47:74:68:C0:F0:66:EC:EB:1D:2D:BF:4F:9D:7B:BF:19:DD:44:17\r\na=candidate:0 1 udp 2130575615 192.168.31.153 38019 typ host generation 0\r\na=end-of-candidates\r\na=rtcp-mux\r\nm=audio 9 UDP\/TLS\/RTP\/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtpmap:111 opus\/48000\/2\r\na=rtcp:1 IN IP4 0.0.0.0\r\na=extmap:2 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time\r\na=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:14 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=setup:active\r\na=mid:1\r\na=recvonly\r\na=ice-ufrag:0eb9fc34\r\na=ice-pwd:e98f9fc07f1737f6fd399ca9f46a528d\r\na=fingerprint:sha-256 37:BA:96:E4:C1:DF:1B:E0:8C:FE:A7:7E:03:47:74:68:C0:F0:66:EC:EB:1D:2D:BF:4F:9D:7B:BF:19:DD:44:17\r\na=candidate:0 1 udp 2130575615 192.168.31.153 38019 typ host generation 0\r\na=end-of-candidates\r\na=rtcp-mux\r\n"
            }
        }
    },
    null
]
```

#### `socket` SDP 交换完成

**↓** connection_message_erizo

```json
[
    {
        "socketgd": 2,
        "msg": {
            "connectionId": "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_1",
            "info": 104,
            "evt": {
                "type": "ready"
            }
        }
    },
    null
]
```

#### `socket` 发送 candidate

**↑** connectionMessage

```json
{
    "options": {
        "msg": {
            "type": "candidate",
            "candidate": {
                "sdpMLineIndex": 0,
                "sdpMid": "0",
                "candidate": "candidate:3443335152 1 udp 2122260223 192.168.31.26 42923 typ host generation 0 ufrag FRQW network-id 3 network-cost 10"
            }
        },
        "browser": "chrome-stable",
        "connectionId": "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_1",
        "erizoId": "b35397cf-1308-6dc6-1b3d-d944e02ef17c"
    }
}
```

#### `socket` 收到传输质量提示？

**↓** connection_message_erizo

```json
[
    {
        "socketgd": 4,
        "msg": {
            "connectionId": "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_1",
            "info": 150,
            "evt": {
                "type": "quality_level",
                "level": 2
            }
        }
    },
    null
]
```

# 订阅信令流程

#### `socket` 收到流添加事件（有人进入房间）

**↓** onAddStream

```json
[
    {
        "socketgd": 5,
        "msg": {
            "id": 695769838857235800,
            "audio": true,
            "video": true,
            "data": true,
            "label": "MGY3Stu3CfHcIrCVUJuHsscJiVvPDqLFTnWp",
            "screen": false,
            "attributes": {}
        }
    },
    null
]
```

#### `socket` 订阅流

**↑** subscribe

```json
{
    "options": {
        "audio": true,
        "browser": "chrome-stable",
        "data": true,
        "encryptTransport": true,
        "maxVideoBW": 300,
        "metadata": {
            "type": "subscriber"
        },
        "muteStream": {
            "audio": false,
            "video": false
        },
        "slideShowMode": false,
        "streamId": 695769838857235800,
        "video": true
    }
}
```

**↓** ack

```json
[
    true,
    "b35397cf-1308-6dc6-1b3d-d944e02ef17c",
    "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_2"
]
```

分别为：订阅是否成功？, erizoId, connectionId

#### `socket` 收到 offer SDP

**↓** connection_message_erizo

```json
[
    {
        "socketgd": 6,
        "msg": {
            "connectionId": "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_2",
            "info": 202,
            "evt": {
                "type": "offer",
                "sdp": "v=0\r\no=- 0 0 IN IP4 127.0.0.1\r\ns=LicodeMCU\r\nt=0 0\r\na=msid-semantic: WMS *\r\na=group:BUNDLE 0 1\r\nm=audio 9 UDP\/TLS\/RTP\/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtpmap:111 opus\/48000\/2\r\na=rtcp:1 IN IP4 0.0.0.0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:2 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time\r\na=setup:actpass\r\na=mid:0\r\na=msid:MGY3Stu3CfHcIrCVUJuHsscJiVvPDqLFTnWp 0\r\na=sendrecv\r\na=ice-ufrag:ae857b88\r\na=ice-pwd:575ee6fc04e96a219b06de1e2a5b4614\r\na=fingerprint:sha-256 37:BA:96:E4:C1:DF:1B:E0:8C:FE:A7:7E:03:47:74:68:C0:F0:66:EC:EB:1D:2D:BF:4F:9D:7B:BF:19:DD:44:17\r\na=candidate:0 1 udp 2122252543 192.168.31.153 39538 typ host generation 0\r\na=end-of-candidates\r\na=ssrc:1198466483 cname:erizo\r\na=ssrc:1198466483 msid:MGY3Stu3CfHcIrCVUJuHsscJiVvPDqLFTnWp 0\r\na=ssrc:1198466483 mslabel:MGY3Stu3CfHcIrCVUJuHsscJiVvPDqLFTnWp\r\na=ssrc:1198466483 label:0\r\na=rtcp-mux\r\nm=video 9 UDP\/TLS\/RTP\/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtpmap:96 VP8\/90000\/2\r\na=rtcp:1 IN IP4 0.0.0.0\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtcp-fb:96 goog-remb\r\na=extmap:2 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time\r\na=extmap:5 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/playout-delay\r\na=extmap:13 urn:3gpp:video-orientation\r\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\r\na=setup:actpass\r\na=mid:1\r\na=msid:MGY3Stu3CfHcIrCVUJuHsscJiVvPDqLFTnWp 1\r\na=sendrecv\r\na=ice-ufrag:ae857b88\r\na=ice-pwd:575ee6fc04e96a219b06de1e2a5b4614\r\na=fingerprint:sha-256 37:BA:96:E4:C1:DF:1B:E0:8C:FE:A7:7E:03:47:74:68:C0:F0:66:EC:EB:1D:2D:BF:4F:9D:7B:BF:19:DD:44:17\r\na=candidate:0 1 udp 2122252543 192.168.31.153 39538 typ host generation 0\r\na=end-of-candidates\r\na=ssrc:1750674681 cname:erizo\r\na=ssrc:1750674681 msid:MGY3Stu3CfHcIrCVUJuHsscJiVvPDqLFTnWp 1\r\na=ssrc:1750674681 mslabel:MGY3Stu3CfHcIrCVUJuHsscJiVvPDqLFTnWp\r\na=ssrc:1750674681 label:1\r\na=rtcp-mux\r\n"
            }
        }
    },
    null
]
```

#### `socket` 发送 anwser SDP

**↑** connectionMessage

```json
{
    "options": {
        "msg": {
            "type": "answer",
            "sdp": "v=0\r\no=- 5184408989206085466 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1\r\na=msid-semantic: WMS\r\nm=audio 9 UDP\/TLS\/RTP\/SAVPF 111\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:ZXsS\r\na=ice-pwd:XTWdk4HaHQkDbYQUXi\/3nDYC\r\na=ice-options:trickle renomination\r\na=fingerprint:sha-256 93:1C:1D:76:9B:1E:D1:12:07:2D:36:7A:E8:04:52:EB:8B:63:6B:EC:6A:DD:58:42:FE:CA:DD:3E:95:88:7C:7C\r\na=setup:active\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:2 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time\r\na=recvonly\r\na=rtcp-mux\r\na=rtpmap:111 opus\/48000\/2\r\na=fmtp:111 minptime=10;useinbandfec=1\r\nm=video 9 UDP\/TLS\/RTP\/SAVPF 96\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:ZXsS\r\na=ice-pwd:XTWdk4HaHQkDbYQUXi\/3nDYC\r\na=ice-options:trickle renomination\r\na=fingerprint:sha-256 93:1C:1D:76:9B:1E:D1:12:07:2D:36:7A:E8:04:52:EB:8B:63:6B:EC:6A:DD:58:42:FE:CA:DD:3E:95:88:7C:7C\r\na=setup:active\r\na=mid:1\r\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/abs-send-time\r\na=extmap:13 urn:3gpp:video-orientation\r\na=extmap:5 http:\/\/www.webrtc.org\/experiments\/rtp-hdrext\/playout-delay\r\na=recvonly\r\na=rtcp-mux\r\na=rtpmap:96 VP8\/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\n"
        },
        "browser": "chrome-stable",
        "connectionId": "9c0d4a9c-7936-48a5-bbd3-05e297c9b645_b35397cf-1308-6dc6-1b3d-d944e02ef17c_2",
        "erizoId": "b35397cf-1308-6dc6-1b3d-d944e02ef17c"
    }
}
```

#### `socket` 发送 candidate

**↑** connectionMessage

```json
{
    "adapterType": "UNKNOWN",
    "sdp": "candidate:3443335152 1 udp 2122260223 192.168.31.26 39418 typ host generation 0 ufrag ZXsS network-id 3 network-cost 10",
    "sdpMLineIndex": 0,
    "sdpMid": "0",
    "serverUrl": ""
}
```

> [!TIP]
>
> 房间中已有的流在 **↓** connected 事件消息的 `streams`中，也可用此信令流程订阅

# 实现过程中的问题

### socket.io 连接 EVENT_CONNECT_ERROR

查看 `Socket.EVENT_CONNECT_ERROR`事件的回调方法 `call`可以看到错误堆栈中包含 okhttp 报证书错误

socket.io 基于 okhttp，默认不允许通过不安全的 https 传输数据，可配置 okhttp 不校验证书，参看 [Tomcat/Android端不安全https处理](../../Tomcat/Android端不安全https处理)

```java
IO.Options opts = new IO.Options();
OkHttpClient client = HttpUtils.getNoVerifyOkHttpClient();
opts.callFactory = client;
opts.webSocketFactory = client;
```

### socket.io 连接地址协议和路径问题

从 licode 官方 web 端示例中可以发现，socket.io 连接地址为 wss://ip:port/socket.io

低版本 socket.io 不支持 `wss`协议，拼装连接地址时，使用 `https`协议即可，且不用添加 `/socket.io/`，因为它是 socket.io 的默认路径，可通过 `IO.Options.path`属性自定义

### socket.io 连接 response status 为 101 或 connected 事件后报 token: Token does not exist/token: Authentication error

signature 参数没有 url 编码，应使用 `URLEncoder.encode`方法处理参数

```
// 错误
...&signature=ZWFmMjM0YTVmNzQ4MDYzYTZhNTE0NzYxMzdlOGVlOGJkOGE5YTg1ZA==...
// 正确
...&signature=MzU4ZTAwMjZjZTg4ZGJiNjY4YWRmNTlkYjY4ZDUwYTY2YjVlNmFhMA%3D%3D...
```

### socket 连接报 It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, which is not possible

将客户端 socket.io 更换为 1.0.0 版本，已经可以满足实现 licode 信令

### SDP 格式问题

发送 SDP 后看到服务端报错

```
2022-03-14 07:37:23,786  - DEBUG [0x7f0e93fff700] WebRtcConnection - id: 71b76c9a-8d87-4bad-87ac-0c83f867e851_a07d92e9-b5db-f812-6470-aadf29a90217_1, distributor: 1, strategyId: none, type: publisher,  message: processing remote SDP
2022-03-14 07:37:23,786  - DEBUG [0x7f0e93fff700] WebRtcConnection - id: 71b76c9a-8d87-4bad-87ac-0c83f867e851_a07d92e9-b5db-f812-6470-aadf29a90217_1, distributor: 1, strategyId: none, type: publisher,  message: process remote sdp, setup: 1
2022-03-14 07:37:23,786  - DEBUG [0x7f0e93fff700] WebRtcConnection - id: 71b76c9a-8d87-4bad-87ac-0c83f867e851_a07d92e9-b5db-f812-6470-aadf29a90217_1, distributor: 1, strategyId: none, type: publisher,  message: Process transceivers from remote sdp, size: 3, localSize: 0
[erizo-a07d92e9-b5db-f812-6470-aadf29a90217] terminate called after throwing an instance of 'std::invalid_argument'
  what():  stoi
```

找了下官方代码，发现erizo/src/erizo/WebRtcConnection.cpp中使用了 `uint32_t`类型来接收 sdp 中的 `mid`

```cpp
void WebRtcConnection::detectNewTransceiversInRemoteSdp() {
  // We don't check directions of previous transceivers because we manage
  // that by adding and removing media streams.
  size_t index = 0;
  ELOG_DEBUG("%s message: Process transceivers from remote sdp, size: %d, localSize: %d",
    toLog(), remote_sdp_->medias.size(), transceivers_.size());
  for (const SdpMediaInfo &media_info : remote_sdp_->medias) {
    uint32_t mid = std::stoi(media_info.mid);
    if (index >= transceivers_.size()) {
```

与官方 web 端对比发现 SDP 确实存在差异

```
# android
a=group:BUNDLE audio video data
a=mid:audio

# web
a=group:BUNDLE 0 1
a=mid:0
```

创建 SDP 时应配置 `sdpSemantics`（语义）为 `UNIFIED_PLAN`（标准）

```java
PeerConnection.RTCConfiguration rtcConfig = new PeerConnection.RTCConfiguration(iceServers);
rtcConfig.sdpSemantics = PeerConnection.SdpSemantics.UNIFIED_PLAN;
```

### 已完成连接 licode 服务端的信令流程，但服务端在 web 端看不到 android 端视频（音频）

`PeerConnection.addTrack`方法中的第二参数是 `List<String> streamIds`，需要包含 **↑** publish 中的`label`
