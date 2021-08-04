# 集成 EhCache

# pom.xml

```xml
<!-- https://mvnrepository.com/artifact/net.sf.ehcache/ehcache -->
<dependency>
    <groupId>net.sf.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>2.10.6</version>
</dependency>
```

# dispatcher-servlet.xml

`xsi:schemaLocation`命名空间加上

```xml
http://www.springframework.org/schema/cache 
http://www.springframework.org/schema/cache/spring-cache.xsd
```



```xml
<!-- 缓存配置 -->
<!-- 启用缓存注解功能(请将其配置在Spring主配置文件中) -->
<cache:annotation-driven cache-manager="cacheManager"/>
<!-- Spring自己的基于java.util.concurrent.ConcurrentHashMap实现的缓存管理器(该功能是从Spring3.1开始提供的) -->
<!-- 
 <bean id="cacheManager" class="org.springframework.cache.support.SimpleCacheManager">
  <property name="caches">
   <set>
    <bean name="myCache" class="org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean"/>
   </set>
  </property>
 </bean>
  -->
<!-- 若只想使用Spring自身提供的缓存器,则注释掉下面的两个关于Ehcache配置的bean,并启用上面的SimpleCacheManager即可 -->
<!-- 用于创建缓存管理器的cacheManagerFactory -->
<bean id="cacheManagerFactory" class="org.springframework.cache.ehcache.EhCacheManagerFactoryBean">
    <property name="configLocation" value="WEB-INF/ehcache.xml"/>
    <property name="shared" value="true"></property>
</bean>
<!-- 使用cacheManagerFactory创建spring ehcache的缓存管理器 -->
<bean id="cacheManager" class="org.springframework.cache.ehcache.EhCacheCacheManager">
    <property name="cacheManager" ref="cacheManagerFactory"/>
</bean>
```

> 通过shared来设置cache的基地是这里的Spring独用,还是跟别的(如hibernate的Ehcache共享)
>
> whether the EHCache CacheManager should be shared (as a singleton at the VM level)
>  or independent (typically local within the application)
> ————————————————
> 版权声明：本文为CSDN博主「好的哈哈vie」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
> 原文链接：https://blog.csdn.net/qq_21574693/article/details/89332800

