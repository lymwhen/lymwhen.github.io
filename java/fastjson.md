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

> 如果一个属性只通过 set 方法传入时，应保证有空的构造方法（众所周知，如果写了带参数的构造方法，需要空的构造方法应手动写出）

### 类修饰符

经测试内部类转换时属性为`null`，应由`public`修饰类

