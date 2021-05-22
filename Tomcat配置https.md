# Tomcat 配置 https

# 生成 SSL 证书

```bash
# JKS 证书
keytool -genkey -alias tomcat -keyalg RSA -keystore G:/tomcat_eflow.keystore -validity 3650
# keytool 认为行业主流的 PKCS12 证书
keytool -genkey -alias tomcat -keyalg RSA -storetype PKCS12 -keystore G:\tomcat.keystore -validity 3650
```

# 配置端口

在 /conf/server.xml 中配置 https 端口
> http 默认端口 80，https 默认端口 443，即不输入端口号时默认的端口号

### JSK 证书
```bash
<Connector port="443" protocol="org.apache.coyote.http11.Http11NioProtocol"
		SSLEnabled="true" maxThreads="300" scheme="https" secure="true"
		clientAuth="false" keystoreFile="G:\tomcat_eflow.keystore" keystorePass="xxx" sslProtocol="TLS">
</Connector>
```

### PKCS12 证书

```bash
<Connector port="443" protocol="org.apache.coyote.http11.Http11NioProtocol"
			SSLEnabled="true" maxThreads="300">
	<SSLHostConfig>
		<Certificate certificateKeystoreFile="G:\tomcat.keystore" certificateKeystorePassword="xxx" certificateKeystoreType="PKCS12" />
	</SSLHostConfig>
</Connector>
```

# JAVA WEB 项目强制使用 https
在 web.xml web-app 中加入
```xml
<security-constraint>
	<web-resource-collection>
		<web-resource-name>securedapp</web-resource-name>
		<url-pattern>/*</url-pattern>
	</web-resource-collection>
	<user-data-constraint>
		<transport-guarantee>CONFIDENTIAL</transport-guarantee>
	</user-data-constraint>
</security-constraint>
```
> CONFIDENTIAL: 要保证服务器和客户端之间传输的数据不能够被修改，且不能被第三方查看到
     INTEGRAL: 要保证服务器和client之间传输的数据不能够被修改
     NONE: 指示容器必须能够在任一的连接上提供数据。（即用HTTP或HTTPS，由客户端来决定）

# 启动 Tomcat
在控制台中出现端口信息
```log
22-May-2021 17:01:16.621 信息 [main] org.apache.coyote.AbstractProtocol.init 初始化协议处理器 ["http-nio-80"]
22-May-2021 17:01:17.585 信息 [main] org.apache.coyote.AbstractProtocol.init 初始化协议处理器 ["https-jsse-nio-443"]

22-May-2021 17:01:21.035 信息 [main] org.apache.coyote.AbstractProtocol.start 开始协议处理句柄["http-nio-80"]
22-May-2021 17:01:21.061 信息 [main] org.apache.coyote.AbstractProtocol.start 开始协议处理句柄["https-jsse-nio-443"]
```

# Tomcat 的端口重定向
Connector 标签中的 redirectPort 属性表示重定向的端口
配置多个 Connector 时，多个端口都可以访问系统
如果客户端中配置了强制使用 https，此时从 http 端口访问将会被重定向到 https 端口

如需从 http://127.0.0.1 跳转到 https://127.0.0.1 ，即 http 80 端口重定向到 https 443
```xml
<!--server.xml-->
<Connector executor="tomcatThreadPool"
			port="80" protocol="HTTP/1.1"
			connectionTimeout="20000"
			redirectPort="443" />

<Connector port="443" protocol="org.apache.coyote.http11.Http11NioProtocol"
			SSLEnabled="true" maxThreads="300">
	<SSLHostConfig>
		<Certificate certificateKeystoreFile="G:\tomcat.keystore" certificateKeystorePassword="xxx" certificateKeystoreType="PKCS12" />
	</SSLHostConfig>
</Connector>

<!--web.xml-->
<security-constraint>
	<web-resource-collection>
		<web-resource-name>securedapp</web-resource-name>
		<url-pattern>/*</url-pattern>
	</web-resource-collection>
	<user-data-constraint>
		<transport-guarantee>CONFIDENTIAL</transport-guarantee>
	</user-data-constraint>
</security-constraint>
```