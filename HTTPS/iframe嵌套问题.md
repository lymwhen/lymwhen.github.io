# iframe 嵌套问题

chrome 80 以后，同源策略更加严格：

>  `SameSite` 接受下面三个值：
>
> ### [`Lax`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax)
>
> Cookies允许与顶级导航一起发送，并将与第三方网站发起的GET请求一起发送。这是浏览器中的默认值。
>
> ### [`Strict`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite#strict)
>
> Cookies只会在第一方上下文中发送，不会与第三方网站发起的请求一起发送。
>
> ### [`None`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite#none)
>
> Cookie将在所有上下文中发送，即允许跨域发送。
>
> 以前 `None` 是默认值，但最近的浏览器版本将 `Lax` 作为默认值，以便对某些类型的跨站请求伪造 （[CSRF](https://developer.mozilla.org/zh-CN/docs/Glossary/CSRF)） 攻击具有相当强的防御能力。
>
> 
>
> ### [`SameSite=None` 需要 `Secure`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite#samesitenone_需要_secure)
>
> 如果没有设置 `Secure` 属性，控制台中可能会出现以下警告：
>
> > Some cookies are misusing the “sameSite“ attribute, so it won’t work as expected.
> > Cookie “*myCookie*” rejected because it has the “sameSite=none” attribute but is missing the “secure” attribute.
>
> 出现此警告是因为需要 `SameSite=None` 但未标记 `Secure` 的任何cookie都将被拒绝。
>
> ```
> Set-Cookie: flavor=choco; SameSite=None
> ```
>
> 要解决此问题，必须将 `Secure` 属性添加到 `SameSite=None` cookies中。
>
> ```
> Set-Cookie: flavor=choco; SameSite=None; Secure
> ```
>
> [`Secure`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie) cookie仅通过HTTPS协议加密发送到服务器。请注意，不安全站点（`http:`）无法使用 `Secure` 指令设置cookies。
>
> [SameSite cookies - HTTP | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

综上，使用 http 的 iframe 嵌套的问题是被嵌入网页的 session 丢失，原因：

- response `Set-Cookie`中没有定义`SameSite`，则默认为`SameSite=Lax`
- 后台设置 response `Set-Cookie` `SameSite=None`，浏览器要求设置`Secure`
- 后台设置`Secure=false`，浏览器要求使用 https 传输

网上查到的解决办法：

> [[FE\] Chrome 跨域请求失败：This Set-Cookie didn't specify a "SameSite" attribute, was defaulted to "SameS... - 简书 (jianshu.com)](https://www.jianshu.com/p/314691f6f4df)
>
> [Springboot应用中设置Cookie的SameSite属性 - SpringBoot中文社区 - 博客园 (cnblogs.com)](https://www.cnblogs.com/kevinblandy/p/13589864.html)
>
> [使用spring-session时，动态修改cookie的max-age - 技术交流 - Spring Boot中文社区](https://springboot.io/t/topic/911)

老系统无法实现教程中的方法，可以简单粗暴的使用字符串设置 cookie：

```java
httpServletResponse.setHeader("Set-Cookie", httpServletResponse.getHeader("Set-Cookie") + "; SameSite=None; Secure=false");
```

实测且对照几点原因，这些方法对于**依然要使用 http 的情况**是无效的。

实测解决办法：

- 使用 https
- 使用 window.open 打开
- 在 top 页面的服务器使用 nginx 转发被嵌入页面的服务，实测同域就没有问题了

请求转发可能是**依然要使用 http 的情况**的唯一选择。

### 转发配置

nginx

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # sendfile        on;
    # keepalive_timeout  65;

    server {
        listen       8021;
        server_name  mywebsite.com;

        location / {
            proxy_pass http://xxx.vaiwan.cn/;
        }
    }
}
```

iframe

```html
<iframe style="width: 1280px; height: 720px;" src=" http://192.168.3.105:8021/doc/docIndex"></iframe>
```

> [!NOTE]
>
> 注意这里的 iframe 要跟外部访问的 ip 一致