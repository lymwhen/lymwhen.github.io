# OTHERS



# 流程引擎数据库断开/网络中断后拒绝连接

原：

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE hibernate-configuration PUBLIC "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
        "http://hibernate.sourceforge.net/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
<session-factory>
	<property name="connection.datasource">
		java:comp/env/FlowCPUDS
	</property>
	<property name="show_sql">true</property>
	<property name="format_sql">true</property> 	
	<property name="dialect">org.hibernate.dialect.OracleDialect</property>
	<property name="hibernate.connection.driver_class">oracle.jdbc.driver.OracleDriver </property>
    <property name="hibernate.connection.url">jdbc:oracle:thin:@xxx:1521/ORCL</property>
    <property name="hibernate.connection.username">xxx</property>
	<property name="hibernate.connection.password">xxx</property>
	
	<property name="hibernate.connection.provider_class">org.hibernate.connection.C3P0ConnectionProvider</property>
	<property name="c3p0.acquire_increment">2</property>
	<property name="c3p0.idle_test_period">120</property>
	<property name="c3p0.max_size">50</property>
	<property name="c3p0.max_statements">100</property>
	<property name="c3p0.min_size">20</property>
	<property name="c3p0.timeout">90</property>
	<property name="c3p0.preferredTestQuery ">select 1</property>
	<property name="c3p0.idleConnectionTestPeriod ">18000</property>
	<property name="c3p0.maxIdleTime">25000</property>
	<property name="c3p0.testConnectionOnCheckout">true</property>
	
	<mapping resource="com/ecore/flow/daoimpl/hb/administrator/hbm/HBMAdmObj.hbm.xml"/>
	<mapping resource="com/ecore/flow/daoimpl/hb/engine/hbm/HBMEngineObj.hbm.xml"/>
	<mapping resource="com/ecore/flow/daoimpl/hb/oug/hbm/HBMOugObj.hbm.xml"/>
	<mapping resource="com/ecore/flow/session/cache/impl/hb/HBMSessionCache.hbm.xml"/>
	<mapping resource="com/ecore/todone/impl/hb/hbm/HBMTodone.hbm.xml" />
