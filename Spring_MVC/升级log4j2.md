# 升级 log4j2

> ### Commons Logging
> 
> Commons Logging 也就是JCL，提供的是一个日志接口(Interface)，自身提供一个简单的日志文件系统，但一般和其他日志系统组合使用。如：Commons-Logging + Log4j组合使用。
> 它会通过动态查找机制，在程序运行时自动找出真正使用的日志库。
> 
> ### Slf4j
> 
> Slf4j 即Simple Logging Facade for Java，和Commons-Logging类似，也是对不同日志框架提供的一个门面封装，可以在部署的时候可以通过桥接包接入其他日志方案来组合使用。
> 它支持多个参数并通过"{ }"占位符来进行替换。
> 
> ### Log4j
> 
> Log4j 即Log for Java ，经典的一种日志解决方案。内部把日志系统抽象封装成Logger 、appender 、pattern 等实现。我们可以通过配置文件轻松的实现日志系统的管理和多样化配置。
> Log4j 系统的三大板块：日志写入器Logger、日志输出终端Appender、日志布局模式Layout。其中Appender常用的有ConsoleAppender（输出到控制台）、FileAppender（输出文件）和RollingFileAppender（输出滚动文件）三种。
> 在classpath下编写配置文件log4j.properties，配置相关日志属性和格式。
> 
> ### Log4j2
> 
> Log4j2 是在Log4j 1.x版本基础上的一个升级版本。性能得到提升的同时，还能够自动装载配置文件，支持参数变量的占位符功能，可以专门指定事件进行过滤，并且支持插件式架构。
> 
> ### Logback
> 
> Logback是由log4j创始人涉及的又一个开源的日志组件，logback当前分成三个模块：logback-core,logback- classic和logback-access。logback-core是其它两个模块的基础模块。logback-classic是log4j的一个 改良版本。此外logback-classic完整实现Slf4j API，使我们可以很方便地更换成其它日志系统，如：log4j或JDK。logback-access访问模块与Servlet容器集成提供通过Http来访问日志的功能。
> 
> 作者：吴赵笔记
> 链接：https://www.jianshu.com/p/191273d04d2d
> 来源：简书
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

