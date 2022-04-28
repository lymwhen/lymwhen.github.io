# logback

```java
@SpringBootTest
@Slf4j
class ResourcesTest1 {

	@Autowired
	FfmpegProperties ffmpegProperties;

	@Test
	void contextLoads() {
		log.info("String: {}, int: {}, long: {}, float: {}, double: {}, boolean: {}, date: {}", "一", 2, 3L, 4.75f, 4.75, true, new Date());
	}
}
```

# 配置

> [springboot使用Logback把日志输出到控制台或输出到文件_java_脚本之家 (jb51.net)](https://www.jb51.net/article/197386.htm)

logback-spring.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>

<configuration scan="false" scanPeriod="10 seconds">
    <!-- 日志级别从低到高分为TRACE < DEBUG < INFO < WARN < ERROR < FATAL，如果设置为WARN，则低于WARN的信息都不会输出 -->
    <!-- scan:当此属性设置为true时，配置文件如果发生改变，将会被重新加载，默认值为true -->
    <!-- scanPeriod:设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当scan为true时，此属性生效。默认的时间间隔为1分钟。 -->
    <!-- debug:当此属性设置为true时，将打印出logback内部日志信息，实时查看logback运行状态。默认值为false。 -->
    <contextName>logback</contextName>
    <!-- name的值是变量的名称，value的值时变量定义的值。通过定义的值会被插入到logger上下文中。定义变量后，可以使“${}”来使用变量。 -->
    <property name="log.path" value="D:/logs" />
    <!-- 彩色日志 -->
    <!-- 配置格式变量：CONSOLE_LOG_PATTERN 彩色日志格式 -->
    <!-- magenta:洋红 -->
    <!-- boldMagenta:粗红-->
    <!-- cyan:青色 -->
    <!-- white:白色 -->
    <!-- magenta:洋红 -->
    <!--输出到控制台-->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <!--此日志appender是为开发使用，只配置最底级别，控制台输出的日志级别是大于或等于此级别的日志信息-->
        <!-- 例如：如果此处配置了INFO级别，则后面其他位置即使配置了DEBUG级别的日志，也不会被输出 -->
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>INFO</level>
        </filter>
        <encoder>
            <Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %magenta(%5p) %magenta(${PID:- }) --- [%15.15t] %cyan(%-40.40logger{39}) : %m%n</Pattern>
            <!-- 设置字符集 -->
            <charset>UTF-8</charset>
        </encoder>
    </appender>
    <!--输出到文件-->
    <appender name="DEBUG_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}:%line - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/%d{yyyy-MM-dd}/log-debug.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>15</maxHistory>
        </rollingPolicy>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>DEBUG</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>
    <!-- 时间滚动输出 level为 INFO 日志 -->
    <appender name="INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 正在记录的日志文件的路径及文件名，设置此值之后，rollingPolicy.fileNamePattern中设置的路径将无效 -->
        <!-- <file>${log.path}/log_info.log</file> -->
        <!--日志文件输出格式-->
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}:%line - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <!-- 日志记录器的滚动策略，按日期，按大小记录 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 每天日志归档路径以及格式 -->
            <fileNamePattern>${log.path}/%d{yyyy-MM-dd}/log-info.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <!--日志文件保留天数-->
            <maxHistory>15</maxHistory>
        </rollingPolicy>
        <!-- 此日志文件只记录info级别的 -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>INFO</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>
    <appender name="WARN_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}:%line - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/%d{yyyy-MM-dd}/log-warn.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>15</maxHistory>
        </rollingPolicy>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>warn</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}:%line - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log.path}/%d{yyyy-MM-dd}/log-error.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>100MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>15</maxHistory>
        </rollingPolicy>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>
    <!--
      <logger>用来设置某一个包或者具体的某一个类的日志打印级别、以及指定<appender>。
      <logger>仅有一个name属性，
      一个可选的level和一个可选的addtivity属性。
      name:用来指定受此logger约束的某一个包或者具体的某一个类。
      level:用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，
         如果未设置此属性，那么当前logger将会继承上级的级别。
    -->
    <!--
      使用mybatis的时候，sql语句是debug下才会打印，而这里我们只配置了info，所以想要查看sql语句的话，有以下两种操作：
      第一种把<root level="INFO">改成<root level="DEBUG">这样就会打印sql，不过这样日志那边会出现很多其他消息
      第二种就是单独给mapper下目录配置DEBUG模式，代码如下，这样配置sql语句会打印，其他还是正常DEBUG级别：
     -->
    <!--开发环境-->
    <springProfile name="dev">
        <!--可以输出项目中的debug日志，包括mybatis的sql日志-->
        <!-- <logger name="com.chunshu.signup.mapper" level="DEBUG" /> -->
        <!--
          root节点是必选节点，用来指定最基础的日志输出级别，只有一个level属性
          level:用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，默认是DEBUG
          可以包含零个或多个appender元素。
        -->
        <root level="DEBUG">
            <appender-ref ref="CONSOLE" />
             <appender-ref ref="DEBUG_FILE" />
            <appender-ref ref="INFO_FILE" />
            <appender-ref ref="WARN_FILE" />
            <appender-ref ref="ERROR_FILE" />
        </root>
    </springProfile>
    <!--生产环境-->
    <springProfile name="pro">
        <root level="DEBUG">
            <appender-ref ref="CONSOLE" />
            <appender-ref ref="DEBUG_FILE" />
            <appender-ref ref="INFO_FILE" />
            <appender-ref ref="WARN_FILE" />
            <appender-ref ref="ERROR_FILE" />
        </root>
    </springProfile>
