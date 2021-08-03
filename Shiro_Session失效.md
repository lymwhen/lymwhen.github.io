# Shiro Session 失效时间

shiro

# Shiro sessionManager globalSessionTimeout

```xml
<bean id="sessionManager" class="org.apache.shiro.web.session.mgt.DefaultWebSessionManager">
    <!-- 全局会话超时时间（单位毫秒），默认30分钟 -->
    <property name="globalSessionTimeout" value="3600000" />
    <!-- 删除失效的session -->
    <property name="deleteInvalidSessions" value="true"/>
    <property name="sessionDAO" ref="sessionDAO"/>
</bean>
```

注意要在 securityManager 中配置 sessionManager

```xml
<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
	<property name="cacheManager" ref="shiroCacheManager" />
	<property name="realm" ref="myRealm" />
	<property name="sessionManager" ref="sessionManager"></property>
</bean>
```

> 经测试，web.xml 中配置无效，
>
> ```xml
> <session-config>
>     <session-timeout>30</session-timeout>
> </session-config>
> ```

# Ehcache 配置

ehcache 配置不当会导致 session 被 ehcache 删除

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="ehcache.xsd"
         updateCheck="false" monitoring="autodetect"
         dynamicConfig="true" >
         
    <diskStore path="java.io.tmpdir/ehcache"/>

    <defaultCache
		maxEntriesLocalHeap="0"
		eternal="true"
		timeToIdleSeconds="0"
		timeToLiveSeconds="0"
		overflowToDisk="true"
		diskPersistent="true"
    />
</ehcache>
```

