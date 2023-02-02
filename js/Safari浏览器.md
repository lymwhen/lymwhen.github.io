# Safari 浏览器

在做照片墙 html 页面时，发现，windows、android浏览器、android微信打开正常，但在 iphone 12/13 safari 上打开提示`https://xxx/xxx/xxx`重复出现问题，微信上打开反复闪烁、自动重新加载。

# translation 崩溃

实测`translation: all 1.5s ease`会导致打开反复闪烁

改为

```css
transition: left 1.5s ease, transform 1.5s ease, top 1.5s ease;
```

> [safari 重复出现问题 - 掘金 (juejin.cn)](https://juejin.cn/post/6917042993207705613)

> 另一种方法：
>
> ```css
> .css { 
> 	-webkit-transform-style: preserve-3d; 
> 	-webkit-backface-visibility: hidden; 
> 	-webkit-perspective: 1000;
> }
> ```
>
> [ios transition translate 闪屏问题总结_weixin_30302609的博客-CSDN博客](https://blog.csdn.net/weixin_30302609/article/details/96319825)
>
> [消除transition闪屏_要叫我大哥的博客-CSDN博客_transition 闪屏](https://blog.csdn.net/weixin_42845571/article/details/118730529)
>
> 但这个加上会导致 android 上图片渲染不完全

> 开启硬件加速
>
> ```css
> .css {
>     -webkit-transform: translate3d(0,0,0);
>     -moz-transform: translate3d(0,0,0);
>     -ms-transform: translate3d(0,0,0);
>     transform: translate3d(0,0,0);
> }
> ```
>
> [消除transition闪屏_要叫我大哥的博客-CSDN博客_transition 闪屏](https://blog.csdn.net/weixin_42845571/article/details/118730529)
>
> 测试未发现是否有用

> 另一种替代all的方式
>
> transition 使用对象尽量不要使用 all，最好也不要对元素的 left top 等属性使用transition
>
> 元素移动动画可以使用translate实现，（translate没有缓冲动画）但是可以对translate使用transition 
>
> ```css
> transform: translateX(300px)
> transition: transform 2s  ease
> ```
>
> [移动端使用transition，动画发生抖动_炯炯灯的博客-CSDN博客_小程序上的transition会抖动](https://blog.csdn.net/qq_18223479/article/details/80021565)
>
> [transition属性、兼容性 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/39044486)

### 图片资源问题

> 受限于 Ipad 和 Iphone 的可用内存，Safari 浏览器的移动端会比桌面端有着更严格的[资源使用限制](https://link.zhihu.com/?target=https%3A//link.juejin.im/%3Ftarget%3Dhttps%3A%2F%2Fdeveloper.apple.com%2Flibrary%2Fsafari%2Fdocumentation%2FAppleApplications%2FReference%2FSafariWebContent%2FCreatingContentforSafarioniPhone%2FCreatingContentforSafarioniPhone.html%23%2F%2Fapple_ref%2Fdoc%2Fuid%2FTP40006482-SW15)
>
> 其中之一是每个 HTML 页面的图片数据总量。当移动端的 Safari 浏览器加载了 8 到 10MB 的图片数据后，就会停止加载其他图片，甚至浏览器还会崩溃。
>
> [【译】怎样处理 Safari 移动端对图片资源的限制 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/29225351)

限制图片加载数量、使用缩略图优化

### 大量图片在屏幕内 transition 崩溃

容易造成崩溃，图片大的话更甚，可以更换为缩略图后再 transition

### 微信浏览器加载时 transition 崩溃

如果页面中存在 history 前进，微信浏览器下方会出现前进后退按钮，会导致页面大小变化，触发 transition，导致崩溃。可以将路由`push`改为`replace`，即保持 history 没有前进。

history API：`pushState`→`replaceState`

# jQuery 点击事件无效

> 1.给被绑定的元素添加CSS样式 cursor:pointer;
>
> 2.被绑定元素的标签如果是 div 或 span尽可能换成  button  或  a  标签里要有href属性，否则不生效。
>
> 3.将click事件直接绑定在目标元素上：
>
> ```
> $(document).on('click', '.clickable-div', function() { fire event });
> $('#page-root').on('click', '.clickable-div', function() { fire event });
> ```
>
> 但又有一说是不能绑在`document`/`body`上:dog:
>
> 4.使用插件如： https://github.com/ftlabs/fastclick
>
> [iOS 浏览器safari中使用JQuery click事件无效解决方法_hesterrocks的博客-CSDN博客_safari 主动调用click问题](https://blog.csdn.net/hesterrocks/article/details/64442284)