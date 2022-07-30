# Android

# 系统

取消 EditText 自动获得焦点，如打开一个 有 EditText 的 Activity 的时候，不要软键盘立马就弹出来

在父级控件中加入

```xml
android:focusable="true" 
android:focusableInTouchMode="true"
```

[Android取消EditText自动获取默认焦点 - 百度文库 (baidu.com)](https://wenku.baidu.com/view/05e62f40021ca300a6c30c22590102020740f2ad.html)

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

### 剪切板

##### 复制到剪切板

```java
//获取剪贴板管理器：
ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
// 创建普通字符型ClipData
ClipData mClipData = ClipData.newPlainText("Label", "这里是要复制的文字");
// 将ClipData内容放到系统剪贴板里。
cm.setPrimaryClip(mClipData);
```

> [Android----复制到剪切板 - 简书 (jianshu.com)](https://www.jianshu.com/p/1e84d33154bd)

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

# ADB 命令

```bash
# adb设备列表
adb devices
# 进入shell
adb shell
```

### shell 命令

```bash
# root
su
# 所有应用列表
pm list package
# 停用应用
pm disable-user com.edu.xxx
# 启用应用
pm enable com.edu.xxx

# 启动activity
am start com.xxx.xxxx/.SplashActivity
# 查看前台activity
dumpsys activity | grep -i run
# 导出apk
platform-tools>adb shell pm path net.ossrs.flutter_live_example
package:/data/app/~~hPzRSKuT3wQJdF-_OdNwng==/net.ossrs.flutter_live_example-29dYs9vez7LfOG2uGvHNig==/base.apk
platform-tools>adb pull /data/app/~~hPzRSKuT3wQJdF-_OdNwng==/net.ossrs.flutter_live_example-29dYs9vez7LfOG2uGvHNig==/base.apk C:\Users\lymly\
/data/app/~~hPzRSKuT3wQJdF-_OdNwng==/net.ossrs.flutter_liv...le pulled, 0 skipped. 36.5 MB/s (44790407 bytes in 1.170s)
```

> [!TIP]
>
> shell 命令也可以在不进入 shell 时使用`adb shell pm list package`执行

> [!NOTE]
>
> shell 执行禁用等命令时报错：`Error:java.lang.SecurityException:PermissionDenial:attempttochangecomponentstatefrompid=10941,uid=2000,packageuid=10040`，说明权限不足，需要 root 权限

> [adb查看手机中已安装的应用列表_夜瑾漠的博客-CSDN博客](https://blog.csdn.net/weixin_38515203/article/details/90718733)
>
> [Android通过adb shell命令查看当前与用户交互的前台Activity_IT先森的博客-CSDN博客_adb命令查看当前activity](https://blog.csdn.net/tkwxty/article/details/108484512)
>
> [ADB - 无需root禁用系统APP+关闭系统应用广告 - Citrusliu - 博客园 (cnblogs.com)](https://www.cnblogs.com/citrus/p/12961113.html)
>
> [adb指令禁用软件_Android免root禁用系统应用（adb停用安卓系统应用）_Lo-FiGames的博客-CSDN博客](https://blog.csdn.net/weixin_28936835/article/details/111923940)
>
> [Android adb启动任意app的几种方式_Ang_qq_252390816的博客-CSDN博客_adb打开app](https://blog.csdn.net/ezconn/article/details/99885715)
>
> [adb 命令大全（简洁明了）adb命令启动应用_ihoudf的博客-CSDN博客_adb启动应用](https://blog.csdn.net/HDFQQ188816190/article/details/98599940)

# Gradle

### 使用代理

查看 v2rayN 的本地 http 端口

```properties
# gradle.properties
systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=10809
```



### 运行旧项目

根据 IDE 报错更改 gradle 版本号，如 2022-07-23，gradle 最低 4.6，`com.android.tools.build:gradle`最低 3.2.0

gradle

```properties
# gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-4.6-bin.zip
```

`com.android.tools.build:gradle`

```nginx
# build.gradle (Project)
buildscript {
    dependencies {
        classpath 'com.android.tools.build:gradle:3.2.0'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}
```



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