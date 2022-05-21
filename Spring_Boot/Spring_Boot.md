# Spring Boot

# @ModelAttribute 和 HandlerInterceptor

经测试调用顺序为

1. preHandle
2. @ModelAttribute
3. @RequestMapping
4. postHandle
5. afterCompletion

### 接口访问控制

##### @ModelAttribute

对控制器内所有接口生效（包括子类控制器），如需要对全部控制器生效，可以加上注解`@ControllerAdvice`

    @ModelAttribute
    public void resApiModel(HttpServletResponse response) throws java.lang.Exception {
        // 强制校验合法性
        if(verify() == null) {
            throw new Exception("访问合法性验证失败");
        };
    }

##### HandlerInterceptor

spring.xml

```xml
<mvc:interceptors>
    <mvc:interceptor>
        <mvc:mapping path="/resApi/**"/>
        <bean class="com.chunshu.config.ResApiInterceptor"></bean>
    </mvc:interceptor>
</mvc:interceptors>
```

ResApiInterceptor

```java
package com.chunshu.config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.chunshu.common.result.JsonResult;

@Component
public class ResApiInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse response, Object o) throws Exception {
        if(verify() == false) {
            JsonResult obj = renderError("访问合法性验证失败");
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            response.getWriter().write(JSON.toJSONString(obj));
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) {
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("application/json; charset=utf-8");
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) {
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("application/json; charset=utf-8");
    }
}
```

# 打包

```bash
mvn clean package '-Dmaven.test.skip=true'
```

### 运行 jar

```bash
java -jar stream_server-0.0.1-SNAPSHOT.jar
# 修改application.yml参数
java -jar stream_server-0.0.1-SNAPSHOT.jar --server.port=8086 --hlsdir=C:\Users\LYML\Desktop\nginx-rtmp-win32\html\hls
```



### 包含外部 jar

将 jar 放在 src/libs/ 下

```xml
<!-- 流程引擎 -->
<dependency>
    <groupId>eCoreFlow</groupId>
    <artifactId>eCoreFlow</artifactId>
    <version>1.0</version>
    <scope>system</scope>
    <systemPath>${pom.basedir}/src/libs/eCoreFlow.jar</systemPath>
</dependency>
```

##### jar 包

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <includeSystemScope>true</includeSystemScope>
            </configuration>
        </plugin>
    </plugins>
</build>
```

##### war 包

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <includeSystemScope>true</includeSystemScope>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-war-plugin</artifactId>
            <configuration>
                <webResources>
                    <resource>
                        <directory>src/libs</directory>
                        <targetPath>WEB-INF/lib/</targetPath>
                        <!-- <targetPath>WEB_INF/lib/</targetPath> just for none spring-boot project -->
                        <includes>
                            <include>**/*.jar</include>
                        </includes>
                    </resource>
                </webResources>
            </configuration>
        </plugin>
    </plugins>
</build>
```

> I have a similar issue today, and stuck me half day to fix it.
>
> For most case, using below is fine for developing.
>
> 引入本地 jar 包：
>
> ```xml
> <dependency>
>     <groupId>com.netease</groupId>
>     <artifactId>thrift</artifactId>
>     <version>1.0</version>
>     <scope>system</scope>
>     <systemPath>${project.basedir}/lib/prome-thrift-client-1.0.0.jar</systemPath>
> </dependency>
> ```
>
> If you put the jar to a correct path, then it's fine to run in both **IDEA** and **Eclipse**.
>
> After you deploy the jar to a server or run the jar locally, then it may throws `ClassNotFoundException`.
>
> If you are using spring-boot, you **still need** below plugin:
>
> 使用 IDE 运行正常，但部署到服务器或本地运行 jar 包报`ClassNotFoundException`，如果使用 spring boot，还需要以下插件：
>
> ```xml
> <plugin>
>     <groupId>org.springframework.boot</groupId>
>     <artifactId>spring-boot-maven-plugin</artifactId>
>     <configuration>
>             <includeSystemScope>true</includeSystemScope>
>     </configuration>
> </plugin>
> ```
>
> After run `mvn clean package`, then you can find the jar under `/BOOT_INF/lib`.
>
> Between, if your package is **war**, then you **still need** this plugin:
>
> 如果是 war 包，还需要以下插件：
>
> ```xml
>  <plugin>
>         <groupId>org.apache.maven.plugins</groupId>
>         <artifactId>maven-war-plugin</artifactId>
>         <configuration>
>             <webResources>
>                 <resource>
>                         <directory>lib</directory>
>                         <targetPath>BOOT-INF/lib/</targetPath>
>                         <!-- <targetPath>WEB_INF/lib/</targetPath> just for none spring-boot project -->
>                         <includes>
>                             <include>**/*.jar</include>
>                         </includes>
>                 </resource>
>             </webResources>
>         </configuration>
>  </plugin>
> ```
>
> -----------------Another Way--------------------
>
> You can using this plugin to replace `maven-war-plugin`:
>
> 可以使用这个插件代替`maven-war-plugin`：
>
> ```xml
>  <plugin>  
>       <artifactId>maven-compiler-plugin</artifactId>  
>        <configuration>  
>             <source>1.8</source>  
>             <target>1.8</target>  
>             <compilerArguments>  
>                 <extdirs>${project.basedir}/lib</extdirs>  
>             </compilerArguments>  
>       </configuration>  
> </plugin>  
> ```
>
> And add the resource:
>
> 添加资源：
>
> ```xml
> <resources>  
>     <resource>  
>         <directory>lib</directory>  
>         <targetPath>BOOT-INF/lib/</targetPath>  
>         <includes>  
>             <include>**/*.jar</include>  
>         </includes>  
>     </resource>
>     <resource>
>         <directory>src/main/resources</directory>
>         <targetPath>BOOT-INF/classes/</targetPath>
>     </resource> 
> </resources>
> ```
>
> https://stackoverflow.com/a/50635637

