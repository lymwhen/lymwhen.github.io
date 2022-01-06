# 集成 Mybatis-Plus 3

> [CRUD 接口](https://baomidou.com/pages/49cc81/#service-crud-%E6%8E%A5%E5%8F%A3)
>
> [条件构造器](https://baomidou.com/pages/10c804/)

### 与2版本的差别

- xxById方法名变更
- 条件构造器
- xml中使用参数
  - 仅有一个参数时，可直接使用参数名或对象/map中的键，如$`{dicId}`
  - 有多个参数时（包括Page），不可直接使用对象/map中的键，应使用：`${info.search}`，其中`info`为`@Param`注解的值，无注解则使用参数名

# 常用方法

```java
// 条件构造查询
// service.query()返回条件构造器QueryChainWrapper
dicSetService.query().eq("dicId", 821191L).list();
dicSetService.query().eq("dicId", 821191L).count();

// saveOrUpdate:save
DicSet ds = new DicSet();
ds.setDicId(821191L);
ds.setName("测试");
ds.setOrgId("test");
ds.setSort(1L);
ds.setState(1);
dicSetService.saveOrUpdate(ds);
// saveOrUpdate:update
ds.setName("测试1");
dicSetService.saveOrUpdate(ds);

// xxById
dicSetService.getById(3029L);
dicSetService.removeById(3029L);

// 条件构造删除
// service.update()返回条件构造器UpdateChainWrapper，用于删除或更新
dicSetService.update().eq("dicId", 821191L).eq("para", "k").remove();

// xml查询
DicSet ds = new DicSet();
ds.setDicId(821191L);
ds.setSearch("全");
dicSetService.listByObj(ds);

// xml分页查询
dicSetService.listByObj(new Page<DicSet>(2, 1), ds);

// xml @Param 查询
dicSetMapper.listByObjTest(821191L, "全")));

// xml map对象查询
System.out.println("xml4: ");
Map<String, Object> map = new HashMap<>();
map.put("dicId", 821191L);
map.put("search", "全");
dicSetMapper.listByObjTest(map);
```

# 特殊条件构造

### 包裹逻辑

```java
query().eq("appId", info.getId())
    .and(i -> i.apply("(type = 3 and toCode = {0})", orgCode)
        .or().apply("(type = 2 and (toCode = {0} or {0} like concat('%/', toCode)))", unitCode)
        .or().apply("(type = 3 and toCode = {0})", userCode))
    .exists()
```
```sql
SELECT COUNT( * ) FROM media_notificationto WHERE (appId = ? AND (
      (type = 3 and toCode = ?) 
      OR (type = 2 and (toCode = ? or ? like concat('%/', toCode)))
      OR (type = 3 and toCode = ?)
    )
  )
```