# Spring Boot

# @ModelAttribute 和 HandlerInterceptor

经测试调用顺序为

1. preHandle
2. @ModelAttribute
3. @RequestMapping
4. postHandle
5. afterCompletion

### 接口访问控制

##### @ModelAttribute

对控制器内所有接口生效（包括子类控制器），如需要对全部控制器生效，可以加上注解`@ControllerAdvice`

    @ModelAttribute
    public void resApiModel(HttpServletResponse response) throws java.lang.Exception {
        // 强制校验合法性
        if(verify() == null) {
            throw new Exception("访问合法性验证失败");
        };
    }

##### HandlerInterceptor

spring.xml

```xml
<mvc:interceptors>
    <mvc:interceptor>
        <mvc:mapping path="/resApi/**"/>
        <bean class="com.chunshu.config.ResApiInterceptor"></bean>
    </mvc:interceptor>
</mvc:interceptors>
```

ResApiInterceptor

```java
package com.chunshu.config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.chunshu.common.result.JsonResult;

@Component
public class ResApiInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse response, Object o) throws Exception {
        if(verify() == false) {
            JsonResult obj = renderError("访问合法性验证失败");
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            response.getWriter().write(JSON.toJSONString(obj));
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) {
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("application/json; charset=utf-8");
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) {
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("application/json; charset=utf-8");
    }
}
```
