# List 和 Array

List：java.util.List

Array：int[]、String[]等

### 初始化

```java
// Array
int[] arr = new int[2];
arr[0] = 1;

int[] arr = new int[]{1, 2};

// List
List<Integer> list = new ArrayList<>();
list.add(1);

List<Integer> list = new ArrayList<Integer>(){{
    add(1);
    add(2);
}};
```

### 复制

```java
// Array
// 左闭右开区间[0, 2)，即复制0, 1两项
byte[] bytes = Arrays.copyOfRange(bytes, 0, 2);
// 全部复制
byte[] bytes = Arrays.copyOfRange(bytes, 0, bytes.length);
byte[] bytes = Arrays.copyOfRange(bytes);

// List
// 左闭右开区间[0, 2)，即复制0, 1两项   
List<Integer> list = list0.subList(0, 2);
// 全部复制
List<Integer> list = list0.subList(0, list0.size());
```

### 转换

```java
// Array转List
List<Integer> list = Arrays.asList(new Integer[]{1, 2});
List<Integer> list = Arrays.asList(1, 2);

// List转Array
Integer[] arr = new ArrayList<Integer>(){{
    add(1);
    add(2);
}}.toArray(new Integer[0]);

// Array逗号隔开
String ss = String.join(",", arr)
```

> [java中List和Array相互转换 - 古兰精 - 博客园 (cnblogs.com)](https://www.cnblogs.com/goloving/p/7740100.html)
