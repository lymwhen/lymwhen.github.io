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