> [Migrating from Log4j 1.x to 2.x](https://logging.apache.org/log4j/2.x/manual/migration.html)

根据官方文档，有两种方式升级log4j2

1. 使用 log4j 1.x 桥（log4j-1.2-api），有以下限制

> 1. They must not access methods and classes internal to the Log4j 1.x implementation such as Appenders, LoggerRepository or Category’s callAppenders method.
>
> 2. They must not programmatically configure Log4j.
>
> 3. They must not configure by calling the Log4j 1.x classes DOMConfigurator or PropertyConfigurator.

2. 将应用转换为 log4j 2 API

由于继承 log4j level 实现自定义日志级别，所以采用方式2

# 删除原log4j包

删除原log4j包和配置文件

# jar

- log4j-api-2.17.1.jar

- log4j-core-2.17.1.jar

项目使用了 Commons Logging，还需

- jcl-over-slf4j-1.7.35.jar

项目使用了 slf4j，还需

- slf4j-api-1.7.35.jar

- log4j-slf4j-impl-2.17.1.jar

# 配置文件

> [Configuration](https://logging.apache.org/log4j/2.x/manual/configuration.html)

> [!NOTE]
> 配置文件应放在 classpath 下，即 resource 目录，在 web.xml 配置`log4jConfigLocation`无效

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/2002/xmlspec/dtd/2.10/xmlspec.dtd">
 
<!-- status : 这个用于设置log4j2自身内部的信息输出,可以不设置,当设置成trace时,会看到log4j2内部各种详细输出 monitorInterval 
    : Log4j能够自动检测修改配置文件和重新配置本身, 设置间隔秒数。 注：本配置文件的目标是将不同级别的日志输出到不同文件，最大2MB一个文件， 
    文件数据达到最大值时，旧数据会被压缩并放进指定文件夹 -->
<Configuration status="WARN" monitorInterval="600">

	<CustomLevels>
		<!--注意 ： intLevel 值越小，级别越高 （log4j2 官方文档）-->
		<CustomLevel name="IMPORT_INFO" intLevel="350" />
		<CustomLevel name="IMPORT_ERROR" intLevel="150" />
	</CustomLevels>
 
    <Appenders>
 
        <!-- 优先级从高到低分别是 OFF、FATAL、ERROR、WARN、INFO、DEBUG、ALL -->
        <!-- 单词解释： Match：匹配 DENY：拒绝 Mismatch：不匹配 ACCEPT：接受 -->
        <!-- DENY，日志将立即被抛弃不再经过其他过滤器； NEUTRAL，有序列表里的下个过滤器过接着处理日志； ACCEPT，日志会被立即处理，不再经过剩余过滤器。 -->
        <!--输出日志的格式
         %d{yyyy-MM-dd HH:mm:ss, SSS} : 日志生产时间
         %p : 日志输出格式
         %c : logger的名称 
         %m : 日志内容，即 logger.info("message") 
         %n : 换行符 
         %C : Java类名
         %L : 日志输出所在行数 
         %M : 日志输出所在方法名 
         hostName : 本地机器名 
         hostAddress : 本地ip地址 -->
 
        <!--这个输出控制台的配置，这里输出除了warn和error级别的信息到System.out -->
        <Console name="console_out_appender" target="SYSTEM_OUT">
            <!-- 控制台只输出level及以上级别的信息(onMatch),其他的直接拒绝(onMismatch) . -->
            <ThresholdFilter level="DEBUG" onMatch="ACCEPT"
                onMismatch="DENY" />
            <!-- 输出日志的格式 -->
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} %5p [%t] %F:%L %m%n" />
        </Console>
        <!-- 这个输出控制台的配置，这里输出error级别的信息到System.err，在eclipse控制台上看到的是红色文字 -->
        <Console name="console_err_appender" target="SYSTEM_ERR">
            <ThresholdFilter level="ERROR" onMatch="ACCEPT"
                onMismatch="DENY" />
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} %5p [%t] %F:%L %m%n" />
        </Console>
 
        <!-- IMPORT_INFO级别日志 -->
        <RollingFile name="import_info_appender" immediateFlush="true"
            fileName="${sys:catalina.home}/logs/import_info.log" filePattern="${sys:catalina.home}/logs/info/import_info - %d{yyyy-MM-dd HH_mm_ss}.log.gz">
            <PatternLayout>
                <pattern>%d{yyyy-MM-dd HH:mm:ss} %5p [%t] %F:%L %m%n</pattern>
            </PatternLayout>
            <Policies>
                <SizeBasedTriggeringPolicy size="2MB" />
            </Policies>
            <Filters>
                <ThresholdFilter level="WARN" onMatch="DENY"
                    onMismatch="NEUTRAL" />
                <ThresholdFilter level="IMPORT_INFO" onMatch="ACCEPT"
                    onMismatch="DENY" />
            </Filters>
        </RollingFile>
 
        <!-- IMPORT_INFO级别日志 -->
        <RollingFile name="import_error_appender" immediateFlush="true"
            fileName="${sys:catalina.home}/logs/import_error.log" filePattern="${sys:catalina.home}/logs/info/import_error - %d{yyyy-MM-dd HH_mm_ss}.log.gz">
            <PatternLayout>
                <pattern>%d{yyyy-MM-dd HH:mm:ss} %5p [%t] %F:%L %m%n</pattern>
            </PatternLayout>
            <Policies>
                <SizeBasedTriggeringPolicy size="2MB" />
            </Policies>
            <Filters>
                <ThresholdFilter level="FATAL" onMatch="DENY"
                    onMismatch="NEUTRAL" />
                <ThresholdFilter level="IMPORT_ERROR" onMatch="ACCEPT"
                    onMismatch="DENY" />
            </Filters>
        </RollingFile>
 
        <!-- INFO级别日志 -->
        <RollingFile name="info_appender" immediateFlush="true"
            fileName="${sys:catalina.home}/logs/info.log" filePattern="${sys:catalina.home}/logs/info/info - %d{yyyy-MM-dd HH_mm_ss}.log.gz">
            <PatternLayout>
                <pattern>%d{yyyy-MM-dd HH:mm:ss} %5p [%t] %F:%L %m%n</pattern>
            </PatternLayout>
            <Policies>
                <SizeBasedTriggeringPolicy size="2MB" />
            </Policies>
            <Filters>
                <ThresholdFilter level="warn" onMatch="DENY"
                    onMismatch="NEUTRAL" />
                <ThresholdFilter level="info" onMatch="ACCEPT"
                    onMismatch="DENY" />
            </Filters>
        </RollingFile>
 
        <!-- WARN级别日志 -->
        <RollingFile name="warn_appender" immediateFlush="true"
            fileName="${sys:catalina.home}/logs/warn.log" filePattern="${sys:catalina.home}/logs/warn/warn - %d{yyyy-MM-dd HH_mm_ss}.log.gz">
            <PatternLayout>
                <pattern>%d{yyyy-MM-dd HH:mm:ss} %5p [%t] %F:%L %m%n</pattern>
            </PatternLayout>
            <Policies>
                <SizeBasedTriggeringPolicy size="2MB" />
            </Policies>
            <Filters>
                <ThresholdFilter level="error" onMatch="DENY"
                    onMismatch="NEUTRAL" />
                <ThresholdFilter level="warn" onMatch="ACCEPT"
                    onMismatch="DENY" />
            </Filters>
        </RollingFile>
 
        <!-- ERROR级别日志 -->
        <RollingFile name="error_appender" immediateFlush="true"
            fileName="${sys:catalina.home}/logs/error.log" filePattern="${sys:catalina.home}/logs/error/error - %d{yyyy-MM-dd HH_mm_ss}.log.gz">
            <PatternLayout>
                <pattern>%d{yyyy-MM-dd HH:mm:ss} %5p [%t] %F:%L %m%n</pattern>
            </PatternLayout>
            <Policies>
                <SizeBasedTriggeringPolicy size="2MB" />
            </Policies>
            <Filters>
                <ThresholdFilter level="error" onMatch="ACCEPT"
                    onMismatch="DENY" />
            </Filters>
        </RollingFile>
    </Appenders>
 
    <Loggers>
        <!-- 配置日志的根节点 -->
        <!-- 定义logger，只有定义了logger并引入了appender，appender才会生效 -->
        <root level="info">
            <appender-ref ref="console_out_appender" />
            <appender-ref ref="console_err_appender" />
            <appender-ref ref="import_info_appender" />
            <appender-ref ref="import_error_appender" />
            <appender-ref ref="info_appender" />
            <appender-ref ref="warn_appender" />
            <appender-ref ref="error_appender" />
        </root>
 
        <!-- 第三方日志系统 -->
        <logger name="org.springframework.core" level="info" />
        <logger name="org.springframework.beans" level="info" />
        <logger name="org.springframework.context" level="info" />
        <logger name="org.springframework.web" level="info" />
        <logger name="org.jboss.netty" level="warn" />
        <logger name="org.apache.http" level="warn" />
 
    </Loggers>
 
