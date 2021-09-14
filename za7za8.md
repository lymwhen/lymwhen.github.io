

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

