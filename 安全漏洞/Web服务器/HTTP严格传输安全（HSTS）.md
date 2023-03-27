# HTTP 严格传输安全（HSTS）

HTTP严格传输安全（HSTS）告诉浏览器网站只能使用HTTPS访问。检测到Web应用程序未实现 HTTP 严格传输安全（HSTS），因为响应中缺少严格传输安全标头。

### （1）影响

HSTS 可用于阻断或缓解某些类型的中间人 （MitM） 攻击

### Tomcat

在 conf/web.xml `web-app`标签中配置`HttpHeaderSecurity`过滤器

```xml
<filter-mapping>
    <filter-name>httpHeaderSecurity</filter-name>
    <url-pattern>/*</url-pattern>
    <dispatcher>REQUEST</dispatcher>
</filter-mapping>

<filter>
    <filter-name>httpHeaderSecurity</filter-name>
    <filter-class>org.apache.catalina.filters.HttpHeaderSecurityFilter</filter-class>
    <async-supported>true</async-supported>
    <init-param>
        <param-name>antiClickJackingEnabled</param-name>
        <param-value>true</param-value>
    </init-param>
    <init-param>
        <param-name>antiClickJackingOption</param-name>
        <param-value>SAMEORIGIN</param-value>
    </init-param>
    <init-param>
        <param-name>hstsEnabled</param-name>
        <param-value>true</param-value>
    </init-param>
    <init-param>
        <param-name>hstsMaxAgeSeconds</param-name>
        <param-value>31536000</param-value>
    </init-param>
    <init-param>
        <param-name>hstsIncludeSubDomains</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
```

> [PTC 帮助中心](https://support.ptc.com/help/thingworx_hc/thingworx_8_hc/zh_CN/index.html#page/ThingWorx/Help/Composer/Security/enabling_hsts_in_apache_tomcat.html)

> [!NOTE]
>
> 启用此项将必须使用 https

### 验证

响应头中包含`Strict-Transport-Security: max-age=31536000;includeSubDomains`