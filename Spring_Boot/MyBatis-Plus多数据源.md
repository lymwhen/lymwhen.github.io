# Mybatis-Plus 多数据源

[基础必读（免费） · dynamic-datasource · 看云 (kancloud.cn)](https://www.kancloud.cn/tracy5546/dynamic-datasource/2264611)

[springboot+druid+mybatis plus的多数据源配置_qqxhb 资源共享-CSDN博客](https://blog.csdn.net/qq_43792385/article/details/90764263)

# pom.xml

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.3.4</version>
</dependency>

<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus</artifactId>
    <version>3.4.3.4</version>
</dependency>

<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.4.1</version>
</dependency>

<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
    <version>3.5.0</version>
</dependency>
```

# application.yml

```yml
spring:
  datasource:
    dynamic:
      primary: sjzt_web #设置默认的数据源或者数据源组,默认值即为master
      strict: false  #设置严格模式，默认false不启动。在未匹配到指定数据源时候会抛出异常（比如@DS字打错了），不启动则使用默认数据源。
      datasource:
        sjzt_web:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://127.0.0.1:3306/sjzt_web?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
          username: root
          password: password
        sjzt_eflow:
          driver-class-name: com.mysql.cj.jdbc.Driver
          url: jdbc:mysql://127.0.0.1:3306/sjzt_eflow?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
          username: root
          password: password
      druid:
        initial-size: 1
        max-active: 20
    druid:
      stat-view-servlet:
        enabled: true
        url-pattern: /druid/*
  autoconfigure:
      # 排除原生Druid的快速配置类
    exclude: com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceAutoConfigure
```

启动后可以在地址 /druid - 数据源中看到有`sjzt_web`、`sjzt_eflow`两个数据源，说明已经正确配置了 Mybatis Plus 多数据源，并集成了`druid`

> [springboot+druid+mybatis plus的多数据源配置_qqxhb 资源共享-CSDN博客](https://blog.csdn.net/qq_43792385/article/details/90764263)

# 在服务类配置数据源

默认使用默认数据源，只需给使用非默认数据源添加注解`@DS`，可以注解在方法上和类上，同时存在方法注解优先于类上注解。注解在service实现或mapper接口方法上，不要同时在service和mapper注解。

SysDicServiceImpl.java，使用`@DS`注解制定使用的数据源

```java
@Service
@DS("sjzt_web")
public class SysDicServiceImpl extends ServiceImpl<SysDicMapper, SysDic> implements ISysDicService {

    @Autowired
    SysDicMapper mapper;

    @Override
    public Page<SysDic> listByObj(IPage<SysDic> page, SysDic info) {
        page.setRecords(mapper.listByObj(page, info));
        return (Page<SysDic>) page;
    }
}
```

单元测试

```java
@SpringBootTest
class MybatisPlusMultiDatasourceTest1ApplicationTests {

    @Autowired
    ISysDicService sysDicService;

    @Test
    void contextLoads() {
        System.out.println(JSON.toJSONString(sysDicService.query().eq("pid" ,3).orderByAsc("sort").list()));

        SysDic sysDic = new SysDic();
        sysDic.setSearch("test");
        System.out.println(JSON.toJSONString(sysDicService.listByObj(new Page<>(1, 2), sysDic)));
    }
}
```

单元测试正常查询到数据

# 从连接池获取连接

测试控制器，传入参数`dbName`：数据库名、`tableName`：表名，从中查询`name`字段

```java
@Controller
@RequestMapping("/sysDic")
public class SysDicController {

    @RequestMapping("")
    @ResponseBody
    public Object index(@RequestParam(required = false) String dbName, @RequestParam String tableName){

        // 获取Mybatis Plus的DynamicRoutingDataSource
        DynamicRoutingDataSource dataSource = BeanUtils.getBean(DynamicRoutingDataSource.class);
        Connection conn = null;
        try {
            conn = dataSource.getDataSource(dbName).getConnection();
            String sql = "select * from " + tableName;
            PreparedStatement stmt = conn.prepareStatement(sql);

            ResultSet resultset = stmt.executeQuery();
            while(resultset.next()) {
                System.out.printf("%s\n", resultset.getObject("name").toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            JDBCUtils.closeConn(conn);
        }
        return "test1";
    }
}
```

> ```java
> public class DynamicRoutingDataSource extends AbstractRoutingDataSource {
> 
>     private Map<String, DataSource> dataSourceMap = new LinkedHashMap<>();
> 
>     private Map<String, DynamicGroupDataSource> groupDataSources = new ConcurrentHashMap<>();
> 
>     @Override
>     public DataSource determineDataSource() {
>         //从本地线程获取key解析最终真实的数据源
>      ●  String dsKey = DynamicDataSourceContextHolder.peek();
>         return getDataSource(dsKey);
>     }
> 
>     private DataSource determinePrimaryDataSource() {
>         log.debug("从默认数据源中返回数据");
>         return groupDataSources.containsKey(primary) ? groupDataSources.get(primary).determineDataSource() : dataSourceMap.get(primary);
>     }
> 
>     public DataSource getDataSource(String ds) {
>         if (StringUtils.isEmpty(ds)) {
>             return determinePrimaryDataSource();
>         } else if (!groupDataSources.isEmpty() && groupDataSources.containsKey(ds)) {
>             log.debug("从 {} 组数据源中返回数据源", ds);
>             return groupDataSources.get(ds).determineDataSource();
>         } else if (dataSourceMap.containsKey(ds)) {
>             log.debug("从 {} 单数据源中返回数据源", ds);
>             return dataSourceMap.get(ds);
>         }
>         return determinePrimaryDataSource();
>     }
> }
> ```
> 
> [调试源码（免费） · dynamic-datasource · 看云 (kancloud.cn)](https://www.kancloud.cn/tracy5546/dynamic-datasource/2264597)

分别传入`sjzt_eflow`/`t_user`和`sjzt_web`/`sys_dic`，可以在控制台看到表数据，而交叉则不行，说明已经通过`DynamicRoutingDataSource.getDataSource`正确获取到连接

在 /druid - 数据库 页面可以看到使用逻辑打开/关闭连接，说明确实在使用`druid`连接池了

| 逻辑连接打开次数   | 12  | 产生的逻辑连接建立总数 |
| ---------- | --- | ----------- |
| 逻辑连接关闭次数   | 12  | 产生的逻辑连接关闭总数 |
| 逻辑连接错误次数   | 0   | 产生的逻辑连接出错总数 |
| 逻辑连接回收重用次数 | 0   | 逻辑连接回收重用次数  |
| 物理连接打开次数   | 1   | 产生的物理连接建立总数 |
| 物理关闭数量     | 1   | 产生的物理关闭总数   |
| 物理连接错误次数   | 0   |             |
