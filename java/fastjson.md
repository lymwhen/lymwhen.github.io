# fastjson

# json 对象/字符串转换

```java
// 字符串转数组
JSONArray subjectContent = JSONArray.parseArray(res);
// 字符串转对象
Leave leave = JSONObject.parseObject(res, new TypeReference<Leave>() {});
List<ClassSet> classes = JSONObject.parseObject(res, new TypeReference<List<ClassSet>>() {});
JSONObject[][][] courseTable = JSONObject.parseObject(res, new TypeReference<JSONObject[][][]>() {});
// 对象转字符串
JSON.toJSONString(obj);
```

# 注解

```java
// 忽略属性
@JSONField(serialize = false)
public ACSubject subject;
```

# SerializeFilter 序列化过滤器

> - PropertyPreFilter 根据PropertyName判断是否序列化；
> - PropertyFilter 根据PropertyName和PropertyValue来判断是否序列化；
> - NameFilter 修改Key，如果需要修改Key，process返回值则可；
> - ValueFilter 修改Value；
> - BeforeFilter 序列化时在最前添加内容；
> - AfterFilter 序列化时在最后添加内容。
>
> [fastjson（五）通过SerializeFilter定制序列化-CSDN博客](https://blog.csdn.net/liupeifeng3514/article/details/79167734)

将 byte[] 字段显示为 16 进制

```java
@Override
public String toString() {
    return JSON.toJSONString(this, new ValueFilter() {
        @Override
        public Object process(Object object, String name, Object value) {
            if(value instanceof byte[]) {
                return ByteUtils.unsignedBytes2String(16, (byte[]) value);
            }
            return value;
        }
    });
}
```



# 疑难问题

### json 字符串转对象时 get/set 方法、构造方法的影响

字符串属性值仅通过`public`修饰的 set 方法和构造方法传入，两者可配合使用；**仅通过`public`修饰的属性不会获得值**。

保证正常转换的方法

```java
// 通过构造方法
public class T1{
	private String name;
    private int age;
    
	public T1(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

```java
// 通过set方法
public class T1{
	private String name;
    private int age;
    
    public void setName(String name){
        this.name = name;
    }
    
    public void setAge(int age){
        this.age = age;
    }
}
```

> [!TIP]
>
> 如果一个属性只通过 set 方法传入时，应保证有空的构造方法（众所周知，如果写了带参数的构造方法，需要空的构造方法应手动写出）

### 类修饰符

经测试内部类转换时属性为`null`，应由`public`修饰类

### fastjson2 序列化枚举问题

fastjson2 有的版本处理枚举时，会将枚举处理为自定义的“value”，如果需要使用名称，需要配置`JSONWriter.Feature`使用`toString方法`：`JSONWriter.Feature.WriteEnumUsingToStrings`

```java
// 设置fastjson2 features
JSON.config(
    JSONWriter.Feature.WriteMapNullValue, 
    JSONWriter.Feature.WriteNullNumberAsZero, 
    JSONWriter.Feature.WriteNullStringAsEmpty,
    JSONWriter.Feature.WriteNullListAsEmpty, 
    JSONWriter.Feature.WriteNullBooleanAsFalse, 
    JSONWriter.Feature.WriteEnumUsingToString
);
```