</configuration>
```

> [!TIP]
>
> root 节点日志级别为 DEBUG，控制台日志级别为 INFO，即可实现保存 DEBUG 级别日志，但控制台打印 INFO 级别日志

### 日志存放位置

`log.path`属性可配置日志存放位置，支持绝对路径和相对路径

```
<property name="log.path" value="D:/logs" />
```

经测试，war + tomcat 部署时，linux 下当前路径为`tomcat`目录，windows 下当前目录为`tomcat/bin`目录。如需将配置文件保存在`tomcat/logs`，应使用配置：

```xml
<!--linux-->
<property name="log.path" value="logs" />
<!--windows-->
<property name="log.path" value="../logs" />
```



# 区分开发与生产环境

application.yml

```yml
spring:
  profiles:
   	active:dev
```

logback-spring.xml

```xml
<springProfile name="dev">
    <!--可以输出项目中的debug日志，包括mybatis的sql日志-->
    <logger name="com.chunshu.ydxy.mapper" level="DEBUG" />
    <!--
      root节点是必选节点，用来指定最基础的日志输出级别，只有一个level属性
      level:用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，默认是DEBUG
      可以包含零个或多个appender元素。
    -->
    <root level="INFO">
        <appender-ref ref="CONSOLE" />
        <!-- <appender-ref ref="DEBUG_FILE" /> -->
        <appender-ref ref="INFO_FILE" />
        <appender-ref ref="WARN_FILE" />
        <appender-ref ref="ERROR_FILE" />
    </root>
</springProfile>
<!--生产环境-->
<springProfile name="pro">
    <root level="INFO">
        <appender-ref ref="CONSOLE" />
        <!-- <appender-ref ref="DEBUG_FILE" /> -->
        <appender-ref ref="INFO_FILE" />
        <appender-ref ref="WARN_FILE" />
        <appender-ref ref="ERROR_FILE" />
    </root>
</springProfile>
```

### 不区分

```xml
<root level="INFO">
    <appender-ref ref="CONSOLE" />
    <!-- <appender-ref ref="DEBUG_FILE" /> -->
    <appender-ref ref="INFO_FILE" />
    <appender-ref ref="WARN_FILE" />
    <appender-ref ref="ERROR_FILE" />
