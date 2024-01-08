# Netty

> Netty is an NIO client server framework which enables quick and easy development of network applications such as protocol servers and clients. It greatly simplifies and streamlines network programming such as TCP and UDP socket server.
>
> 'Quick and easy' doesn't mean that a resulting application will suffer from a maintainability or a performance issue. Netty has been designed carefully with the experiences earned from the implementation of a lot of protocols such as FTP, SMTP, HTTP, and various binary and text-based legacy protocols. As a result, Netty has succeeded to find a way to achieve ease of development, performance, stability, and flexibility without a compromise
>
> Netty 是一个 NIO 客户端服务器框架，可以快速轻松地开发协议服务器和客户端等网络应用程序。它极大地简化和简化了网络编程，例如 TCP 和 UDP 套接字服务器。
>
> “快速而简单”并不意味着生成的应用程序将遭受可维护性或性能问题。 Netty 是根据许多协议（如 FTP、SMTP、HTTP 以及各种基于二进制和文本的遗留协议）的实现经验精心设计的。因此，Netty 成功地找到了一种在不妥协的情况下实现开发简易性、性能、稳定性和灵活性的方法。
>
> [Netty: Home](https://netty.io/)

# TCP

### 服务端

```java
package com.xxx;

import com.xxx.common.utils.ByteUtils;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.DelimiterBasedFrameDecoder;
import io.netty.handler.timeout.IdleStateHandler;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.TimeUnit;

@Slf4j
public class TCPServerTest1 {

    private static final int[][] ESCAPE_MAP = {
            {0x5B, 0x5A, 0x01},
            {0x5A, 0x5A, 0x02},
            {0x5D, 0x5E, 0x01},
            {0x5E, 0x5E, 0x02}
    };

    private static NioEventLoopGroup bossGroup;
    private static NioEventLoopGroup acceptGroup;
    private static Channel channel;

    public static void main(String[] args) {
        ServerBootstrap bootstrap = new ServerBootstrap().group(bossGroup = new NioEventLoopGroup(), acceptGroup = new NioEventLoopGroup())
                .channel(NioServerSocketChannel.class)
                .option(ChannelOption.SO_BROADCAST, true)
                .childHandler(new ChannelInitializer<SocketChannel>() { //
                    @Override
                    public void initChannel(SocketChannel ch) throws Exception {
                        // 超过15分钟未收到客户端消息则自动断开客户端连接
                        ch.pipeline().addLast("idleStateHandler",
                                new IdleStateHandler(15, 0, 0, TimeUnit.MINUTES));
                        // 以5B、5D为开头结尾定界符
                        ch.pipeline().addLast(
                                new DelimiterBasedFrameDecoder(1024, Unpooled.copiedBuffer(new byte[]{0x5B}), Unpooled.copiedBuffer(new byte[]{0x5D})));
                        // 给管道设置处理器
                        ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                // 客户端连接时
                                // 连接时向客户端发送一条消息
                                send(ctx, new byte[]{0x5B, 0x01, 0x5D});
                            }

                            @Override
                            public void channelInactive(ChannelHandlerContext ctx) throws Exception {
                                // 客户端断开时
                                super.channelInactive(ctx);
                            }

                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                // 收到客户端消息时
                                ByteBuf buf = (ByteBuf) msg;
                                if (buf.readableBytes() <= 0) {
                                    // ReferenceCountUtil.safeRelease(msg);
                                    return;
                                }

                                byte[] bs = new byte[buf.readableBytes()];
                                buf.readBytes(bs);
                                // 消息反转义
                                bs = ByteUtils.unescape(ESCAPE_MAP, bs);
                                log.info("msg: {}", ByteUtils.unsignedBytes2String(16, bs));

                                // 收到消息后，原样返回给客户端
                                send(ctx, bs);
                            }
                        });
                    }
                }).option(ChannelOption.SO_BACKLOG, 128) //
                .childOption(ChannelOption.SO_KEEPALIVE, true);

        // 启动服务器
        new Thread(() -> {
            try {
                log.info("tcp server starting...");
                channel = bootstrap.bind("0.0.0.0", 23100).sync().channel();
                // 等待ChannelFuture，即阻塞线程保持服务端运行
                channel.closeFuture().await();

            } catch (InterruptedException e) {
                throw new RuntimeException(e);

            } finally {
                bossGroup.shutdownGracefully();
                acceptGroup.shutdownGracefully();
                log.info("tcp server closed");
            }
        }).start();

        // 关闭服务器
        new Thread(() -> {
            try {
                Thread.sleep(20000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            channel.close();
        }).start();
    }

    private static void send(ChannelHandlerContext ctx, byte[] bytes) {
        // 消息转义
        bytes = ByteUtils.escape(ESCAPE_MAP, bytes);
        // 发送
        ctx.writeAndFlush(Unpooled.copiedBuffer(new byte[]{0x5B}, ByteUtils.escape(ESCAPE_MAP, bytes), new byte[]{0x5D}));
        log.info("send: {}", ByteUtils.unsignedBytes2String(16, bytes));
    }
}
```

这个是一个包含服务端启动、关闭、定界符消息处理器、接收消息、发送、客户端启动、关闭事件的 TCP 服务端例子。

> [!TIP]
>
> 启动服务端的线程中，`ChannelFuture chn = channel.closeFuture()`方法并非关闭通道，仅仅是取得端关闭的`Future`，`await`这个`Future`，代表一直阻塞，除非`channel.close()`方法被调用。
>
> 阻塞线程并非为了维持服务端的运行，因为服务端运行在它自身启动的线程。可以看到`finally`中关闭了线程组，这种写法的作用是利用启动线程等待 TCP 服务端关闭，关闭线程组等资源。当我们需要关闭 TCP 服务端时，只需调用`channel.close()`方法，关闭完成后，启动线程的`channel.closeFuture`不再阻塞，往下执行，回收相关资源，整个流程可以比较流畅丝滑。

另一种关闭方法（不阻塞启动线程）

```java
private static void start() {
    try {
        log.info("tcp server starting...");
        channel = bootstrap.bind("0.0.0.0", 23100).sync().channel();

    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
}

private static void close() {
    if(channel == null || !channel.isOpen()) {
        return;
    }
    try {
        channel.close().await(10, TimeUnit.SECONDS);
    } catch (InterruptedException e) {
        log.error("关闭失败：{}", e.getMessage(), e);

    } finally {
        bossGroup.shutdownGracefully();
        acceptGroup.shutdownGracefully();
        log.info("tcp server closed");
    }
}
```