</session-factory>
</hibernate-configuration>
```

修改后，问题解决：

```xml
<property name="c3p0.acquire_increment">2</property>
<property name="c3p0.idle_test_period">120</property>
<property name="c3p0.max_size">50</property>
<property name="c3p0.max_statements">100</property>
<property name="c3p0.min_size">20</property>
<property name="c3p0.timeout">90</property>
<property name="c3p0.preferredTestQuery">select 1</property>
<property name="c3p0.breakAfterAcquireFailure">false</property>
<property name="c3p0.testConnectionOnCheckout">false</property>
<property name="c3p0.testConnectionOnCheckin">false</property>
<property name="c3p0.idleConnectionTestPeriod">60</property>
<property name="c3p0.acquireRetryAttempts">10</property>
<property name="c3p0.acquireRetryDelay">1000</property>
<property name="c3p0.maxIdleTime">25000</property>
```

> 1）C3P0容错和自动重连与以下配置参数有关：
>
> - [breakAfterAcquireFailure](http://www.mchange.com/projects/c3p0/index.html#breakAfterAcquireFailure) ：true表示pool向数据库请求连接失败后标记整个pool为block并close，就算后端数据库恢复正常也不进行重连，客户端对pool的请求都拒绝掉。false表示不会标记 pool为block，新的请求都会尝试去数据库请求connection。默认为false。因此，如果想让数据库和网络故障恢复之后，pool能继续请求正常资源必须把此项配置设为false
>
> - [idleConnectionTestPeriod](http://www.mchange.com/projects/c3p0/index.html#idleConnectionTestPeriod) ：C3P0会有一个Task检测pool内的连接是否正常，此参数就是Task运行的频率。默认值为0，表示不进行检测。
>
> - [testConnectionOnCheckout](http://www.mchange.com/projects/c3p0/index.html#testConnectionOnCheckout) ：true表示在每次从pool内checkout连接的时候测试其有效性，这是个同步操作，因此应用端的每次数据库调用，都会先通过测试sql测试其有效性，如果连接无效，会关闭此连接并剔除出pool，并尝试从pool内取其他连接，默认为false，此特性要慎用，会造成至少多一倍的数据库调用。
>
> - [testConnectionOnCheckin](http://www.mchange.com/projects/c3p0/index.html#testConnectionOnCheckin) ：true表示每次把连接checkin到pool里的时候测试其有效性，因为是个事后操作，所以是异步的，应用端不需要等待测试结果，但同样会造成至少多一倍的数据库调用。
>
> - [acquireRetryAttempts](http://www.mchange.com/projects/c3p0/index.html#acquireRetryAttempts) 和[acquireRetryDelay](http://www.mchange.com/projects/c3p0/index.html#acquireRetryDelay) ：pool请求取连接失败后重试的次数和重试的频率。请求连接会发生在pool内连接少于min值或则等待请求数>池内能提供的连接数
>
> - [automaticTestTable](http://www.mchange.com/projects/c3p0/index.html#automaticTestTable) 、[connectionTesterClassName](http://www.mchange.com/projects/c3p0/index.html#connectionTesterClassName) 、[preferredTestQuery](http://www.mchange.com/projects/c3p0/index.html#preferredTestQuery) ：表示测试方式，默认是采用 DatabaseMetaData.getTables()来测试connection的有效性，但可以通过以上配置来定制化测试语句，通过其名字就很好理解其含义，无需过多解释
>
> - [maxIdleTime](http://www.mchange.com/projects/c3p0/index.html#maxIdleTime) 和 [maxConnectionAge](http://www.mchange.com/projects/c3p0/index.html#maxConnectionAge) ：表示connection的时效性，maxIdleTime和maxConnectionAge不同之处在于，maxIdleTime表示idle状态的connection能存活的最大时间，而maxConnectionAge表示connection能存活的绝对时间
>
> - 综上所述，要想保证性能的前提下，本人推荐的配置组合如下：
>
>   breakAfterAcquireFailure: false<br>
>   testConnectionOnCheckout: false<br>
>   testConnectionOnCheckin: false<br>
>   idleConnectionTestPeriod: 60<br>
>   acquireRetryAttempts: 10<br>
>   acquireRetryDelay: 1000<br>
>
> [关于c3p0的重连机制_千叶飘的空中楼阁-CSDN博客](https://blog.csdn.net/qianyepiao/article/details/5869936)

> [com.mchange.v2.resourcepool.ResourcePoolException: Attempted to use a closed or broken resource pool_gycsjz的专栏-CSDN博客](https://blog.csdn.net/gycsjz/article/details/45037607)

# 手动添加起草模板

HxD 16进制编辑器：[HxD - Freeware Hex Editor and Disk Editor | mh-nexus](https://mh-nexus.de/en/hxd/)

在系统中添加报错时，通过手动添加。

在 T_OA_FILETEMPLET 表中参照其他起草模板添加一条数据，注意附件字段填`id`.zoa

从系统中拷贝一个**可用的**模板文件，可以看到结构为：

##### 12字节文件头

```
07 02 00 00 01 00 00 00 18 00 00 00
```

##### 4字节文件大小

```
2D 19 00 00
```

倒序值为 zip 包大小，即192D（6445）字节

##### 8字节空白

```
00 00 00 00 00 00 00 00
```

##### zip 包，文件头为：

```
50 4B 03 04 14 00 00 00
```

可以选中文件头拖到 xml 前，选中的字节数即为上述大小

##### 末尾为 zoa 的描述 xml

```
3C 3F 78 6D 6C 20 76 65 72 73 69 6F 6E 3D 22 31 2E 30 22 20 65 6E 63 6F 64 69 6E 67 3D 22 67 62 32 33 31 32 22 3F 3E 0D 0A 3C 70 61 63 6B 61 67 65 20 74 69 74 6C 65 3D 22 CE C4 BC FE C4 DA C8 DD 22 20 70 3D 22 33 32 35 38 34 34 32 34 22 3E 3C 66 69 6C 65 20 70 3D 22 33 32 36 30 32 35 37 32 22 20 69 64 3D 22 7B 43 39 45 38 42 44 35 42 2D 37 39 46 32 2D 34 37 36 46 2D 38 43 35 31 2D 30 32 37 41 46 45 32 31 36 44 36 37 7D 22 20 6F 72 64 65 72 3D 22 31 22 20 74 79 70 65 3D 22 77 6F 72 64 22 20 73 75 62 74 79 70 65 3D 22 77 6F 72 64 22 20 74 69 74 6C 65 3D 22 66 64 73 22 20 70 72 65 66 69 78 3D 22 5B B2 DD B8 E5 5D 22 20 65 78 74 3D 22 2E 64 6F 63 22 20 6D 64 35 3D 22 31 63 38 35 61 32 62 66 33 38 63 65 33 33 61 38 36 32 33 31 62 66 61 30 32 31 35 36 37 37 36 31 22 2F 3E 3C 2F 70 61 63 6B 61 67 65 3E 0D 0A 0D 0A
```



```
<?xml version="1.0" encoding="gb2312"?>
<package title="ÎÄ¼þÄÚÈÝ" p="32584424"><file p="32602572" id="{C9E8BD5B-XXXX-476F-8C51-0XXXXXX16D67}" order="1" type="word" subtype="word" title="fds" prefix="[²Ý¸å]" ext=".doc" md5="1c85a2bf38ce33a86231bfa021567761"/></package>
```

### 制作 zoa

1. 将要作为模板的文档文件命名为`{C9E8BD5B-XXXX-476F-8C51-0XXXXXX16D67}`，添加到 zip 中。
2. HxD 打开 zip，查看总字节数
3. 在文件头插入：

```
07 02 00 00 01 00 00 00 18 00 00 00 2D 19 00 00 00 00 00 00 00 00 00 00
```
总字节数（16进制）的倒序替换`2D 19`

4. 在末尾插入文本：

```
<?xml version="1.0" encoding="gb2312"?>
<package title="ÎÄ¼þÄÚÈÝ" p="32584424"><file p="32602572" id="{C9E8BD5B-XXXX-476F-8C51-0XXXXXX16D67}" order="1" type="word" subtype="word" title="fds" prefix="[²Ý¸å]" ext=".doc" md5="1c85a2bf38ce33a86231bfa021567761"/></package>
```

以文档文件名替换`id`。

查看文档文件 MD5：

```
certutil -hashfile xxx.doc MD5
```

将 MD5 替换到`md5`。

> [!TIP]
>
> 如果要添加多个文件或修改中文信息，可以用 hex 转字符工具，获得 xml 原文，编辑后转回16进制替换回。
>
> [HEX转字符 十六进制转字符 hex gb2312 gbk utf8 汉字内码转换 - The X 在线工具 (the-x.cn)](https://the-x.cn/encodings/Hex.aspx)
