# 整合 shiro

Shiro是Apache 旗下的一个简单易用的权限框架，可以轻松的完成 认证、授权、加密、会话管理、与 Web 集成、缓存等，这里只进行简单的介绍，详细的介绍请查阅官方文档，先来看下Shiro如何工作的

![整合shiro1](整合shiro1.png)

可以看到：应用代码直接交互的对象是 Subject，也就是说 Shiro 的对外 API 核心就是 Subject；其每个 API 的含义：

Subject：主体，代表了当前 “用户”，这个用户不一定是一个具体的人，与当前应用交互的任何东西都是 Subject，所有 Subject 都绑定到 SecurityManager，与 Subject 的所有交互都会委托给 SecurityManager

SecurityManager：安全管理器；即所有与安全有关的操作都会与 SecurityManager 交互；且它管理着所有 Subject；它是 Shiro 的核心，它负责与他组件进行交互，可以把它看成 DispatcherServlet 前端控制器

Realm：域，Shiro 从 Realm 获取安全数据（如用户、角色、权限），就是说 SecurityManager 要验证用户身份，那么它需要从 Realm 获取相应的用户进行比较以确定用户身份是否合法；也需要从 Realm 得到用户相应的角色 / 权限进行验证用户是否能进行操作；可以把 Realm 看成 DataSource，即安全数据源

记住一点，Shiro 不会去维护用户、权限；需要我们自己去设计 / 提供；然后通过相应的接口注入给 Shiro 即可。

