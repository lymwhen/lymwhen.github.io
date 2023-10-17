# Tomcat

#### maxConnections、maxThreads、acceptCount

**高并发时必须调大这几个参数**

一、accept-count：最大等待数

官方文档的说明为：当所有的请求处理线程都在使用时，所能接收的连接请求的队列的最大长度。当队列已满时，任何的连接请求都将被拒绝。accept-count的默认值为100。
 详细的来说：当调用HTTP请求数达到tomcat的最大线程数时，还有新的HTTP请求到来，这时tomcat会将该请求放在等待队列中，这个acceptCount就是指能够接受的最大等待数，默认100。如果等待队列也被放满了，这个时候再来新的请求就会被tomcat拒绝（connection refused）。

二、maxConnections：最大连接数

官方文档的说明为：

这个参数是指在同一时间，tomcat能够接受的最大连接数。对于Java的阻塞式BIO，默认值是maxthreads的值；如果在BIO模式使用定制的Executor执行器，默认值将是执行器中maxthreads的值。对于Java 新的NIO模式，maxConnections 默认值是10000。
 对于windows上APR/native IO模式，maxConnections默认值为8192，这是出于性能原因，如果配置的值不是1024的倍数，maxConnections 的实际值将减少到1024的最大倍数。
 如果设置为-1，则禁用maxconnections功能，表示不限制tomcat容器的连接数。
 maxConnections和accept-count的关系为：当连接数达到最大值maxConnections后，系统会继续接收连接，但不会超过acceptCount的值。

三、maxThreads：最大线程数

每一次HTTP请求到达Web服务，tomcat都会创建一个线程来处理该请求，那么最大线程数决定了Web服务容器可以同时处理多少个请求。maxThreads默认200，肯定建议增加。但是，增加线程是有成本的，更多的线程，不仅仅会带来更多的线程上下文切换成本，而且意味着带来更多的内存消耗。JVM中默认情况下在创建新线程时会分配大小为1M的线程栈，所以，更多的线程异味着需要更多的内存。线程数的经验值为：1核2g内存为200，线程数经验值200；4核8g内存，线程数经验值800。

> [秒懂：tomcat 最大线程数 最大连接数 - 简书 (jianshu.com)](https://www.jianshu.com/p/5198359b59f7)

> Each incoming, non-asynchronous request requires a thread for the duration of that request. If more simultaneous requests are received than can be handled by the currently available request processing threads, additional threads will be created up to the configured maximum (the value of the `maxThreads` attribute). If still more simultaneous requests are received, Tomcat will accept new connections until the current number of connections reaches `maxConnections`. Connections are queued inside the server socket created by the **Connector** until a thread becomes available to process the connection. Once `maxConnections` has been reached the operating system will queue further connections. The size of the operating system provided connection queue may be controlled by the `acceptCount` attribute. If the operating system queue fills, further connection requests may be refused or may time out.
>
> 每个传入的非异步请求在该请求持续时间内都需要一个线程。如果同时收到的请求数量多于当前可用请求处理线程的处理能力，则会创建额外的线程，最多可达配置的最大值（maxThreads 属性的值）。如果同时收到更多请求，Tomcat 将接受新连接，直到当前连接数达到 maxConnections。连接在连接器创建的服务器套接字内排队，直到有线程可用于处理连接。一旦达到 maxConnections，操作系统将对更多连接进行排队。操作系统提供的连接队列的大小可以由acceptCount属性控制。如果操作系统队列已满，进一步的连接请求可能会被拒绝或可能超时。
>
> | Attribute | Description |
> | ---------------- | ------------------------------------------------------------ |
> | `acceptCount`    | The maximum length of the operating system provided queue for incoming connection requests when `maxConnections` has been reached. The operating system may ignore this setting and use a different size for the queue. When this queue is full, the operating system may actively refuse additional connections or those connections may time out. The default value is 100. |
> | `maxConnections` | The maximum number of connections that the server will accept and process at any given time. When this number has been reached, the server will accept, but not process, one further connection. This additional connection be blocked until the number of connections being processed falls below **maxConnections** at which point the server will start accepting and processing new connections again. Note that once the limit has been reached, the operating system may still accept connections based on the `acceptCount` setting. The default value is `8192`.For NIO/NIO2 only, setting the value to -1, will disable the maxConnections feature and connections will not be counted. |
> | `maxThreads` | The maximum number of request processing threads to be created by this **Connector**, which therefore determines the maximum number of simultaneous requests that can be handled. If not specified, this attribute is set to 200. If an executor is associated with this connector, this attribute is ignored as the connector will execute tasks using the executor rather than an internal thread pool. Note that if an executor is configured any value set for this attribute will be recorded correctly but it will be reported (e.g. via JMX) as `-1` to make clear that it is not used. |
>
> [Apache Tomcat 9 Configuration Reference (9.0.76) - The HTTP Connector](https://tomcat.apache.org/tomcat-9.0-doc/config/http.html)

简单来说：

- maxThreads指定同时被处理的请求数
- 超过这个数值，请求会被接受等待处理，直到maxConnections
- 超过这个数值，请求会被接受排队，直到acceptCount

### 日志编码

windows 需要修改 conf/logging.properties

```properties
java.util.logging.ConsoleHandler.level = FINE
java.util.logging.ConsoleHandler.formatter = org.apache.juli.OneLineFormatter
java.util.logging.ConsoleHandler.encoding = GBK
```



### 静态资源大小

```log
资源添加到Web应用程序[]的缓存中，因为在清除过期缓存条目后可用空间仍不足 - 请 考虑增加缓存的最大空间
```

/conf/context.xml `Context`标签中添加

```xml
<Resources cachingAllowed="true" cacheMaxSize="100000" />
```

