# Lombok

Lombok 所有特性：[Stable (projectlombok.org)](https://projectlombok.org/features/)

# 配置文件

> You can create `lombok.config` files in any directory and put configuration directives in it. These apply to all source files in this directory and all child directories.
>
> 可以在任意文件夹创建`lombok.config`文件，它将作用于这个当前文件夹和所有子文件夹
>
> Usually, a user of lombok puts a `lombok.config` file with their preferences in a workspace or project root directory, with the special `config.stopBubbling = true` key to tell lombok this is your root directory. You can then create `lombok.config` files in any subdirectories (generally representing projects or source packages) with different settings.
>
> 通常可以把它放在工程根目录中，并配置`config.stopBubbling = true`告知lombok这是根目录（停止冒泡），也可以在子文件夹中创建`lombok.config`文件以使用不同的配置

```properties
config.stopBubbling = true
```

> [!ATTENTION]
>
> 修改了lombok的配置文件并不会立刻生效，IDEA中应 Build - Rebuild Project；服务端应重新部署全部 class 文件。

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

### `callSuper`

> Setting `callSuper` to *true* when you don't extend anything (you extend `java.lang.Object`) is a compile-time error, because it would turn the generated `equals()` and `hashCode()` implementations into having the same behaviour as simply inheriting these methods from `java.lang.Object`: only the same object will be equal to each other and will have the same hashCode.
>
> 如果对一个没有父类（即父类为java.lang.Object）指定为true时，IDE将报编译时错误，因为这相当于简单的继承java.lang.Object：只有同一个的对象之间才会相等和具有相同的hashCode。

java.lang.Object equals方法的实现是判断两个对象引用是否相同：

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

lombok默认根据子类对象属性是否相同：

- 两个对象拥有完全相同的子类属性，`equals`返回true
- 如果指定`callSuper=true`，两个对象拥有完全相同的子类和父类属性，`equals`返回true

在大多数时候，`equals`连同父类属性一起比较更合理一些，所以可以在`lombok.config`中配置：

```properties
lombok.equalsAndHashCode.callSuper=call
```

> ## Supported configuration keys:
>
> - `lombok.equalsAndHashCode.doNotUseGetters` = [`true` | `false`] (default: false)
>
>   If set to `true`, lombok will access fields directly instead of using getters (if available) when generating `equals` and `hashCode` methods. The annotation parameter '`doNotUseGetters`', if explicitly specified, takes precedence over this setting.
>
> - `lombok.equalsAndHashCode.callSuper` = [`call` | `skip` | `warn`] (default: warn)
>
>   If set to `call`, lombok will generate calls to the superclass implementation of `hashCode` and `equals` if your class extends something. If set to `skip` no such calls are generated. The default behaviour is like `skip`, with an additional warning.
>
> - `lombok.equalsAndHashCode.flagUsage` = [`warning` | `error`] (default: not set)
>
>   Lombok will flag any usage of `@EqualsAndHashCode` as a warning or error if configured.

lombok的`equals`符合`equals`方法的设计本意，而**当希望比较对象的引用是否相同时，应使用`==`，而不是`equals`方法**，因此可能造成一些坑点：

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

