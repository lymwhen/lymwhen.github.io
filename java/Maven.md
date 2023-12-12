# Maven



# 依赖分析

### 项目依赖库

idea Project 窗口中，`External Libraries`中会列出项目所有的依赖库。

鼠标移到类上方，会显示这个类来自的库。

### 库来自的包

这一点在处理依赖冲突很有用。

```bash
# 查看依赖树
mvn dependency:tree
[INFO] com.chunshu:xhgyyq:war:0.0.1-SNAPSHOT
[INFO] +- com.squareup.okhttp3:okhttp:jar:4.10.0:compile
[INFO] |  +- com.squareup.okio:okio-jvm:jar:3.0.0:compile
[INFO] |  |  +- org.jetbrains.kotlin:kotlin-stdlib-jdk8:jar:1.6.10:compile
[INFO] |  |  |  \- org.jetbrains.kotlin:kotlin-stdlib-jdk7:jar:1.6.10:compile
[INFO] |  |  \- org.jetbrains.kotlin:kotlin-stdlib-common:jar:1.6.10:compile
[INFO] |  \- org.jetbrains.kotlin:kotlin-stdlib:jar:1.6.10:compile
[INFO] |     \- org.jetbrains:annotations:jar:13.0:compile
```

树中包的构成为：`groupId`:`artifactId`:`类型`:`version`:`scope(范围)`

排除包：

```xml
<!-- https://mvnrepository.com/artifact/com.squareup.okhttp3/okhttp -->
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.10.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### 依赖顺序

> 将SM3的依赖放在冲突的依赖前面。这样在import的时候就会默认全都选择这个1.60版本依赖导入了，就不会出现这个签名不正确的问题。
>
> [SM3国密加密时报错 java.lang.SecurityException: class “org.bouncycastle.crypto.digests.GeneralDigest“_sm3 jar包-CSDN博客](https://blog.csdn.net/jcj_gyjf/article/details/123660032)

神乎其技的办法

##### SM3 报`java.lang.SecurityException: class “org.bouncycastle.crypto.digests.GeneralDigest“`

将依赖写在前面

```xml
<!-- https://mvnrepository.com/artifact/org.bouncycastle/bcprov-jdk18on -->
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk18on</artifactId>
    <version>1.77</version>
</dependency>
```

