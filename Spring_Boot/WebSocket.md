# WebSocket

# 问题

### 单元测试报`java.lang.IllegalStateException: javax.websocket.server.ServerContainer not available`

```bash
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
```

> 因为在启动单元测试时，SpringBootTest不会启动服务器，WebSocket自然也就没有启动，但是在代码里又配置了WebSocket，就会出错。
>
> [SpringBoot启动单元测试报错javax.websocket.server.ServerContainer not available-CSDN博客](https://blog.csdn.net/shenjuntao520/article/details/115206335)