# fastjson 时间格式

### 通过 Response 返回前台的时间

##### 默认返回时间戳

ms 时间戳

##### WriteDateUseDateFormat

配置`<value>WriteDateUseDateFormat</value>`，格式化为`yyyy-MM-dd HH:mm:ss`

##### 修改 WriteDateUseDateFormat 默认时间格式

重写`com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter`

```java
import java.io.IOException;

import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;

public class JsonHttpMessageConverter extends FastJsonHttpMessageConverter {

    @Override
    protected void writeInternal(Object obj, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        JSON.DEFFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm";
        JSON.toJSONString(obj, SerializerFeature.WriteDateUseDateFormat);
        super.writeInternal(obj, outputMessage);
    }
}
```

##### 字段注解

`@JSONField (format="yyyy-MM-dd HH")`注解可覆盖以上配置

```java
@JSONField (format="yyyy-MM-dd HH")
private Date cutoffTime;
```

##### 附 spring-mvc.xml 配置

```xml
<mvc:annotation-driven>
    <mvc:message-converters register-defaults="true">
        <bean id="stringHttpMessageConverter" class="org.springframework.http.converter.StringHttpMessageConverter">  
            <property name="defaultCharset" value="UTF-8"/>  
        </bean>
        <!-- 避免IE执行AJAX时,返回JSON出现下载文件 -->
        <!-- FastJson -->
        <bean id="fastJsonHttpMessageConverter" class="com.ruiger.common.JsonHttpMessageConverter">
            <property name="supportedMediaTypes">
                <list>
                    <!-- 这里顺序不能反，一定先写text/html,不然ie下出现下载提示 -->
                    <value>text/html;charset=UTF-8</value>
                    <value>application/json;charset=UTF-8</value>
                </list>
            </property>
            <property name="features">
                <array value-type="com.alibaba.fastjson.serializer.SerializerFeature">
                    <value>WriteDateUseDateFormat</value>
                    <!-- 避免循环引用 -->
                    <value>DisableCircularReferenceDetect</value>
                    <!-- 是否输出值为null的字段 -->
                    <value>WriteMapNullValue</value>
                    <!-- 数值字段如果为null,输出为0,而非null -->
                    <value>WriteNullNumberAsZero</value>
                    <!-- 字符类型字段如果为null,输出为"",而非null  -->
                    <value>WriteNullStringAsEmpty</value>
                    <!-- List字段如果为null,输出为[],而非null -->
                    <value>WriteNullListAsEmpty</value>
                    <!-- Boolean字段如果为null,输出为false,而非null -->
                    <value>WriteNullBooleanAsFalse</value>
                </array>
            </property>
        </bean>
    </mvc:message-converters>
</mvc:annotation-driven>
```

> [springmvc fastjson 反序列化时间格式化_你好邱林和的专栏-CSDN博客](https://blog.csdn.net/nihaoqiulinhe/article/details/67635061)