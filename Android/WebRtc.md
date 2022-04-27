# WebRTC

参看 [js/WebRTC](../js/WebRtc)

# 主要技术栈

### Socket.IO

> Socket.IO is a library that enables low-latency, bidirectional and event-based communication between a client and a server.
>
> Socket.IO 是一个库，可在客户端和服务器之间实现低延迟、双向和基于事件的通信。
> 
> It is built on top of the WebSocket protocol and provides additional guarantees like fallback to HTTP long-polling or automatic reconnection.
>
> 它建立在WebSocket协议之上，并提供额外的保证，如回退到HTTP长轮询或自动重新连接。
>
> [Introduction | Socket.IO](https://socket.io/docs/v4/)

所以官方提示 **Socket.IO 不是一个 WebSocket 的实现**

> [!INFO]
> WebSocket is a communication protocol which provides a full-duplex and low-latency channel between the server and the browser. More information can be found here.
>
> WebSocket 是一个在服务器和浏览器之间提供全双工、低延迟通道的通信协议