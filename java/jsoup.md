# jsoup

java 爬虫，选择器使用的 css 选择器，所以很容易上手

> [jsoup: Java HTML parser, built for HTML editing, cleaning, scraping, and XSS safety](https://jsoup.org/)
>
> [Element (jsoup Java HTML Parser 1.16.2 API)](https://jsoup.org/apidocs/org/jsoup/nodes/Element.html)

```java
try {
    Document document = Jsoup.connect("https://xxx.com/index").timeout(TIME_OUT).get();
    Elements eLi = document.select("ul.vT-srch-result-list-bid>li");
} catch(Exception) {

}
```

```java
// 元素选择器
Elements eLi = document.select("ul.vT-srch-result-list-bid>li");
Elements eLi = document.select("ul.vT-srch-result-list-bid>li");
Element eSummary = element.selectFirst("div.table");
// 获取子元素
Element eSpan = e.getElementsByTag("SPAN").get(0);
// 获取属性
String url = eTitle.attr("href");
// 获取内容
String title = eTitle.text().trim();
// 获取自身包含的文本，不包含子元素的文本
String s1 = eSpan.ownText();
// 内部的html（inner HTML，即不包含自身）
String title = eTitle.html().trim();
// 包含自身的html（outer HTML）
String title = eTitle.outerHtml().trim();
// 获取script内容
int totalPage = Integer.parseInt(ePage.data().replaceAll("(?s).*size:\\s(\\d+),.*", "$1"));
```

