# JAVA_WEB 禁用 HTTP 方法

# 禁用 PUT、DELETE 等方法
```xml
<security-constraint>
	<web-resource-collection>
		<url-pattern>/*</url-pattern>
		<http-method>PUT</http-method>
		<http-method>DELETE</http-method>
		<http-method>HEAD</http-method>
		<http-method>OPTIONS</http-method>
		<http-method>TRACE</http-method>
	</web-resource-collection>
	<auth-constraint/>
</security-constraint>
```
auth-constraint 指某角色允许使用 PUT/DELETE 等方法，auth-constraint 为空表示所有角色禁止访问