# WebRTC

Web Real-Time Communications，浏览器之间点对点连接的实时通信技术（P2P），可以传输视频、音频或其他任意格式的数据

ICE: Interactive Connectivity Establishment，允许浏览器和浏览器之间建立连接的协议框架，可以绕过防火墙给设备分配一个唯一可见的地址（通常大部分设备没有一个固定的公网地址）

NAT: Network Address Translation，网络地址转换协议，用来给私网设备映射一个公网IP

STUN：ICE的实现，Session Traversal Utilities for NAT, 客户端给公网STUN服务器发送请求，获得自己的公网地址信息以及是否能被访问

TURN: ICE的实现，Traversal Using Relays around NAT, 通过TURN服务器中继所有数据，开销较大

SDP: Session Description Protocol，描述多媒体连接内容的协议，如分辨率、格式、编码、加密算法等
