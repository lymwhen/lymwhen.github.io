# CAS Enterprise Single Sign-On

- [Spring Webflow](https://apereo.github.io/cas/5.3.x/installation/Webflow-Customization.html)/Spring Boot [Java server component](https://apereo.github.io/cas/5.3.x/planning/Architecture.html).
- [Pluggable authentication support](https://apereo.github.io/cas/5.3.x/installation/Configuring-Authentication-Components.html) ([LDAP](https://apereo.github.io/cas/5.3.x/installation/LDAP-Authentication.html), [Database](https://apereo.github.io/cas/5.3.x/installation/Database-Authentication.html), [X.509](https://apereo.github.io/cas/5.3.x/installation/X509-Authentication.html), [SPNEGO](https://apereo.github.io/cas/5.3.x/installation/SPNEGO-Authentication.html), [JAAS](https://apereo.github.io/cas/5.3.x/installation/JAAS-Authentication.html), [JWT](https://apereo.github.io/cas/5.3.x/installation/JWT-Authentication.html), [RADIUS](https://apereo.github.io/cas/5.3.x/installation/RADIUS-Authentication.html), [MongoDb](https://apereo.github.io/cas/5.3.x/installation/MongoDb-Authentication.html), etc)
- Support for multiple protocols ([CAS](https://apereo.github.io/cas/5.3.x/protocol/CAS-Protocol.html), [SAML](https://apereo.github.io/cas/5.3.x/protocol/SAML-Protocol.html), [WS-Federation](https://apereo.github.io/cas/5.3.x/protocol/WS-Federation-Protocol.html), [OAuth2](https://apereo.github.io/cas/5.3.x/protocol/OAuth-Protocol.html), [OpenID](https://apereo.github.io/cas/5.3.x/protocol/OpenID-Protocol.html), [OpenID Connect](https://apereo.github.io/cas/5.3.x/protocol/OIDC-Protocol.html), [REST](https://apereo.github.io/cas/5.3.x/protocol/REST-Protocol.html))
- Support for [multifactor authentication](https://apereo.github.io/cas/5.3.x/installation/Configuring-Multifactor-Authentication.html) via a variety of providers ([Duo Security](https://apereo.github.io/cas/5.3.x/installation/DuoSecurity-Authentication.html), [FIDO U2F](https://apereo.github.io/cas/5.3.x/installation/FIDO-U2F-Authentication.html), [YubiKey](https://apereo.github.io/cas/5.3.x/installation/YubiKey-Authentication.html), [Google Authenticator](https://apereo.github.io/cas/5.3.x/installation/GoogleAuthenticator-Authentication.html), [Microsoft Azure](https://apereo.github.io/cas/5.3.x/installation/MicrosoftAzure-Authentication.html), [Authy](https://apereo.github.io/cas/5.3.x/installation/AuthyAuthenticator-Authentication.html) etc)
- Support for [delegated authentication](https://apereo.github.io/cas/5.3.x/integration/Delegate-Authentication.html) to external providers such as [ADFS](https://apereo.github.io/cas/5.3.x/integration/ADFS-Integration.html), Facebook, Twitter, SAML2 IdPs, etc.
- Built-in support for [password management](https://apereo.github.io/cas/5.3.x/installation/Password-Management.html), [notifications](https://apereo.github.io/cas/5.3.x/installation/Webflow-Customization-Interrupt.html), [terms of use](https://apereo.github.io/cas/5.3.x/installation/Webflow-Customization-AUP.html) and [impersonation](https://apereo.github.io/cas/5.3.x/installation/Surrogate-Authentication.html).
- Support for [attribute release](https://apereo.github.io/cas/5.3.x/integration/Attribute-Release.html) including [user consent](https://apereo.github.io/cas/5.3.x/integration/Attribute-Release-Consent.html).
- [Monitor and track](https://apereo.github.io/cas/5.3.x/installation/Monitoring-Statistics.html) application behavior, statistics and logs in real time.
- Manage and register [client applications and services](https://apereo.github.io/cas/5.3.x/installation/Service-Management.html) with specific authentication policies.
- [Cross-platform client support](https://apereo.github.io/cas/5.3.x/integration/CAS-Clients.html) (Java, .Net, PHP, Perl, Apache, etc).
- Integrations with [InCommon, Box, Office365, ServiceNow, Salesforce, Workday, WebAdvisor](https://apereo.github.io/cas/5.3.x/integration/Configuring-SAML-SP-Integrations.html), Drupal, Blackboard, Moodle, [Google Apps](https://apereo.github.io/cas/5.3.x/integration/Google-Apps-Integration.html), etc.

> [CAS - Home (apereo.github.io)](https://apereo.github.io/cas/5.3.x/)

# 安装要求

`JDK1.8`、cas 推荐`Tomcat`作为 servlet 容器

> [CAS - Installation Requirements (apereo.github.io)](https://apereo.github.io/cas/5.3.x/planning/Installation-Requirements.html)

cas 推荐`WAR Overlay`安装方式

> CAS installation is a fundamentally source-oriented process, and we recommend a WAR overlay (1) project to organize customizations such as component configuration and UI design. The output of a WAR overlay build is a `cas.war` file that can be deployed to a servlet container like [Apache Tomcat](https://apereo.github.io/cas/5.3.x/installation/Configuring-Servlet-Container.html).
>
> CAS 安装从根本上是一个面向源代码的过程，我们推荐一个 WAR Overlay 项目来进行自定义，例如组件配置和 UI 设计。 WAR 覆盖构建的输出是一个 cas.war 文件，该文件可以部署到 Apache Tomcat 等 servlet 容器。

> [CAS - Overlay Installation (apereo.github.io)](https://apereo.github.io/cas/5.3.x/installation/Maven-Overlay-Installation.html)

### WAR Overlay 项目

> | **Project**                                                  | **Build Directory**                     | **Source Directory** |
> | ------------------------------------------------------------ | --------------------------------------- | -------------------- |
> | [CAS Maven WAR Overlay](https://github.com/apereo/cas-overlay-template) | target/cas.war!WEB-INF/classes/         | src/main/resources   |
> | [CAS Gradle WAR Overlay](https://github.com/apereo/cas-gradle-overlay-template) | cas/build/libs/cas.war!WEB-INF/classes/ | src/main/resources   |
>
> To construct the overlay project, you need to copy directories and files *that you need to customize* in the build directory over to the source directory.
>
> The Gradle overlay also provides additional tasks to explode the binary artifact first before re-assembling it again. You may need to do that step manually yourself to learn what files/directories need to be copied over to the source directory.
>
> Note: Do **NOT** ever make changes in the above-noted build directory. The changesets will be cleaned out and set back to defaults every time you do a build. Put overlaid components inside the source directory and/or other instructed locations to avoid surprises.
>
> 要构建 overlay 项目，需要将 build 目录中需要自定义的目录和文件复制到 source 目录
>
> 不要在 build 目录中进行修改，因为每次 build 的时候它将被重置，将覆盖的组件放在source和/或其他指定的位置
>
> Gradle 叠加层还提供了额外的任务，先分解二进制工件，然后再重新组装它。您可能需要自己手动执行该步骤以了解需要将哪些文件/目录复制到源目录。

> [CAS - Overlay Installation (apereo.github.io)](https://apereo.github.io/cas/5.3.x/installation/Maven-Overlay-Installation.html)

# Maven WAR Overlay

在[apereo/cas-overlay-template: Apereo CAS WAR Overlay template (github.com)](https://github.com/apereo/cas-overlay-template)中选择`5.3.x`分支

```bash
git clone -b 5.3 git@github.com:apereo/cas-overlay-template.git
```

build

```bash
# 不知为啥不管用
#./build.sh package
mvn install
```

拷贝`/target/cas.war`到 tomcat `webapps` 目录下，启动 tomcat

> 须配置 tomcat ssl

浏览器打开[https://127.0.0.1:8443/cas/login](https://127.0.0.1:8443/cas/login)，使用默认用户casuser/Mellon登录测试

> target/cas/war/WEB-INF/classes/application.properties
>
> ```bash
> ##
> CAS Authentication Credentials
> #
> cas.authn.accept.users=casuser::Mellon
> ```

> [apereo/cas-overlay-template at 5.3 (github.com)](https://github.com/apereo/cas-overlay-template/tree/5.3)

# 自定义

> `./build.cmd help`或查看`build.cmd`文件查看所有的 build 命令

使用 Eclipse 或 idea 打开`cas-overlay-template`项目，等待 maven 包安装完毕

创建`src/main/java`，创建 java 包 `com.chunshu`

创建`src/main/resources`目录，将 target/cas/war/WEB-INF/classes/application.properties 拷贝到`src/main/resources`目录

> 如 WAR Overlay 所述，要构建 overlay 项目，需要将 build 目录中需要自定义的目录和文件复制到 source 目录

### **启动测试**

```bash
# 创建证书
./build.cmd gencert
# 启动
mvn install
./build.cmd run 
```

# 数据库认证

> ### 数据库认证的方式
>
> ##### Query Database Authentication
>
> Authenticates a user by comparing the user password (which can be encoded with a password encoder) against the password on record determined by a configurable database query.
>
> 查询数据库认证：将密码（可被编码）与根据用户名查询的密码比较
>
> 配置键：`cas.authn.jdbc.query[0].`
>
> ##### Search Database Authentication
>
> Searches for a user record by querying against a username and password; the user is authenticated if at least one result is found.
>
> 搜索数据库认证：使用用户名和密码至少查询到一条记录
>
> 配置键：`cas.authn.jdbc.search[0].`
>
> ##### Bind Database Authentication
>
> Authenticates a user by attempting to create a database connection using the username and (hashed) password.
>
> 绑定数据库认证：使用用户名和密码创建一个数据库连接
>
> 配置键：`cas.authn.jdbc.bind[0].`
>
> ##### Encode Database Authentication
>
> A JDBC querying handler that will pull back the password and the private salt value for a user and validate the encoded password using the public salt value. Assumes everything is inside the same database table. Supports settings for number of iterations as well as private salt.
>
> This password encoding method combines the private Salt and the public salt which it prepends to the password before hashing. If multiple iterations are used, the bytecode hash of the first iteration is rehashed without the salt values. The final hash is converted to hex before comparing it to the database value.
>
> 编码数据库认证：查询取回用户密码和私有盐，并使用公共盐验证编码的密码，支持设置迭代次数和私有盐。这种密码编码方法结合了私有盐和公共盐，它在散列之前添加到密码中。如果使用多次迭代，则第一次迭代的字节码散列将在没有盐值的情况下重新散列。在将最终哈希值与数据库值进行比较之前，将其转换为十六进制。
>
> 配置键：`cas.authn.jdbc.encode[0].`
>
> [CAS Properties (apereo.github.io)](https://apereo.github.io/cas/5.3.x/installation/Configuration-Properties.html#database-authentication)

> ### 密码编码
>
> Certain aspects of CAS such as authentication handling support configuration of password encoding. Most options are based on Spring Security’s [support for password encoding](http://docs.spring.io/spring-security/site/docs/current/apidocs/org/springframework/security/crypto/password/PasswordEncoder.html).
>
> The following options related to password encoding support in CAS apply equally to a number of CAS components (authentication handlers, etc) given the component’s *configuration key*:
>
> ```properties
> ${configurationKey}.passwordEncoder.type=NONE|DEFAULT|STANDARD|BCRYPT|SCRYPT|PBKDF2
> ${configurationKey}.passwordEncoder.characterEncoding=
> ${configurationKey}.passwordEncoder.encodingAlgorithm=
> ${configurationKey}.passwordEncoder.secret=
> ${configurationKey}.passwordEncoder.strength=16
> ```
>
> CAS 身份验证处理支持密码编码的配置，大多数选项基于 Spring Security 对密码编码的支持。
>
> 支持上述的几种数据库认证方式
>
> | Type                          | Description                                                  |
> | ----------------------------- | ------------------------------------------------------------ |
> | NONE                          | No  password encoding (i.e. plain-text) takes place.         |
> | DEFAULT                       | Use  the `DefaultPasswordEncoder` of  CAS. For message-digest algorithms via characterEncoding and encodingAlgorithm. |
> | BCRYPT                        | Use  the `BCryptPasswordEncoder` based  on the strength provided  and an optional secret. |
> | SCRYPT                        | Use  the `SCryptPasswordEncoder`.                            |
> | PBKDF2                        | Use  the `Pbkdf2PasswordEncoder` based  on the strength provided  and an optional secret. |
> | STANDARD                      | Use  the `StandardPasswordEncoder` based  on the secret provided. |
> | GLIBC_CRYPT                   | [Use the GlibcCryptPasswordEncoder based   on the encodingAlgorithm, strength provided and an   optional secret.](https://commons.apache.org/proper/commons-codec/archives/1.10/apidocs/org/apache/commons/codec/digest/Crypt.html) |
> | org.example.MyEncoder         | An  implementation of `PasswordEncoder` of your own choosing. |
> | file:///path/to/script.groovy | Path  to a Groovy script charged with handling password encoding operations. |
>
> [CAS Common Properties Overview (apereo.github.io)](https://apereo.github.io/cas/5.3.x/installation/Configuration-Properties-Common.html#password-encoding)

### 开启数据库认证

```xml
<dependency>
    <groupId>org.apereo.cas</groupId>
    <artifactId>cas-server-support-jdbc</artifactId>
    <version>${cas.version}</version>
</dependency>
```

> [CAS - Database Authentication (apereo.github.io)](https://apereo.github.io/cas/5.3.x/installation/Database-Authentication.html)

### 数据库驱动

> While in most cases this is unnecessary and handled by CAS automatically, you may need to also include the following module to account for various database drivers
>
> 大多下情况由 cas 自动处理，可能需要包含一下模块来解释数据库驱动

```xml
<dependency>
   <groupId>org.apereo.cas</groupId>
   <artifactId>cas-server-support-jdbc-drivers</artifactId>
   <version>${cas.version}</version>
</dependency>
```

> Note that the Oracle database driver needs to be [manually installed](http://www.oracle.com/technetwork/database/features/jdbc/index-091264.html) before the above configuration can take effect. Depending on the driver version, the actual name of the driver class may vary.
>
> 注意 oracle 数据库需要手动安装才能生效

> [CAS - JDBC Drivers (apereo.github.io)](https://apereo.github.io/cas/5.3.x/installation/JDBC-Drivers.html)

### 查询数据库认证

在`application.properties`中添加

```properties
cas.authn.jdbc.query[0].sql=select * from sys_user where phone=?
cas.authn.jdbc.query[0].fieldPassword=password
cas.authn.jdbc.query[0].url=jdbc:mysql://127.0.0.1:3306/yzk_web?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
cas.authn.jdbc.query[0].user=root
cas.authn.jdbc.query[0].password=password
cas.authn.jdbc.query[0].driverClass=com.mysql.jdbc.Driver
cas.authn.jdbc.query[0].passwordEncoder.characterEncoding=UTF-8
```

> 数据库使用 http 连接需要显式设置`useSSL=false`

> [CAS Properties (apereo.github.io)](https://apereo.github.io/cas/5.3.x/installation/Configuration-Properties.html#database-authentication)

##### 自定义 java 编码规则

```properties
cas.authn.jdbc.query[0].passwordEncoder.type=com.chunshu.EFlowPasswordEncoder
```

实现自定义的密码编码器

pom.xml

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-core</artifactId>
    <version>5.5.3</version>
</dependency>
```

EFlowPasswordEncoder

```java
package com.chunshu;

import org.springframework.security.crypto.password.PasswordEncoder;

public class EFlowPasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence charSequence) {
        return EFlowMD5Util.encode(charSequence.toString());
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return this.encode(rawPassword).equals(encodedPassword);
    }
}
```

### 编码数据库认证

系统用户的原始密码处理规则为：以 id 为私有盐，SHA-256 迭代 10 次生成特征码，存入`password`字段

在`application.properties`中添加

```properties
cas.authn.jdbc.encode[0].url=jdbc:mysql://127.0.0.1:3306/yzk_web?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
cas.authn.jdbc.encode[0].user=root
cas.authn.jdbc.encode[0].password=password
cas.authn.jdbc.encode[0].driverClass=com.mysql.jdbc.Driver
#cas.authn.jdbc.encode[0].passwordEncoder.characterEncoding=UTF-8

cas.authn.jdbc.encode[0].numberOfIterations=10
#cas.authn.jdbc.encode[0].numberOfIterationsFieldName=numIterations
cas.authn.jdbc.encode[0].saltFieldName=id
#cas.authn.jdbc.encode[0].staticSalt=
cas.authn.jdbc.encode[0].sql=select * from sys_user where phone=?
cas.authn.jdbc.encode[0].algorithmName=SHA-256
cas.authn.jdbc.encode[0].passwordFieldName=password
#cas.authn.jdbc.encode[0].expiredFieldName=
#cas.authn.jdbc.encode[0].disabledFieldName=
```

