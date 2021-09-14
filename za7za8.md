### git 重置为本地的最新版本

git reset --hard head

### Android 使用本地的依赖仓库

build.gradle:project

```
allprojects {
    repositories {
        maven {
            url "https://gitee.com/lyml/Jitsi-Maven-Repository/raw/master/releases"
        }
    }
}
```

build.grade:module

```
implementation ('org.jitsi.react:jitsi-meet-sdk:3.9.1') { transitive = true }
```

### 编译 jitsi Android SDK

ubuntu-18.04

jdk1.8、node v12、npm v6、Android SDK

##### 安装 node v12、npm v6

