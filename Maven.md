# Maven

# 打包包含本地的 jar

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

> [Spring Boot 打包systemPath的jar - tomcat and jerry - 博客园 (cnblogs.com)](https://www.cnblogs.com/tomcatandjerry/p/10197260.html)