</root>
```



# 控制台彩色输出

> spring-boot-2.6.2.jar\org\springframework\boot\logging\logback\default.xml
>
> ```xml
> <?xml version="1.0" encoding="UTF-8"?>
> 
> <!--
> Default logback configuration provided for import
> -->
> 
> <included>
> 	<conversionRule conversionWord="clr" converterClass="org.springframework.boot.logging.logback.ColorConverter" />
> 	<conversionRule conversionWord="wex" converterClass="org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter" />
> 	<conversionRule conversionWord="wEx" converterClass="org.springframework.boot.logging.logback.ExtendedWhitespaceThrowableProxyConverter" />
> 
> 	<property name="CONSOLE_LOG_PATTERN" value="${CONSOLE_LOG_PATTERN:-%clr(%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd HH:mm:ss.SSS}}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>
> 	<property name="CONSOLE_LOG_CHARSET" value="${CONSOLE_LOG_CHARSET:-${file.encoding:-UTF-8}}"/>
> 	<property name="FILE_LOG_PATTERN" value="${FILE_LOG_PATTERN:-%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd HH:mm:ss.SSS}} ${LOG_LEVEL_PATTERN:-%5p} ${PID:- } --- [%t] %-40.40logger{39} : %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>
> 	<property name="FILE_LOG_CHARSET" value="${FILE_LOG_CHARSET:-${file.encoding:-UTF-8}}"/>
> 
> 	<logger name="org.apache.catalina.startup.DigesterFactory" level="ERROR"/>
> 	<logger name="org.apache.catalina.util.LifecycleBase" level="ERROR"/>
> 	<logger name="org.apache.coyote.http11.Http11NioProtocol" level="WARN"/>
> 	<logger name="org.apache.sshd.common.util.SecurityUtils" level="WARN"/>
> 	<logger name="org.apache.tomcat.util.net.NioSelectorPool" level="WARN"/>
> 	<logger name="org.eclipse.jetty.util.component.AbstractLifeCycle" level="ERROR"/>
> 	<logger name="org.hibernate.validator.internal.util.Version" level="WARN"/>
> 	<logger name="org.springframework.boot.actuate.endpoint.jmx" level="WARN"/>
> </included>
> 
> ```

spring boot 默认输出格式：

```bash
%d{yyyy-MM-dd HH:mm:ss.SSS} %magenta(%5p) %magenta(${PID:- }) --- [%15.15t] %cyan(%-40.40logger{39}) : %m%n
```

使用**%line**可以输出行号
使用**%file**可以输出文件名称
使用**%logger**可以输出在获取Logger对象时指定的Class对象的全限定名称

> [Logback输出行号 - 简书 (jianshu.com)](https://www.jianshu.com/p/edd48b70a017)

# 打印 sql

### 没使用 logback

```yml
logging:
  level:
    '[com.chunshu.ydxy.mapper]': debug
```

### 使用 logback

`org.apache.ibatis.logging.stdout.StdOutImpl`实现与日志级别无关，只打印到控制台

```yml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

或

```yml
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### 输出到 debug 日志文件

logback-spring.xml

```xml
<!--可以输出项目中的debug日志，包括mybatis的sql日志-->
<logger name="com.chunshu.ydxy.mapper" level="DEBUG" />
<!--
      root节点是必选节点，用来指定最基础的日志输出级别，只有一个level属性
      level:用来设置打印级别，大小写无关：TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，默认是DEBUG
      可以包含零个或多个appender元素。
    -->
<root level="INFO">
    <appender-ref ref="CONSOLE" />
    <!-- <appender-ref ref="DEBUG_FILE" /> -->
    <appender-ref ref="INFO_FILE" />
    <appender-ref ref="WARN_FILE" />
    <appender-ref ref="ERROR_FILE" />
</root>
```

application.yml

```yml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
```

或

```yml
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl
```

# @Slf4j

IDE 下载 lombok 插件

pom.xml

```xml
<!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.22</version>
    <scope>provided</scope>
</dependency>
```

```java
package com.chunshu.ydxy;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@Slf4j
class LogbackTest1 {

	@Test
	void contextLoads() {
		log.info("test");
		log.info("test1", new Exception("blank exception"));
		log.error("test1", new Exception("blank exception"));
	}
}
```

# 屏蔽 log4j

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
        </exclusion>
        <exclusion>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-to-slf4j</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```



# 疑难问题

### 与 junit 冲突

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>com.vaadin.external.google</groupId>
            <artifactId>android-json</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### log4j:WARN No appenders could be found for logger (com.alibaba.druid.pool.DruidDataSource).

```
log4j:WARN No appenders could be found for logger (com.alibaba.druid.pool.DruidDataSource).
log4j:WARN Please initialize the log4j system properly.
```

配置 mybatis-plus

```yml
spring:
  datasource:
    dynamic:
      druid:
        filters: stat,wall,slf4j
```

> 须升级 druid 到`1.2.8`

### log4j:WARN No appenders could be found for logger (freemarker.cache)

```
log4j:WARN No appenders could be found for logger (freemarker.cache)
log4j:WARN Please initialize the log4j system properly.
```

