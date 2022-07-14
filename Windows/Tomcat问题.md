# Tomcat 问题



# 启动提示增大缓存的最大空间

```log
资源添加到Web应用程序[]的缓存中，因为在清除过期缓存条目后可用空间仍不足 - 请 考虑增加缓存的最大空间
```

/conf/context.xml `Context`标签中添加

```xml
<Resources cachingAllowed="true" cacheMaxSize="100000" />
```

