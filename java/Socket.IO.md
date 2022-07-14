# Socket.IO

> Socket.IO is a library that enables low-latency, bidirectional and event-based communication between a client and a server.
>
> Socket.IO 是一个库，可在客户端和服务器之间实现低延迟、双向和基于事件的通信。
>
> It is built on top of the WebSocket protocol and provides additional guarantees like fallback to HTTP long-polling or automatic reconnection.
>
> 它建立在WebSocket协议之上，并提供额外的保证，如回退到HTTP长轮询或自动重新连接。
>
> [Introduction | Socket.IO](https://socket.io/docs/v4/)
>
> ### Performant
>
> In most cases, the connection will be established with WebSocket, providing a low-overhead communication channel between the server and the client.
>
> 高性能：大多数时候，使用 WebSocket 在服务端和客户端之间建立低开销的通信通道。
>
> ### Reliable
>
> Rest assured! In case the WebSocket connection is not possible, it will fall back to HTTP long-polling. And if the connection is lost, the client will automatically try to reconnect.
>
> 可靠性：如果 WebSocket 不可用，将会回退到 http 长轮询，如果连接中断，客户端会自动重连。
>
> ### Scalable
>
> Scale to multiple servers and send events to all connected clients with ease.
>
> 可扩展性：轻松扩展到多台服务器，并将事件发送到所有连接的客户端。
>
> [Socket.IO](https://socket.io/)

所以官方提示 **Socket.IO 不是一个 WebSocket 的实现**

> [!TIP]
> WebSocket is a communication protocol which provides a full-duplex and low-latency channel between the server and the browser. More information can be found here.
>
> WebSocket 是一个在服务器和浏览器之间提供全双工、低延迟通道的通信协议

> ![Server in the class diagram for the server](server-class-diagram-server.png)
>
> ### Namespace
>
> Represents a pool of sockets connected under a given scope identified by a pathname (eg: `/chat`).
>
> 表示在由路径名标识的给定范围内连接的套接字池（例如：/chat）。
>
> ### Socket
>
> A `Socket` is the fundamental class for interacting with browser clients. A `Socket` belongs to a certain `Namespace` (by default `/`) and uses an underlying `Client` to communicate.
>
> Socket 是与浏览器客户端交互的基础类。一个 Socket 属于某个 Namespace（默认为 /），并使用底层 Client 进行通信。
>
> https://socket.io/docs/v4/server-api

> [Socket.IO打造基础聊天室 - 简书 (jianshu.com)](https://www.jianshu.com/p/51b0d1f80392)
>
> [socket.io 中namespace 和 room的概念。_全栈无侠的博客-CSDN博客](https://blog.csdn.net/lijiecong/article/details/50781417)

# Netty-socketio

> This project is an open-source Java implementation of [Socket.IO](http://socket.io/) server. Based on [Netty](http://netty.io/) server framework.
>
> Socket.IO 服务器的实现，基于 Netty 服务器框架。
>
> [mrniko/netty-socketio: Socket.IO server implemented on Java. Realtime java framework (github.com)](https://github.com/mrniko/netty-socketio)
>
> [mrniko/netty-socketio-demo: netty-socketio demo (github.com)](https://github.com/mrniko/netty-socketio-demo)

> [!NOTE]
>
> Netty-socketio 仅支持 socket.io-client 1.0.1 及以下版本
>
> [Does the latest 1.7.19 version support SockeTiO 3.x /4.x? · Issue #805 · mrniko/netty-socketio (github.com)](https://github.com/mrniko/netty-socketio/issues/805)

> [Java集成socket.io_朝花不迟暮的博客-CSDN博客_java socketio](https://blog.csdn.net/Curtisjia/article/details/118034542)
>
> [SocketIO实现Java聊天服务端_文艺的码农青年的博客-CSDN博客](https://blog.csdn.net/weixin_41012481/article/details/103269720)
>
> [netty-socketio 概述 - 不完全個体 - 博客园 (cnblogs.com)](https://www.cnblogs.com/pomer-huang/p/netty-socketio.html)

### 启动服务

配置项：[Configuration details · mrniko/netty-socketio Wiki (github.com)](https://github.com/mrniko/netty-socketio/wiki/Configuration-details)

```java
com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
// config.setHostname("192.168.3.106");
config.setPort(27301);
config.setBossThreads(1);
config.setWorkerThreads(1000);
config.setAllowCustomRequests(true);
config.setMaxFramePayloadLength(1048576);
config.setMaxHttpContentLength(1048576);
// 鉴权监听，可在此处取出参数进行鉴权
config.setAuthorizationListener(new AuthorizationListener() {

    @Override
    public boolean isAuthorized(HandshakeData arg0) {
        String token = arg0.getSingleUrlParam("token");
        try {
            SrsChatSubject scs = srsChatHelper.parseToken(token);
            logger.info(String.format("signaling authorized: client: %s", scs));
            return true;
        }catch(Exception e) {
            logger.error(e.getMessage(), e);
            return false;
        }
    }
});
server = new SocketIOServer(config);
```

### 命名空间和事件监听

```java
// 添加/chat命名空间
SocketIONamespace nchat = server.addNamespace("/chat");
// 客户端连接事件
nchat.addConnectListener(new ConnectListener() {

    @Override
    public void onConnect(SocketIOClient client) {
        
    }
});
// 客户端取消连接事件
nchat.addDisconnectListener(new DisconnectListener() {

    @Override
    public void onDisconnect(SocketIOClient client) {
        
    }

});
// 自定义事件
nchat.addEventListener("client_publish", String.class, new DataListener<String>() {
    
    @Override
    public void onData(SocketIOClient client, String arg1, AckRequest arg2) throws Exception {
        // 可在事件中直接回复客户端
        arg2.sendAckData("xxxxx");
    }
});
```

### 发送事件

向客户端发送事件：

```java
client.sendEvent("room_clients", JSON.toJSONString(info));
```

BroadcastOperations: 广播操作，即对某一群体发送事件：

```java
// 广播事件
broadcastOperations.sendEvent("room_clients", JSON.toJSONString(info));

// server
server.getBroadcastOperations();
// namespace
nchat.getBroadcastOperations();
// room
server.getRoomOperations(roomNo);
```

### 其他操作

```java
// 获得客户端ID
UUID id = client.getSessionId();
// 获得客户端
SocketIOClient client = server.getClient(UUID.fromString("xxx"))
SocketIOClient client = nchat.getClient(UUID.fromString("xxx"))
// 将客户端添加到某一房间
client.joinRoom(subject.roomNo);
// 在client中存取数据
client.set("roomNo", subject.roomNo);
String roomNo = c.get("roomNo");
```

# socket.io-client

```java
IO.Options opts = new IO.Options();
opts.forceNew = true;
opts.reconnection = true;
opts.reconnectionAttempts = 3;
opts.secure = false;
// 传输方式，有WebSocket和Polling(轮询)
opts.transports = new String[]{WebSocket.NAME};
// Socket.IO默认路径为/socket.io/
opts.path = "/socket.io/";

// 信任不安全https
OkHttpClient client = HttpUtils.getNoVerifyOkHttpClientMaybe();
opts.callFactory = client;
opts.webSocketFactory = client;

mSocket = IO.socket(URI.create(String.format("%s?token=%s", signalingUrl, token)), opts);
// 连接事件
mSocket.on(Socket.EVENT_CONNECT, args -> {
    Log.d("socket", "EVENT_CONNECT " + mSocket.id() + " " + sessionId);
    sessionId = mSocket.id().replaceAll("^.*?#", "");

// 断开连接事件
}).on(Socket.EVENT_DISCONNECT, args -> {
    Log.d("socket", "EVENT_DISCONNECT " + StringUtils.toJSONString(args));

// 连接异常事件
}).on(Socket.EVENT_CONNECT_ERROR, args -> {
    Log.d("socket", "EVENT_CONNECT_ERROR " + StringUtils.toJSONString(args));

// 自定义事件
}).on("a_join", args -> {
    Log.d("socket", "a_join " + Thread.currentThread().getId() + " " + StringUtils.toJSONString(args));
    SrsChatClient chatClient = JSON.parseObject(getMsg(args), SrsChatClient.class);
})
mSocket.connect();
```

有一个很诡异的地方是，连接 Netty-Socket.IO 服务端的时候，服务端在连接事件和自定义事件中向客户端发送事件，事件内容在参数 args（类型为 Object...）中的索引有时为1，暂时不知道原因:dog:

```java
// TODO ------ socket io msg!!!
private String getMsg(Object... args){
    return String.valueOf(args[args.length - 1]);
}
```

> [Native Socket.IO and Android | Socket.IO](https://socket.io/blog/native-socket-io-and-android/)

# 问题

### socket io Expected HTTP 101 response but was '200 OK'

很有可能是服务端使用的 websocket，而不是 socket.io

### 400

可能是版本太高

> [Socket.io 400 (Bad Request)_ll_xiaohanqing_91的博客-CSDN博客](https://blog.csdn.net/ll_xiaohanqing_91/article/details/51107614)

### Received fatal alert: certificate_unknown

```log
2022-07-02 14:53:54 nioEventLoopGroup-3-31 ERROR DefaultExceptionListener.exceptionCaught:53 : javax.net.ssl.SSLException: Received fatal alert: certificate_unknown
io.netty.handler.codec.DecoderException: javax.net.ssl.SSLException: Received fatal alert: certificate_unknown
	at io.netty.handler.codec.ByteToMessageDecoder.callDecode(ByteToMessageDecoder.java:480)
	at io.netty.handler.codec.ByteToMessageDecoder.channelRead(ByteToMessageDecoder.java:279)
	at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:379)
	at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:365)
	at io.netty.channel.AbstractChannelHandlerContext.fireChannelRead(AbstractChannelHandlerContext.java:357)
	at io.netty.channel.DefaultChannelPipeline$HeadContext.channelRead(DefaultChannelPipeline.java:1410)
	at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:379)
	at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:365)
	at io.netty.channel.DefaultChannelPipeline.fireChannelRead(DefaultChannelPipeline.java:919)
	at io.netty.channel.nio.AbstractNioByteChannel$NioByteUnsafe.read(AbstractNioByteChannel.java:166)
	at io.netty.channel.nio.NioEventLoop.processSelectedKey(NioEventLoop.java:722)
	at io.netty.channel.nio.NioEventLoop.processSelectedKeysOptimized(NioEventLoop.java:658)
	at io.netty.channel.nio.NioEventLoop.processSelectedKeys(NioEventLoop.java:584)
	at io.netty.channel.nio.NioEventLoop.run(NioEventLoop.java:496)
	at io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:995)
	at io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
	at io.netty.util.concurrent.FastThreadLocalRunnable.run(FastThreadLocalRunnable.java:30)
```

使用了 wss 协议连接到，应该使用 https，因为 socket.io 不是 websocket 的实现

```javascript
// WebSocket
WebSocket("wss://192.168.3.106:27301/socket.io/chat?token=" + res.data.token"")
// Socket.IO
io("https://192.168.3.106:27301/socket.io/chat?token=" + res.data.token")
```

