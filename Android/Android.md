# Android

# 系统

### 保持背光常量

View 添加属性：
```xml
android:keepScreenOn="true"
```

> [!NOTE]
> 必须是可见的 View

> [Android保持背光常亮的设置方法](https://blog.csdn.net/csy288/article/details/8235585)

### 应用内亮度最高

```java
// 改变屏幕亮度
public static void setBrightness(Activity activity, int brightValue) {
    WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
    lp.screenBrightness = (brightValue <= 0 ? -1.0f : brightValue / 255f);
    activity.getWindow().setAttributes(lp);
}

@Override
public void onResume() {
    SystemBrightManager.setBrightness(this, 255);

    super.onResume();
}

@Override
public void onPause() {
    SystemBrightManager.setBrightness(this, -1);

    super.onPause();
}
```

> [!NOTE]
> 亮度设置为 -1 表示恢复系统亮度

# 调试

### ADB 网络调试

连接数据项，开启网络调试端口

```bash
adb tcpip 5555
```

将手机与电脑连接到同一网络

```bash
adb connect 192.168.3.62
# 关闭连接
adb disconnect 192.168.3.62
```

> [!TIP]
> 默认网络调试端口：5555

# 报错

### Manifest merger failed with multiple errors, see logs

```bash
gradlew processDebugManifest --stacktrace
# 可以看到更多信息用:
gradlew processDebugManifest --stacktrace -info -scan -debug
```

如：
```
Element uses-feature#android.hardware.camera.autofocus at AndroidManifest.xml:42:5-44:36 duplicated with el
```
AndroidManifest.xml 中`android.hardware.camera.autofocus`权限重复

### 打包报 Cannot find a version of ‘com.android.support:support-annotations‘ ... 'com.android.support:support-annotations:28.0.0'

app build.gradle 中在`android`中加入：
```gradle
lintOptions {
    checkReleaseBuilds false
    abortOnError false
}
```

> [Cannot find a version of ‘com.android.support:support-annotations‘ that...](https://blog.csdn.net/weixin_54615356/article/details/112858578)

### 修改包名后 adb 运行报 Error: Activity class {com.xxxx.jdspad/com.xxxx.mtxxclasscard.SplashActivity} does not exist.

删除 module build.gradle 中 `android.defaultConfig.applicationId`，不行再删除app下的`build`文件夹

### /lib/arm/libVoAACEncoder.so" has text relocations

/lib/arm/libVoAACEncoder.so" has text relocations 
(https://android.googlesource.com/platform/bionic/+/master/android-changes-for-ndk-developers.md#Text-Relocations-Enforced-for-API-level-23)

so动态链接库的代码并非PIC（Position independent code）

将应用 API level 改为22

> [lib/arm/libVoAACEncoder.so has text relocations问题的解决方案](https://blog.csdn.net/yf1252555020/article/details/83616494)

代码按照报错的信息处理，如：

- `findViewById`强制类型转换
- 安装apk文件方式
- 无需申请权限
- implementation 'com.android.support:appcompat-v7:26.1.0' 版本改为 `22+`
- 删除一些控件不支持的属性，如`roundIcon`