> [SpringMVC整合Ehcache_半步多-CSDN博客](https://blog.csdn.net/jadyer/article/details/12257865)

##### ehcache.xml

```xml
<ehcache>
	<diskStore path="java.io.tmpdir"/>
	<defaultCache
		   maxElementsInMemory="1000"
		   eternal="false"
		   timeToIdleSeconds="120"
		   timeToLiveSeconds="120"
		   overflowToDisk="false"
           memoryStoreEvictionPolicy="LFU"/>
	<cache name="myCache"
		   eternal="false"
		   maxElementsOnDisk="20000"
		   maxElementsInMemory="2000"
		   timeToLiveSeconds="3600"
		   overflowToDisk="true"
           diskSpoolBufferSizeMB="100"
		   diskPersistent="true"/>
</ehcache>
```

> ehcache 配置项：
>
> `diskStore`：为缓存路径，ehcache分为内存和磁盘两级，此属性定义磁盘的缓存位置。<br>`defaultCache`：默认缓存策略，当ehcache找不到定义的缓存时，则使用这个缓存策略。只能定义一个。
> `name`:缓存名称。<br>`maxElementsInMemory`:缓存最大数目<br>`maxElementsOnDisk`：硬盘最大缓存个数。<br>`eternal`:对象是否永久有效，一但设置了，timeout将不起作用。<br>`overflowToDisk`:是否保存到磁盘，当系统当机时<br>`timeToIdleSeconds`:设置对象在失效前的允许闲置时间（单位：秒）。仅当eternal=false对象不是永久有效时使用，可选属性，默认值是0，也就是可闲置时间无穷大。<br>`timeToLiveSeconds`:设置对象在失效前允许存活时间（单位：秒）。最大时间介于创建时间和失效时间之间。仅当`eternal=false`对象不是永久有效时使用，默认是0.，也就是对象存活时间无穷大。<br>`diskPersistent`：是否缓存虚拟机重启期数据。Whether the disk store persists between restarts of the Virtual Machine. The default value is false.`diskSpoolBufferSizeMB`：这个参数设置DiskStore（磁盘缓存）的缓存区大小。默认是30MB。每个Cache都应该有自己的一个缓冲区。<br>`diskExpiryThreadIntervalSeconds`：磁盘失效线程运行时间间隔，默认是120秒。<br>`memoryStoreEvictionPolicy`：当达到`maxElementsInMemory`限制时，Ehcache将会根据指定的策略去清理内存。默认策略是LRU（最近最少使用）。你可以设置为FIFO（先进先出）或是LFU（较少使用）。<br>`clearOnFlush`：内存数量最大时是否清除。一说重启时？<br>`memoryStoreEvictionPolicy`:可选策略有：`LRU`（最近最少使用，默认策略）、`FIFO`（先进先出）、`LFU`（最少访问次数）。
>
> `FIFO`，first in first out，先进先出<br>`LFU`， Less Frequently Used，一直以来最少被使用的。如上面所讲，缓存的元素有一个hit属性，hit值最小的将会被清出缓存。 <br>`LRU`，Least Recently Used，最近最少使用的，缓存的元素有一个时间戳，当缓存容量满了，而又需要腾出地方来缓存新的元素的时候，那么现有缓存元素中时间戳离当前时间最远的元素将被清出缓存。
>
> 版权声明：本文为CSDN博主「tanleijin」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
> 原文链接：https://blog.csdn.net/tanleijin/article/details/81118963

# 服务类

com.springmvc.service.impl.UserServiceImpl

```java
package com.springmvc.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.springmvc.dao.UserDao;
import com.springmvc.model.User;
import com.springmvc.service.IUserService;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired
	UserDao userDao;
	
	@Override
	@Cacheable(value="myCache", key="'get'+#id")
	public User queryById(int id) {
		User user = userDao.queryById(id);
		System.out.println("queryById: " + JSON.toJSONString(user));
		return user;
	}

}
```

> Cacheable 注解要写在实现类中才生效，写在接口中不生效

调用该方法，根据控制台打印判断缓存是否生效



# @Cacheable

@Cacheable**可以标记在一个方法上，也可以标记在一个类上**。当标记在一个方法上时表示该方法是支持缓存的，当标记在一个类上时则表示该类所有的方法都是支持缓存的。对于一个支持缓存的方法，Spring会在其被调用后将其返回值缓存起来，以保证下次利用同样的参数来执行该方法时可以直接从缓存中获取结果，而不需要再次执行该方法。可使用`value`、`key`、`condition`属性。

### key

Spring在缓存方法的返回值时是以键值对进行缓存的，值就是方法的返回结果，至于键的话，Spring又支持两种策略，默认策略和自定义策略。

##### 默认策略

如果方法没有参数，则使用0作为key。

如果只有一个参数的话则使用该参数作为key。

如果参数多余一个的话则使用所有参数的hashCode作为key。

##### 自定义策略

自定义策略是指我们可以通过Spring的EL表达式来指定我们的key。这里的EL表达式可以使用方法参数及它们对应的属性。使用方法参数时我们可以直接使用“#参数名”或者“#p参数index”

```java
// 将查询结果放入缓存，再次使用同一userNo查询时，直接返回缓存中的值
@Cacheable(value="myCache", key="'get'+#userNo")
public String get(String userNo){}

@Cacheable(value="users", key="#p0")
public User find(Integer id) {}

@Cacheable(value="users", key="#user.id")
public User find(User user) {}

@Cacheable(value="users", key="#p0.id")
public User find(User user) {}
```

除了上述使用方法参数作为key之外，Spring还为我们提供了一个root对象可以用来生成key。通过该root对象我们可以获取到以下信息。

| 属性名称    | 描述                        | 示例                 |
| ----------- | --------------------------- | -------------------- |
| methodName  | 当前方法名                  | #root.methodName     |
| method      | 当前方法                    | #root.method.name    |
| target      | 当前被调用的对象            | #root.target         |
| targetClass | 当前被调用的对象的class     | #root.targetClass    |
| args        | 当前方法参数组成的数组      | #root.args[0]        |
| caches      | 当前被调用的方法使用的Cache | #root.caches[0].name |

> [SpringMVC整合Ehcache_半步多-CSDN博客](https://blog.csdn.net/jadyer/article/details/12257865)
>
> [Spring缓存注解@Cacheable、@CacheEvict、@CachePut使用 - fashflying - 博客园 (cnblogs.com)](https://www.cnblogs.com/fashflying/p/6908028.html)

# @CachePut

@CachePut也可以声明一个方法支持缓存功能。与@Cacheable不同的是使用@CachePut标注的方法在执行前不会去检查缓存中是否存在之前执行过的结果，而是每次都会执行该方法，并将执行结果以键值对的形式存入指定的缓存中。**也就是这个方法一定执行并更新缓存，而别的方法可以使用这里的缓存**。可使用`value`、`key`、`condition`属性。

key 同 @Cacheable

# @CacheEvict

 @CacheEvict是用来标注在需要清除缓存元素的方法或类上的。当标记在一个类上时表示其中所有的方法的执行都会触发缓存的清除操作。@CacheEvict可以指定的属性有`value`、`key`、`condition`、`allEntries`和`beforeInvocation`。

key 同 @Cacheable

```java
// 在更新方法移出缓存，即再次调用查询方法时将重新查询
@CacheEvict(value="myCache", key="'get'+#userNo")
public void update(String userNo){}

// llEntries为true表示清除value中的全部缓存,默认为false
@CacheEvict(value="myCache", allEntries=true)
public void removeAll(){}

// 除操作默认是在对应方法成功执行之后触发的，即方法如果因为抛出异常而未能成功返回时也不会触发清除操作。使用beforeInvocation可以改变触发清除操作的时间，当我们指定该属性值为true时，Spring会在调用该方法之前清除缓存中的指定元素。
@CacheEvict(value="users", beforeInvocation=true)
public void delete(Integer id) {}
```

## @Caching

​    @Caching注解可以让我们在一个方法或者类上同时指定多个Spring Cache相关的注解。其拥有三个属性：cacheable、put和evict，分别用于指定@Cacheable、@CachePut和@CacheEvict。

```java
@Caching(cacheable = @Cacheable("users"), evict = { @CacheEvict("cache2"),@CacheEvict(value = "cache3", allEntries = true) })
public User find(Integer id) {}
```



# ehcache 不生效的情况

### 内部调用

Spring的缓存是基于Spring AOP切面，必须用代理才能生效。对象内部调用不是通过代理访问，所以缓存不会起作用。

解决方案：在本对象声明注入一个本类对象，对象内需要调用的方法都通过这个对象调用就可以

```java
public class TestService{
    @Autowired
    private TestService self;

    public void test1(){
        self.test2();
    }

    @Cacheable(key = "'testKey'")
    public void test2(){
        .....
    }
}
```

> 作者：YOGOLO
> 链接：https://www.jianshu.com/p/e7a479c9329c
> 来源：简书
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### 循环依赖

A服务类在其他服务类中被自动注入，A中的缓存会失效；循环依赖会导致cglib无法成功代理被依赖的对象，导致缓存失效。

```java
@Service
public class UserServiceImpl implements IUserService {
	@Autowired
    AService aService;
}
```

解决：

```java
@Service
public class UserServiceImpl implements IUserService {
	@Autowired
    @Lazy
    AService aService;
}
```

> [Spring Cache @Cacheable 缓存在部分Service中不生效的解决办法 - JAVA开发 - StoneWu 的博客](https://www.stonewu.com/article/spring-cache-cacheable-not-working-in-some-service)
