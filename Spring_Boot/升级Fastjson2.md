# 升级 Fastjson2

> [fastjson2_intro_cn · alibaba/fastjson2 Wiki (github.com)](https://github.com/alibaba/fastjson2/wiki/fastjson2_intro_cn)

fastjson 漏洞频发，又换不掉，那就只能紧跟新版了:dog:

### maven 删除 fastjson，配置 fastjson2

```xml
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2-extension</artifactId>
    <version>2.0.15</version>
</dependency>
```

### 简单使用

即序列化、反序列化、对象构建部分，只需更改包名即可：

`com.alibaba.fastjson` -> `com.alibaba.fastjson2`

有几个例外：

```java
// fastjson
JSONObject.parseArray();
JSONArray.parseArray();
    
// fastjson2（参数与fastjson一致）
JSON.parseArray()
```

### MessageConverter（消息转换器）

fastjson 和 fastjson2 都是通过实现 WebMvcConfigurer，在`extendMessageConverters`或`configureMessageConverters`方法中添加消息转换器。

> 顾名思义`configureMessageConverters`是配置消息转换器，`extendMessageConverters`是扩展消息转换器，即在默认的消息转换器基础上添加。
>
> [HttpMessageConverter 自定义转换器 三种方式 - bookc - 博客园 (cnblogs.com)](https://www.cnblogs.com/bookc/p/14240002.html)

```java
@Configuration
public class MessageConverterConfig implements WebMvcConfigurer {

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(fastJsonHttpMessageConverter());
        converters.add(0, stringHttpMessageConverter());
        WebMvcConfigurer.super.extendMessageConverters(converters);
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        FastJsonHttpMessageConverter converter = new FastJsonHttpMessageConverter();
        //自定义配置...
        FastJsonConfig config = new FastJsonConfig();
        config.setDateFormat("yyyy-MM-dd HH:mm");
//        config.setReaderFeatures(JSONReader.Feature.FieldBased, JSONReader.Feature.SupportArrayToBean);
//        config.setWriterFeatures(JSONWriter.Feature.WriteMapNullValue, JSONWriter.Feature.PrettyFormat);
        config.setWriterFeatures(JSONWriter.Feature.WriteMapNullValue, JSONWriter.Feature.WriteNullNumberAsZero, JSONWriter.Feature.WriteNullStringAsEmpty,
                JSONWriter.Feature.WriteNullListAsEmpty, JSONWriter.Feature.WriteNullBooleanAsFalse, JSONWriter.Feature.WriteEnumUsingToString);
        converter.setFastJsonConfig(config);
        converter.setDefaultCharset(StandardCharsets.UTF_8);
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.APPLICATION_JSON));
        converters.add(0, converter);
    }
}
```

新版的配置要更简洁一些，通过`FastJsonConfig`就可以配置默认日期格式、序列化Feature、编码格式。

> [fastjson2/spring_support_cn.md at main · alibaba/fastjson2 (github.com)](https://github.com/alibaba/fastjson2/blob/main/docs/spring_support_cn.md)

### 枚举类型序列化的问题

测试发现枚举类型默认的序列化方式为：

- fastjson: toString()/name（很有可能是toString()）
- fastjson2: value

> [!TIP]
>
> 枚举类型`name()`返回名称，且为 final 修饰，不可重写；默认的`toString()`返回`name()`，可重写。

在多数场景，枚举类型更重要的应该是`name`，所以应该配置 fastjson2 `JSONWriter.Feature.WriteEnumUsingToString`，默认使用名称，特殊情况可以重写枚举的`toString`方法

官方的配置说明：

> ```
> JSON.config(JSONReader.Feature.SupportSmartMatch);
> ```
>
> 可以通过上面的代码实现全局配置
>
> [[FEATURE\]JSONReader.Feature全局配置功能 · Issue #714 · alibaba/fastjson2 (github.com)](https://github.com/alibaba/fastjson2/issues/714#issuecomment-1231018053)

暂时不知道哪里是spring boot 启动最前的地方，而`JSON.config`又只是一个静态方法，所以先放在 Application了

jar：application.java

```java
@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		// 设置fastjson2 features
		JSON.config(JSONWriter.Feature.WriteMapNullValue, JSONWriter.Feature.WriteNullNumberAsZero, JSONWriter.Feature.WriteNullStringAsEmpty,
				JSONWriter.Feature.WriteNullListAsEmpty, JSONWriter.Feature.WriteNullBooleanAsFalse, JSONWriter.Feature.WriteEnumUsingToString);

		SpringApplication.run(Application.class, args);
	}

}
```

war：ServletInitializer

```java
public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		// 设置fastjson2 features
		JSON.config(JSONWriter.Feature.WriteMapNullValue, JSONWriter.Feature.WriteNullNumberAsZero, JSONWriter.Feature.WriteNullStringAsEmpty,
				JSONWriter.Feature.WriteNullListAsEmpty, JSONWriter.Feature.WriteNullBooleanAsFalse, JSONWriter.Feature.WriteEnumUsingToString);

		return application.sources(Application.class);
	}

}
```

通过Features配置序列化和反序列化的行为：[fastjson2/features_cn.md at main · alibaba/fastjson2 (github.com)](https://github.com/alibaba/fastjson2/blob/main/docs/features_cn.md)