# 其他问题

### idea 打开项目后没有启动选项，手动添加也不行

idea 没有识别到 maven，或者没有加载这个 maven 项目

右侧点击 Maven，可以看到项目列表，如果这里已有，点击左上角的刷新按钮（Reload All Maven Projects）即可；如果没有，点击添加，选择 pom.xml 文件

### Spring Security 登录报 The request was rejected

```
org.springframework.security.web.firewall.RequestRejectedException: The request was rejected because the header value "discount_free_trigger=true; freePromorunningtmr=Fri Jan 02 1970 00:55:18 GMT+0800 (ä¸­å½æ åæ¶é´); username=admin; rememberMe=true; password=ok+3soPi0vNGnTPhu0vlQk6N6GzELdMa/4XBTimQfA5kg0D6AayMGzCRCwRnJcMPx9qq+bSpUckANE6/Thzc8Q==" is not allowed.
	at org.springframework.security.web.firewall.StrictHttpFirewall$StrictFirewalledRequest.validateAllowedHeaderValue(StrictHttpFirewall.java:751)
	at org.springframework.security.web.firewall.StrictHttpFirewall$StrictFirewalledRequest.access$000(StrictHttpFirewall.java:605)
	at org.springframework.security.web.firewall.StrictHttpFirewall$StrictFirewalledRequest$1.nextElement(StrictHttpFirewall.java:655)
	at org.springframework.security.web.firewall.StrictHttpFirewall$StrictFirewalledRequest$1.nextElement(StrictHttpFirewall.java:645)
	at org.springframework.http.server.ServletServerHttpRequest.getHeaders(ServletServerHttpRequest.java:148)
	at org.springframework.web.cors.DefaultCorsProcessor.handleInternal(DefaultCorsProcessor.java:115)
	at org.springframework.web.cors.DefaultCorsProcessor.processRequest(DefaultCorsProcessor.java:95)
	at org.springframework.web.filter.CorsFilter.doFilterInternal(CorsFilter.java:87)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:336)
	at org.springframework.security.web.header.HeaderWriterFilter.doHeadersAfter(HeaderWriterFilter.java:90)
	at org.springframework.security.web.header.HeaderWriterFilter.doFilterInternal(HeaderWriterFilter.java:75)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:336)
	at org.springframework.security.web.context.SecurityContextPersistenceFilter.doFilter(SecurityContextPersistenceFilter.java:110)
	at org.springframework.security.web.context.SecurityContextPersistenceFilter.doFilter(SecurityContextPersistenceFilter.java:80)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:336)
	at org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter.doFilterInternal(WebAsyncManagerIntegrationFilter.java:55)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
	at org.springframework.security.web.FilterChainProxy$VirtualFilterChain.doFilter(FilterChainProxy.java:336)
	at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:211)
	at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:183)
	at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:354)
	at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:267)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)
	at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:117)
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189)
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162)
	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197)
	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97)
	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:541)
	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135)
	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)
	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78)
	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:360)
	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:399)
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:890)
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1743)
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)
	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191)
	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659)
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
	at java.base/java.lang.Thread.run(Thread.java:834)
```

其他项目的 cookie 影响导致，在浏览器地址栏删除 cookie 重试。