> [Apache Shiro | Simple. Java. Security.](https://shiro.apache.org/10-minute-tutorial.html)
>
> [Shiro权限控制(一):Spring整合Shiro_kity9420的专栏-CSDN博客](https://blog.csdn.net/kity9420/article/details/88909426)

# pom.xml

```xml
<!-- shiro 包-->
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-core</artifactId>
    <version>1.2.2</version>
</dependency>

<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-web</artifactId>
    <version>1.2.2</version>
</dependency>

<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-ehcache</artifactId>
    <version>1.2.2</version>
</dependency>

<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-quartz</artifactId>
    <version>1.2.2</version>
</dependency>

<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
    <version>1.2.2</version>
</dependency>
```

# dispatcher-servlet.xml

```xml
<!-- 安全管理器 -->
<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
    <property name="realm" ref="userShiroRealm"/>
</bean>

<!-- 自定义域 -->
<bean id="userShiroRealm" class="com.springmvc.common.shiro.UserShiroRealm">
</bean>

<!-- Shiro的web过滤器 -->
<bean id="shiroFilter" class="org.apache.shiro.spring.web.ShiroFilterFactoryBean">
    <property name="securityManager" ref="securityManager"/>
    <!-- 未登录跳转地址 -->
    <property name="loginUrl" value="/login" />
    <!-- 无权限跳转地址 -->
    <property name="unauthorizedUrl" value="/login"/>
    <!-- url过滤器，anon表示无需登陆，如登陆，authc表示登陆才可访问 -->
    <property name="filterChainDefinitions">
        <value>
            /login/** = anon
            <!-- 默认需要登陆才可访问，不配置shiro无效 -->
            /**=authc
        </value>
    </property>
</bean>
```

# 在 web.xml 中配置拦截器

```xml
<filter>
    <filter-name>shiroFilter</filter-name>
    <filter-class>
        org.springframework.web.filter.DelegatingFilterProxy
    </filter-class>
    <init-param>
        <param-name>targetFilterLifecycle</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>shiroFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

> 此处拦截器的名称应与 dispatcher-servlet.xml 一致

# Realm

自定义域 com.springmvc.common.shiro.UserShiroRealm

```java
package com.springmvc.common.shiro;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.springmvc.model.User;
import com.springmvc.service.IUserService;

@Component
public class UserShiroRealm extends AuthorizingRealm {
	@Autowired
	private IUserService userService;
	
//	public void setUserService(IUserService userService) {
//		this.userService = userService;
//	}

    // 授权
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		User user = (User)SecurityUtils.getSubject().getPrincipal();
		
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
		if(user != null) {
			info.addRole("admin");
			info.addStringPermission("user:add");
		}
		return info;
	}

    // 验证
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken autToken) throws AuthenticationException {
		// 取出用户名（为简便，使用id-password验证登陆）
		UsernamePasswordToken userPwdToken = (UsernamePasswordToken) autToken;
		String uid = userPwdToken.getUsername();

        // 查询用户信息，并进行是否存在、是否锁定等校验
		User user = userService.queryById(Integer.valueOf(uid));
		if (null == user) {
			throw new UnknownAccountException("用户不存在！");
		}
//		if(user.getIsBlack() == null || user.getIsBlack() == 1) {
//			throw new LockedAccountException("您的账号已被禁止登陆！");
//		}
		
        // 构造验证信息
		SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(user,
				user.getPassword(), user.getName());

		return authenticationInfo;
	}
}
```

`SimpleAuthenticationInfo`参数：

1. 用户对象，可根据需要传用户或用户名等，使用`SecurityUtils.getSubject().getPrincipal()`取出
2. 密码，用于与`UsernamePasswordToken`中的`password`比较决定验证是否通过
3. salt，盐，用于密码加密
4. realm 名称

> But what if their login attempt fails? You can catch all sorts of specific exceptions that tell you exactly what happened and allows you to handle and react accordingly:
>
> ```java
> try {
>     currentUser.login( token );
>     //if no exception, that's it, we're done!
> } catch ( UnknownAccountException uae ) {
>     //username wasn't in the system, show them an error message?
> } catch ( IncorrectCredentialsException ice ) {
>     //password didn't match, try again?
> } catch ( LockedAccountException lae ) {
>     //account for that username is locked - can't login.  Show them a message?
> }
>     ... more types exceptions to check if you want ...
> } catch ( AuthenticationException ae ) {
>     //unexpected condition - error?
> }
> ```

# 登录接口及页面

### /

登陆成功后跳转的主页面，根据 shiroFilter`filterChainDefinitions`的配置，未登录直接访问此页面将会跳转到 `loginUrl`，即`/logon`

```java
@RequestMapping("")
public ModelAndView view(ModelAndView modelAndView) {
    modelAndView.setViewName("index");
    // 传递当前登录人的信息到前台
    modelAndView.addObject("user", (User)SecurityUtils.getSubject().getPrincipal());
    return modelAndView;
}
```



### /login

shiroFilter 中未登录跳转的 `loginUrl`

```java
@RequestMapping("/login")
public ModelAndView login(ModelAndView modelAndView) {
    modelAndView.setViewName("login");
    return modelAndView;
}
```

### /login/checkLogin

验证登陆的接口，`UsernamePasswordToken`中传递的用户名、密码应与`UserShiroRealm.doGetAuthenticationInfo`方法中的验证方式相对应

登陆成功后重定向到主页面`\`；登陆失败解析到 login 视图，同时将异常信息通过`msg`传递到页面，此处捕获的异常与`UserShiroRealm.doGetAuthenticationInfo`方法中抛出的异常一致

```java
@RequestMapping(value = "/login/checkLogin", method = RequestMethod.POST)
public ModelAndView checkLogin(ModelAndView modelAndView, @RequestParam("id") String id,
                               @RequestParam("password") String password) {
    modelAndView.setViewName("login");
    try {
        UsernamePasswordToken token = new UsernamePasswordToken(id, password);
        Subject subject = SecurityUtils.getSubject();
        subject.login(token);
        modelAndView.setViewName("redirect:/");
    } catch ( UnknownAccountException uae ) {
        modelAndView.addObject("msg", "用户不存在");
        //username wasn't in the system, show them an error message?
    } catch ( IncorrectCredentialsException ice ) {
        modelAndView.addObject("msg", "密码错误");
        //password didn't match, try again?
    } catch ( LockedAccountException lae ) {
        modelAndView.addObject("msg", "用户已被锁定");
        //account for that username is locked - can't login.  Show them a message?
    } catch ( AuthenticationException ae ) {
        modelAndView.addObject("msg", "登陆验证异常");
        //unexpected condition - error?
    } catch ( Exception ae ) {
        modelAndView.addObject("msg", "登陆验证异常");
    }
    return modelAndView;
}
```

### /logout

注销接口

```java
@RequestMapping(value = "/logout", method = RequestMethod.GET)
public ModelAndView logout(ModelAndView modelAndView){
    Subject subject = SecurityUtils.getSubject();
    if(subject.isAuthenticated()) {
        subject.logout();
    }
    modelAndView.setViewName("login");
    modelAndView.addObject("msg", "已注销");
    return modelAndView;
}
```

### login 视图

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
    </head>
    <body>
        <h1>Login</h1>
        <form action="/login/checkLogin" method="post">
            用户名：<input type="text" name="id"><br/>
            密码：<input type="password" name="password"><br/>
            <span style="color: red">${msg!}</span><br>
            <input type="submit" value="登录">
        </form>
    </body>
</html>
```

### index 视图，主页面

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
    </head>
    <body>
        <h1>Index</h1>
        
        <img src="${rc.contextPath}/images/img1.png">
        
        <div>欢迎你：</div>
        <div>姓名：${user.name}</div>
        <div>年龄：${user.age}</div>
        
        <a href="/logout"><button type="button">注销</button></a>
    </body>
</html>
```

# 测试

1. 未登录访问主页面应跳转到登录页

2. 登录成功

   ![整合Shiro2-登录成功](整合Shiro2-登录成功.png)

3. 注销、密码错误等提示

   ![整合Shiro2-密码错误](整合Shiro2-密码错误.png)