> 简而言之，在现代(比如2015年)的应用程序中， 记录日志推荐使用SLF4J API。 要让 FreeMarker 2.3.x. 使用SLF4J，在项目中加入依赖 `org.slf4j:log4j-over-slf4j` 即可， 要确保 `log4j:log4j` 不能存在。(从 FreeMarker 2.4.x 开始，尽管没有什么害处， 但也不再需要 `log4j-over-slf4j` 了。)
>
> 如果你对这些细节好奇，或者不能使用SLF4J，那么就继续阅读吧...
>
> FreeMarker 整合了如下的日志包：[SLF4J](http://www.slf4j.org/)，[Apache Commons Logging](http://commons.apache.org/logging/)，[Log4J](http://jakarta.apache.org/log4j) 1.x，[Avalon LogKit](http://jakarta.apache.org/avalon/logkit) 和 [`java.util.logging`](http://java.sun.com/j2se/1.4/docs/api/java/util/logging/package-summary.html)。默认情况下， FreeMarker(在2.3.x版本下)会按如下顺序来查找日志包， 而且会自动使用第一个发现的包： LOG4J(从2.3.22开始，如果正确安装了`log4j-over-slf4j`，则会使用SLF4J来代替)， Apache Avalon LogKit, `java.util.logging`。 正如你所见，Log4j有最高的优先级。`org.apache.log4j.Logger` 类会检测Log4j的存在，那么也就是说，像`log4j-over-slf4j` 或 `log4j-1.2-api`，Log4j重定向也会有最高优先级。
>
> 在 FreeMarker 2.4 版本之前，因为向后兼容性的限制， SLF4J和Apache Commons Logging不会被自动搜索。但是如果你正确安装了 `org.slf4j:log4j-over-slf4j`(也就意味着， 在类路径下没有真实的Log4j，SLF4J有一个像 `logback-classic` 的支持实现)，那么FreeMarker会直接使用SLF4J API来代替Log4j API (从FreeMarker 2.3.22版本开始)。
>
> 请注意，应用Log4j2日志有个相似的技巧：如果 `org.apache.logging.log4j:log4j-1.2-api` 可用， FreeMarker 2.3.x会使用它，因为它看起来就像Log4j， 但是所有的消息都会自动到Log4j2中。
>
> 如果自动检测没有给出你想要的结果，那么你可以设置系统属性 `org.freemarker.loggerLibrary` 来明确选择 (从2.3.22版本开始)一个日志库，比如：
>
> ```
> java ... -Dorg.freemarker.loggerLibrary=SLF4J
> ```
>
> 系统属性支持的值有： `SLF4J`， `CommonsLogging`， `JUL` (即 `java.util.logging`)， `Avalon`， `auto` (默认行为)， `none` (关闭日志)。
>
> 请注意，为了可靠的运行，系统属性应该在JVM启动时(向上面那样)就该设置好， 而不是在Java代码之后。
>
> 推荐使用SLF4J，因为它在 FreeMarker 中运行的更好， 也是因为从 FreeMarker 2.4 版本开始它有自动检测的最高优先级。
>
> [日志 - FreeMarker 中文官方参考手册 (foofun.cn)](http://freemarker.foofun.cn/pgui_misc_logging.html)

简言之，就是 2.4 版本之前不支持自动选择日志，可以设置 jvm 参数制定日志库

##### 代码设置方法

> [手动设置freemarker的日志框架_Dug_Zhang的博客-CSDN博客_freemarker 日志](https://blog.csdn.net/Dug_Zhang/article/details/103824986)

```java
package com.chunshu.ydxy.config;

import javax.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import freemarker.log.Logger;

@Configuration
public class FreemarkerConfig {

    @PostConstruct
    public void init(){
        try {
            Logger.selectLoggerLibrary(Logger.LIBRARY_SLF4J);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

> Logger.selectLoggerLibrary 方法已经过时，等待 freemarker 升级了

### WAR 方式部署到 tomcat 日志不打印

```java
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
public class ServletInitializer extends SpringBootServletInitializer {
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(AdsbAcquireApplication.class);
	}
}
```

有博客说要添加 pom.xml，实测不需要

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>
</dependency>

<dependency>
    <groupId>javax.servlet.jsp</groupId>
    <artifactId>javax.servlet.jsp-api</artifactId>
    <version>2.3.3</version>
</dependency>
```

> [三分钟把spring boot打成war包部署到tomcat中 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903839477301261)
