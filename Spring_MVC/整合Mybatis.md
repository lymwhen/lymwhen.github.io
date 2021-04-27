# 整合 Mybatis

# pom.xml

```xml
<!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>${spring.version}</version>
</dependency>

<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.38</version>
</dependency>

<!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.5</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.6</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis-spring -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.6</version>
</dependency>
```

# dispatcher-servlet.xml

```xml
 <!-- 使用 druid 连接池，配置数据源 -->
<bean name="dataSource" class="com.alibaba.druid.pool.DruidDataSource" init-method="init" destroy-method="close">
    <property name="url" value="jdbc:mysql://127.0.0.1:3306/springmvc?useUnicode=true&amp;characterEncoding=utf-8&amp;useSSL=false"/>
    <property name="username" value="root"/>
    <property name="password" value="password"/>
    
    <property name="filters" value="stat" />

    <property name="maxActive" value="20" />
    <property name="initialSize" value="1" />
    <property name="maxWait" value="6000" />
    <property name="minIdle" value="1" />

    <property name="timeBetweenEvictionRunsMillis" value="60000" />
    <property name="minEvictableIdleTimeMillis" value="300000" />

    <property name="testWhileIdle" value="true" />
    <property name="testOnBorrow" value="false" />
    <property name="testOnReturn" value="false" />

    <property name="poolPreparedStatements" value="true" />
    <property name="maxOpenPreparedStatements" value="20" />

    <property name="asyncInit" value="true" />
</bean>

<!-- 配置SqlSessionFactory对象 -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <!-- 注入数据库连接池 -->
    <property name="dataSource" ref="dataSource" />
    <!-- 配置MyBaties全局配置文件:mybatis-config.xml -->
    <property name="configLocation" value="WEB-INF/mybatis-config.xml" />
    <!-- 扫描entity包 使用别名 -->
    <property name="typeAliasesPackage" value="com.springmvc.model" />
    <!-- 扫描sql配置文件:mapper需要的xml文件 -->
    <property name="mapperLocations" value="classpath:mapper/*Mapper.xml" />
</bean>

<!-- 配置扫描Dao接口包，动态实现Dao接口，注入到spring容器中 -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <!-- 注入sqlSessionFactory -->
    <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory" />
    <!-- 给出需要扫描Dao接口包 -->
    <property name="basePackage" value="com.springmvc.dao" />
</bean>
```

> druid连接池：https://github.com/alibaba/druid/wiki/DruidDataSource%E9%85%8D%E7%BD%AE

##### mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<!-- 配置全局属性 -->
	<settings>
		<!-- 使用jdbc的getGeneratedKeys获取数据库自增主键值 -->
		<setting name="useGeneratedKeys" value="true" />

		<!-- 使用列别名替换列名 默认:true -->
		<setting name="useColumnLabel" value="false" />

		<!-- 开启驼峰命名转换:Table{create_time} -> Entity{createTime} -->
		<setting name="mapUnderscoreToCamelCase" value="false" />
		
        <!-- 这个配置使全局的映射器启用或禁用缓存 -->
        <setting name="cacheEnabled" value="true"/>
        <!-- 全局启用或禁用延迟加载。当禁用时，所有关联对象都会即时加载 -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <setting name="multipleResultSetsEnabled" value="true"/>
        <setting name="useColumnLabel" value="true"/>
        <setting name="defaultExecutorType" value="REUSE"/>
        <setting name="defaultStatementTimeout" value="25000"/>
	</settings>
</configuration>
```



# 实体

创建 com.springmvc.model.User

```java
package com.springmvc.model;

public class User {
	private Integer id;
	private String name;
	private Integer age;
	private String password;
	
	public User() {
		super();
	}
	public User(String name, Integer age) {
		super();
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
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public void setAge(Integer age) {
		this.age = age;
	}
}
```

# Dao

创建 com.springmvc.dao.UserDao

```java
package com.springmvc.dao;

import org.apache.ibatis.annotations.Param;

import com.springmvc.model.User;

public interface UserDao {
	User queryById(@Param(value="id") int id);
	int insertUser(User user);
}
```

# Mapper

创建 /src/main/resources 文件夹，在 resources 下创建 mapper 文件夹，用于放置 mybatis xml 文件

> 在eclipse Properties - Deployment Assembly 中配置 resources 文件夹部署到 WEB-INF/classes 下，即classpath

在 mapper 文件夹下添加 UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.springmvc.dao.UserDao">
	<select id="queryById" resultType="com.springmvc.model.User">
		select * from t_user where id = #{id}
	</select>
	
	<insert id="insertUser" parameterType="com.springmvc.model.User">
        insert into t_user(name,age,password)values(#{name},#{age},#{password});
    </insert>
</mapper>
```

# 测试

```java
package springmvctest;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.fastjson.JSON;
import com.springmvc.dao.UserDao;
import com.springmvc.model.User;

public class UserTest extends BaseTest {
	@Autowired
	UserDao userDao;
	
	@Test
	public void Test1() {
		User user = userDao.queryById(1);
		System.out.println(JSON.toJSONString(user));
	}
	
	@Test
	public void Test2() {
		User user = new User();
		user.setName("haierya");
		user.setAge(15);
		user.setPassword("password1");
		int xx = userDao.insertUser(user);
		// 断言，如果两者一致，程序向下运行
		Assert.assertEquals(xx, 1);
		System.out.println(xx);
	}
}

```

> [jUnit 单元测试](jUnit 单元测试.html)