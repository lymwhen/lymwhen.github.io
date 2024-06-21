# Stream 流

`Stream`是 JDK8 新增的接口，不像集合`Collection`用于有效管理和访问元素，流用于对结合进行管道式处理和集合运算，有利于简化代码和提高计算效率。

### 链式操作

[distinct](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#distinct--)：不同的元素流

[filter](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#filter-java.util.function.Predicate-)：符合断言`Predicate`的元素流

[flatMap](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#flatMap-java.util.function.Function-)：展平

[flatMapToDouble](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#flatMapToDouble-java.util.function.Function-)：展平为 double 流

[flatMapToInt](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#flatMapToInt-java.util.function.Function-)：展平为 int 流

[flatMapToLong](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#flatMapToLong-java.util.function.Function-)：展平为 long 流

[limit](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#limit-long-)：截断流

[map](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#map-java.util.function.Function-)：给定`Function`返回的元素的流

[mapToDouble](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#mapToDouble-java.util.function.ToDoubleFunction-)：给定`Function`返回的 double 流

[mapToInt](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#mapToInt-java.util.function.ToIntFunction-)：给定`Function`返回的 int 流

[mapToLong](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#mapToLong-java.util.function.ToLongFunction-)：给定`Function`返回的 long 流

[peek](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#peek-java.util.function.Consumer-)：消费者`Customer`对每个元素

[skip](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#skip-long-)：丢弃前n个元素

[sorted](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#sorted-java.util.Comparator-)：根据比较器`Comparator`排序

### 动态规约结果

[collect](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#collect-java.util.stream.Collector-)：动态规约操作

### 元素结果（`Optional`）

[findAny](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#findAny--)：任意一个

[findFirst](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#findFirst--)：第一个

[max](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#max-java.util.Comparator-)：根据比较器`Comparator`的最大元素

[min](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#min-java.util.Comparator-)：根据比较器`Comparator`的最小元素

[reduce](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#reduce-java.util.function.BinaryOperator-)：根据累加器`BinaryOperator`聚合

### boolean 结果

[allMatch](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#allMatch-java.util.function.Predicate-)：所有元素满足断言`Predicate`

[anyMatch](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#anyMatch-java.util.function.Predicate-)：任意元素满足断言`Predicate`

[noneMatch](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#noneMatch-java.util.function.Predicate-)：没有一个元素断言`Predicate`

### 数值结果

[count](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#count--)：元素数量

[reduce](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#reduce-java.util.function.BinaryOperator-)：根据初始值和累加器`BinaryOperator`聚合

### 基本数据类型流特有的操作

如`Arrays.stream(new Int[])`可以创建一个`IntStream`

[mapToObj](https://docs.oracle.com/javase/8/docs/api/java/util/stream/IntStream.html#mapToObj-java.util.function.IntFunction-)：返回一个对象类型的流

### 其他实例方法

[forEach](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#forEach-java.util.function.Consumer-)：循环（不保证顺序）

[forEachOrdered](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#forEachOrdered-java.util.function.Consumer-)：循环（按照顺序）

[toArray](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#toArray-java.util.function.IntFunction-)：返回`Object`或指定类型的数组

##### 静态方法

[concat](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#concat-java.util.stream.Stream-java.util.stream.Stream-)：连接两个流

[empty](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#empty--)：返回一个空的流

[generate](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#generate-java.util.function.Supplier-)：由一个生产者`Supplier`生成无限无序的流，一般用于生成随机流

[iterate](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#iterate-T-java.util.function.UnaryOperator-)：使用初始种子生成无限有序的流

[of](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html#of-T...-)：使用一个或多个元素构造流

> [Stream (Java Platform SE 8 ) (oracle.com)](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)

> [!TIP]
>
> 默认的流都是并行流，即元素会被多线程处理，串行流：
>
> ```java
> list.parallelStream()
> list.stream().parallel()
> ```

> [!NOTE]
>
> `Stream`实现了`AutoCloseable`接口，即流在最终操作（terminal operation）后，流会自动关闭，但链式操作不会。
>
> ```java
> Stream<Integer> s1 = Stream.of(1,2,3,4);
> s1 = s1.filter(v -> v % 2 == 0);
> s1 = s1.map(v -> v * 2);
> System.out.println(s1.reduce(Integer::sum).get());
> // 12
> ```
>
> [jdk1.8新特性：stream流 报错：stream has already been operated upon or closed-CSDN博客](https://blog.csdn.net/qq_20446879/article/details/120111221)

### 示例

```java
List<A> list = Stream.of(new A("张一", 12), new A("张二", 13), new A("张三", 10)).collect(Collectors.toList());
```

```java
list.stream().filter(v -> v.age == 12).collect(Collectors.toList());
// filter：[{"age":12,"name":"张一"}]

list.stream().peek(v -> v.age += 1).collect(Collectors.toList());
list.stream().peek(v -> v.age -= 1).collect(Collectors.toList());
// peek：[{"age":13,"name":"张一"},{"age":14,"name":"张二"},{"age":11,"name":"张三"}]
// peek：[{"age":12,"name":"张一"},{"age":13,"name":"张二"},{"age":10,"name":"张三"}]

list.stream().map(v -> v.name).collect(Collectors.toList());
// map：["张一","张二","张三"]
list.stream().map(v -> {
    Map<String, Object> m = new HashMap<>();
    m.put("name", v.name);
    m.put("age", v.age);
    return m;
}).collect(Collectors.toList());
// map：[{"name":"张一","age":12},{"name":"张二","age":13},{"name":"张三","age":10}]

list.stream().map(v -> v.name).collect(Collectors.joining("、"));
// collect："张一、张二、张三"

list.stream().allMatch(v -> v.age > 10);
// allMatch：false
list.stream().allMatch(v -> v.age >= 10);
// allMatch：true
list.stream().anyMatch(v -> v.age <= 10);
// anyMatch：true

list.stream().findAny().orElse(new A("张四", 15));
// findAny：{"age":12,"name":"张一"}
Stream<A>.empty().findAny().orElse(new A("张四", 15));
// findAny：{"age":15,"name":"张四"}

list.stream().flatMap(v -> new ArrayList<A>() {{add(v);add(new A("张四", 18));}}.stream()).collect(Collectors.toList());
// flatMap：[{"age":12,"name":"张一"},{"age":18,"name":"张四"},{"age":13,"name":"张二"},{"age":18,"name":"张四"},{"age":10,"name":"张三"},{"age":18,"name":"张四"}]

Random r = new Random();
Stream.generate(() -> new A("张四", r.nextInt(29))).limit(6).collect(Collectors.toList());
// generate/limit：[{"age":8,"name":"张四"},{"age":24,"name":"张四"},{"age":8,"name":"张四"},{"age":28,"name":"张四"},{"age":15,"name":"张四"},{"age":21,"name":"张四"}]

list.stream().max((a, b) -> a.age - b.age).get();
list.stream().max(Comparator.comparingInt(a -> a.age)).get();
// max：{"age":13,"name":"张二"}

Stream.of(1, 2, 3).reduce((a, b) -> a + b).get();
Stream.of(1, 2, 3).reduce(Integer::sum).get();
// reduce：6
Stream.of(1, 2, 3).reduce(0, (a, b) -> a + b);
// reduce：6
list.stream().reduce(0, (i, a) -> i + a.age, (a, b) -> a + b);
// reduce：35
list.stream().reduce(new ArrayList<A>(), (i, a) -> {
    i.add(a);
    return i;
}, (i, i1) -> {
    i.addAll(i1);
    return i;
});
// reduce：[{"age":12,"name":"张一"},{"age":13,"name":"张二"},{"age":10,"name":"张三"}]

list.stream().filter(v -> v.age > 10).toArray(A[]::new);
// toArray：{"age":12,"name":"张一"}{"age":13,"name":"张二"}
```

### reduce （聚合）三个重载的解释

```java
Optional<T>	reduce(BinaryOperator<T> accumulator);
T			reduce(T identity, BinaryOperator<T> accumulator);
<U> U		reduce(U identity, BiFunction<U,? super T,U> accumulator, BinaryOperator<U> combiner)
```

##### 第一重载

使用累加器聚合，由于流可能为空，所以返回`Optional<T>`。

累加器`accumulator.apply(T i, T a)`中，`i`为之前计算的累加数，`a`：当前元素

##### 第二重载

在第一重载的基础上，增加了默认值，避免保证了流为空的情况下没有元素参与聚合，所以返回`T`

> [!NOTE]
>
> 官方文档指出了参数`T identity`的两个重要使用原则：
>
> 1. 它应该被理解为默认值，而非累加的起始值
>
> 此重载等效于：
>
> ```java
> T result = identity;
> for (T element : this stream)
>     result = accumulator.apply(result, element)
> return result;
> ```
>
> 2. 它的值应该被严格规定，对于所有的`t`（stream种的元素），必须满足 `accumulator.apply(identity, t)`
>
> 综上，`T identity`会参与聚合计算，但它只应该作为默认值使用，否则并行计算时，结果会出错。例如进行累加计算，那么它的值应该是`0`。

##### 第三重载

在第二重载的基础，默认值`identity`的类型不限定为流元素`T`，可自由指定为`U`，同`accumulator.apply`第一参数、返回值。例如可以求流元素的某一属性值的和，并使用`Integer`返回。

第三参数`BinaryOperator<U> combiner`看似很费解，测试也感觉貌似没有用，事实上，它是**对第三重载聚合结果类型自由指定特性在并行计算时的必要补充**。官方文档上`identity`/`u`/`t`/`accmulator`/`combiner`的关系：

```java
combiner.apply(u, accumulator.apply(identity, t)) == accumulator.apply(u, t)
```

恒等式具有以下含义：

- 等式中的`u`指两个或多个流元素`t`聚合的结果，简化来说就是`u + (identity + t) == u + t`，即默认值`U identity`的使用原则同第二重载
- 第三参数的意义：第二重载累加器为`T accumulator.apply(T, T)`，即两个`t`聚合成一个`t`，并行计算时每个线程都累加产生一个`t`，聚合成最终结果`t`时，同样适用这个累加器；第三重载累加器为`U accumulator.apply(U, T)`，即`u`和`t`聚合成`u`，并行计算时每个线程都累加产生一个`u`，聚合成最终结果`u`时，就需要指定一个`U combiner.apply(U, U)`的合并器了，只有多线程计算时，这个合并器才会被调用。

### distinct 适用于对象

`distinct`基于`equals`方法判断重复，`Integer`/`Long`/`String`等实现了`equals`方法，所以可以被排重。当我们自己的对象需要排重时，也需要在`equals`方法中实现重复逻辑。