</Configuration>
```

# 自定义日志级别

> [log4j2自定义日志级别](https://blog.csdn.net/xulele_csdn/article/details/85269929)

```xml
<CustomLevels>
    <!--注意 ： intLevel 值越小，级别越高 （log4j2 官方文档）-->
    <CustomLevel name="IMPORT_INFO" intLevel="350" />
    <CustomLevel name="IMPORT_ERROR" intLevel="150" />
</CustomLevels>
```

> [!NOTE]
> 数值应根据类型结合官方文档设置，[Custom Log Levels](https://logging.apache.org/log4j/2.x/manual/customloglevels.html)
>
> Standard log levels built-in to Log4J
>
> |Standard Level	|intLevel|
> | ---- | ---- |
> |OFF	|0|
> |FATAL	|100|
> |ERROR	|200|
> |WARN	|300|
> |INFO	|400|
> |DEBUG	|500|
> |TRACE	|600|
> |ALL	|Integer.MAX_VALUE|

### RollingFile 保存指定级别的日志

```xml
<Filters>
    <ThresholdFilter level="WARN" onMatch="DENY"
        onMismatch="NEUTRAL" />
    <ThresholdFilter level="IMPORT_INFO" onMatch="ACCEPT"
        onMismatch="DENY" />
</Filters>
```

根据级别的数值，`IMPORT_INFO`在`WARN`下方，仅保存`IMPORT_INFO`级别的日志：

- `WARN`及以上的拒绝，否则由后续过滤器决定
- `IMPORT_INFO`及以上的接收，否则拒绝

# 问题

```
java.lang.NoClassDefFoundError: org/apache/log4j/xml/DOMConfigurator
    at org.springframework.util.Log4jConfigurer.initLogging(Log4jConfigurer.java:69)
```

删除 web.xml 的`Log4jConfigListener `

> i got it!
>
> Problem is: org.springframework.web.util.Log4jConfigListener This is deprecated from Spring Framework 4.2.1. Only delete this listener!
>
> https://stackoverflow.com/questions/36683852/log4j-error-noclassdeffounderror-org-apache-log4j-xml-domconfigurator