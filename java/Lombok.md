# Lombok

Lombok 所有特性：[Stable (projectlombok.org)](https://projectlombok.org/features/)

# @EqualsAndHashCode

> Any class definition may be annotated with `@EqualsAndHashCode` to let lombok generate implementations of the `equals(Object other)` and `hashCode()` methods. By default, it'll use all non-static, non-transient fields, but you can modify which fields are used (and even specify that the output of various methods is to be used) by marking type members with `@EqualsAndHashCode.Include` or `@EqualsAndHashCode.Exclude`. Alternatively, you can specify exactly which fields or methods you wish to be used by marking them with `@EqualsAndHashCode.Include` and using `@EqualsAndHashCode(onlyExplicitlyIncluded = true)`.
>
> 一个类可以声明`@EqualsAndHashCode`让lombok生成`equals(Object other)` 和`hashCode()`方法
>
> - 默认使用非static、非transient属性，可以使用方法输出
> - `@EqualsAndHashCode.Include`排除属性
> - `@EqualsAndHashCode.Exclude`包含属性，可以指定方法输出
> - `@EqualsAndHashCode(onlyExplicitlyIncluded = true)`仅明确包含的属性
> - `callSuper`属性可以指定包含父类属性，默认false
>
> [@EqualsAndHashCode (projectlombok.org)](https://projectlombok.org/features/EqualsAndHashCode)

### `callSuper`的“坑点”

> Setting `callSuper` to *true* when you don't extend anything (you extend `java.lang.Object`) is a compile-time error, because it would turn the generated `equals()` and `hashCode()` implementations into having the same behaviour as simply inheriting these methods from `java.lang.Object`: only the same object will be equal to each other and will have the same hashCode.
>
> 如果对一个没有父类（即父类为java.lang.Object）指定为true时，IDE将报编译时错误，因为这相当于简单的继承java.lang.Object：只有同一个的对象之间才会相等和具有相同的hashCode。

java.lang.Object equals方法的实现是判断两个对象引用是否相同：

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

lombok默认根据子类对象属性是否相同，这也是`equals`的本意：

- 两个对象拥有完全相同的子类属性，`equals`返回true
- 如果指定`callSuper=true`，两个对象拥有完全相同的子类和父类属性，`equals`返回true

所以lombok可以满足大多数时候判断对象相同的需求，而**当希望比较对象的引用是否相同时，应使用`==`，而不是`equals`方法**

##### 坑点1：

`org.apache.commons.lang3.ArrayUtils`的`public static int indexOf(Object[] array, Object objectToFind, int startIndex)`方法，注意它**使用`equals`判断对象是否相同**

```java
public static int indexOf(Object[] array, Object objectToFind, int startIndex) {
    if (array == null) {
        return -1;
    } else {
        if (startIndex < 0) {
            startIndex = 0;
        }

        int i;
        if (objectToFind == null) {
            for(i = startIndex; i < array.length; ++i) {
                if (array[i] == null) {
                    return i;
                }
            }
        } else {
            for(i = startIndex; i < array.length; ++i) {
                if (objectToFind.equals(array[i])) {
                    return i;
                }
            }
        }

        return -1;
    }
}
```

如果一定要判断引用是否相同，应用`==`实现：

```java
public static <T> int indexOf(T[] ts, T t) {
    int index = -1;
    if(ts != null) {
        for(int i = 0; i < ts.length; i++) {
            if(ts[i] == t) {
                return i;
            }
        }
    }
    return index;
}
```

