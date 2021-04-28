# 整合 Freemarker

# pom.xml

```xml
<!-- https://mvnrepository.com/artifact/com.alibaba/fastjson -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.75</version>
</dependency>
```

# dispatcher-servlet.xml

```xml
<!-- 注册freemarker配置类 -->
<bean id="freeMarkerConfigurer" class="org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer">
    <!-- 模版文件路径  -->
    <property name="templateLoaderPath" value="/WEB-INF/page/"></property>
    <!-- 页面编码 -->
    <property name="defaultEncoding" value="utf-8" />
</bean>

<!-- 注册freemarker视图解析器，替换 spring 的视图解析器 -->
<bean id="freeMarkerViewResolver"
      class="org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver">
    <!-- 配置文件后缀 -->
    <property name="suffix" value=".html" />
    <property name="contentType" value="text/html;charset=UTF-8" />
    <!-- 此变量值为pageContext.request, 页面使用方法：rc.contextPath -->
    <property name="requestContextAttribute" value="rc" />
</bean>
```

更多配置

```xml
<!-- 定义BeanNameViewResolver 可以用来提供自定义view输出，如pdf等，但是一般用类似千牛的DNS静态服务来代替
      此处与freemarker无关，仅仅是介绍freemarker在多视图解析器下order的顺序
 -->
<bean class="org.springframework.web.servlet.view.BeanNameViewResolver">
    <property name="order" value="1" />
</bean>
<!-- 注册freemarker配置类 -->
<bean id="freeMarkerConfigurer" class="org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer">
    <!-- ftl模版文件路径  -->
    <property name="templateLoaderPath" value="/WEB-INF/view/"></property>
    <!-- 页面编码 -->
    <property name="defaultEncoding" value="utf-8" />
    <property name="freemarkerSettings">
        <props>
            <!-- 模版缓存刷新时间，不写单位默认为秒 -->
            <prop key="template_update_delay">0</prop>
            <!-- 时区 和 时间格式化 -->
            <prop key="locale">zh_CN</prop>
            <prop key="datetime_format">yyyy-MM-dd</prop>
            <prop key="date_format">yyyy-MM-dd</prop>
            <!-- 数字使用.来分隔 -->
            <prop key="number_format">#.##</prop>
        </props>
    </property>
</bean>
<!-- 注册freemarker视图解析器 -->
<bean id="freeMarkerViewResolver"
      class="org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver">
    <!-- 视图解析顺序，排在其他视图解析器之后 数字越大优先级越低 -->
    <property name="order" value="2" />
    <!-- 开启模版缓存 -->
    <property name="cache" value="true" />
    <!-- 上面已经配了，这里就不用配啦 -->
    <property name="prefix" value="" />
    <!-- 配置文件后缀 -->
    <property name="suffix" value=".ftl" />
    <property name="contentType" value="text/html;charset=UTF-8" />
    <!-- 是否允许session属性覆盖模型数据,默认false -->
    <property name="allowSessionOverride" value="false" />
    <!-- 是否允许request属性覆盖模型数据,默认false -->
    <property name="allowRequestOverride" value="false" />
    <!-- 开启spring提供的宏帮助(macro) -->
    <property name="exposeSpringMacroHelpers" value="true" />
    <!-- 添加request attributes属性到ModelAndView中 -->
    <property name="exposeRequestAttributes" value="true" />
    <!-- 添加session attributes属性到ModelAndView中 -->
    <property name="exposeSessionAttributes" value="true" />
</bean>
————————————————
版权声明：本文为CSDN博主「雨雾清影」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/jk418756/article/details/90729080
```



# 测试

创建测试对象

```java
public class User {
	private String name;
	private int age;

	public User() {
		
	}
	public User(String name, int age) {
		this.name = name;
		this.age = age;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
}
```

控制器传值

```java
@RequestMapping("")
public ModelAndView view(ModelAndView modelAndView) {
    modelAndView.setViewName("index");

    modelAndView.addObject("user", new User("haiyiya", 23));

    List<User> users = new ArrayList<>();
    users.add(new User("user1", 21));
    users.add(new User("user2", 22));
    modelAndView.addObject("users", users);

    return modelAndView;
}
```

在 page 下创建视图 index.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
    </head>
    <body>
        <h1>Hello World</h1>
        
        <div>contextPath</div>
        <img src="${rc.contextPath}/images/img1.png">
        
        <div>freemarker 对象</div>
        <div>姓名：${user.name}</div>
        <div>年龄：${user.age}</div>
        
        <div>freemarker 列表</div>
        <#list users as u>
        	<div>姓名：${u.name}</div>
        	<div>年龄：${u.age}</div>
        </#list>
    </body>
</html>
```

重启服务器，打开页面测试

> 视图所在位置在 spring mvc 配置文件中配置的 freemarker 视图解析器模板路径（templateLoaderPath）下，视图名称与控制器中 setViewName 的参数对应

# Freemarker 常用写法

```javascript
// if 判断，此处 length 判断必须套括号
<#if user.name??&&(user.name?length()>0)>
	<div>${user.name}</div>
</#if>
// 循环
<#list users as item>
	<div>index: ${item_index}</div>
	<div>name: ${item.name}</div>
</#list>
// 循环 map
<#list map as k, v>
	<div>index: ${k}</div>
	<div>name: ${v}</div>
</#list>

// 字符串，为空时显示 - 
${user.name!'-'}
// 时间
${(leave.endTime?string('yyyy-MM-dd HH:mm'))!}
// bool
${user.isEnabled?c}
// 数字格式化
?string('#.#')
// 转为数字型
?string.number
// 字符串包含
<#if userSpecialService?seq_contains(service.id?string.number) >
// 数组长度
<#if types??&&(types?size > 8)>
```

> 由于 Freemarker  运算符优先级问题，判断非空并且xxx，后面的要打括号

> Freemarker 解析优先于页面 html、js等，所以 Freemarker 标签和表达式可以用在页面的任意位置