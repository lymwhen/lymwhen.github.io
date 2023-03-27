# XSS

跨站点脚本 （XSS） 是指客户端代码注入攻击，其中攻击者可以在合法网站或 Web 应用程序中执行恶意脚本。当 Web 应用程序在其生成的输出中使用未经验证或未编码的用户输入时，就会发生 XSS。

### （1）影响

攻击者可以使用恶意JavaScript访问与网站应用相关的所有对象，包括访问 cookie 和本地存储，这些对象是用于存储会话的tokens（令牌）。如果攻击者可以获取用户的会话 Cookie，则他们可以模拟该用户。

**通过抓取HTTP报文，将恶意的脚本代码植入进URL中，当正常用户登陆系统后，该恶意代码将会把正常用户的Cookie发送至攻击者，攻击者即可利用正常用户的Cookie信息直接登陆系统，登陆系统后即可上传木马文件最终控制服务器主机。**

此外，JavaScript 可以读取并任意修改显示给用户的页面内容。因此，XSS与一些聪明的社会工程相结合，为攻击者开辟了很多可能性。

**由于XSS攻击的主要攻击手段时非法获取用户Cookie，所以关于防范XSS、保护Cookie的措施均在此纪录。**

# 前台传递的html标签

### 复现

访问

- http://127.0.0.1:8080/?status=1'%22()%26%25%3Cacx%3E%3CScRiPt%20%3E8jPp(9671)%3C/ScRiPt%3E

- http://127.0.0.1:8080?view=1'%22()%26%25%3Cacx%3E%3CScRiPt%20%3EDAGe(9873)%3C/ScRiPt%3E

http响应报文：

```
org.springframework.validation.BeanPropertyBindingResult: 1 errors
Field error in object 'modelAndView' on field 'view': rejected value [1'"()&%<acx><ScRiPt >DAGe(9873)</ScRiPt>];
```

包含`<ScRiPt >DAGe(9873)</ScRiPt>`，说明后台没有处理html标签，存在XSS漏洞。

### 修复

参看ruoyi中XssFilter的处理。

需要过滤`GET`请求的参数，可修改XssFilter中排除url部分：

```java
private boolean handleExcludeURL(HttpServletRequest request, HttpServletResponse response)
{
    String url = request.getServletPath();
    String method = request.getMethod();
    // GET DELETE 不过滤
    //        if (method == null || HttpMethod.GET.matches(method) || HttpMethod.DELETE.matches(method))
    //        {
    //            return true;
    //        }
    return StringUtils.matches(url, excludes);
}
```

# Cookie HttpOnly 标志

当使用 HttpOnly 标志设置 cookie 时，它会指示浏览器 Cookie 只能由服务器访问，而不能由客户端脚本访问。这是会话 Cookie 的重要安全保护。

### （1）影响

Cookie 可以通过客户端脚本访问。

### （2）漏洞利用

Ø https://192.168.3.107:8080/space/signin

Set-Cookie: rememberMe=deleteMe; Path=/; Max-Age=0; Expires=Mon, 13-Mar-2023 02:30:41 GMT; SameSite=lax

### Tomcat

在conf/web.xml `web-app`标签中加入：

```xml
<session-config>
    <session-timeout>30</session-timeout>
    <cookie-config>
        <http-only>true</http-only>
    </cookie-config>
</session-config>
```

> [Secure Tomcat with Set-Cookies Secure Flag (geekflare.com)](https://geekflare.com/secure-cookie-flag-in-tomcat/)

### 验证

登录后响应头的`Set-Cookie`中包含`HttpOnly`

# Cookie Secure 标志

多个 Cookie 未设置安全标志。当 Cookie 设置有安全标志时，它会指示浏览器只能通过安全的 SSL/TLS 通道访问 Cookie。这是会话 Cookie 的重要安全保护。

### （1）影响

Cookie 可以通过未加密的通道发送。

### （2）漏洞修复

应该为这些 Cookie 设置安全标志。

### Tomcat

在conf/web.xml `web-app`标签中加入：

```xml
<session-config>
    <session-timeout>30</session-timeout>
    <cookie-config>
        <secure>true</secure>
    </cookie-config>
</session-config>
```

> [Secure Tomcat with Set-Cookies Secure Flag (geekflare.com)](https://geekflare.com/secure-cookie-flag-in-tomcat/)

另一说在 conf/server `Connector`中设置`secure="true"`

使用 shiro 框架时，以上配置无效，需要在 shiro session 管理器中配置：

```java
@Bean
public SessionManager sessionManager(EnterpriseCacheSessionDAO sessionDAO){
    DefaultWebSessionManager webSessionManager = new DefaultWebSessionManager();
    webSessionManager.setGlobalSessionTimeout(3600000);
    webSessionManager.setSessionDAO(sessionDAO);
    webSessionManager.setSessionIdUrlRewritingEnabled(false);
    webSessionManager.getSessionIdCookie().setSecure(true);
    return webSessionManager;
}
```

> [!NOTE]
>
> 启用此项将必须使用 https

### 验证

登录后响应头的`Set-Cookie`中包含`Secure`