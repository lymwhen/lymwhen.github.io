# VLC-Android

> [VLC Developers Corner - VideoLAN Wiki](https://wiki.videolan.org/VLC_Developers_Corner/)
>
> [Category:Building - VideoLAN Wiki](https://wiki.videolan.org/Category:Building/)
>
> [AndroidCompile - VideoLAN Wiki](https://wiki.videolan.org/AndroidCompile/)

# 脚本构建

##### 下载 Android SDK、NDK，并配置环境变量

Set **\$ANDROID_SDK** to point to your Android SDK directory

```bash
export ANDROID_SDK=/path/to/android-sdk
```

Set **\$ANDROID_NDK** to point to your Android NDK directory

```bash
export ANDROID_NDK=/path/to/android-ndk
```

Add some useful binaries to your **\$PATH**

```bash
export PATH=$PATH:$ANDROID_SDK/platform-tools:$ANDROID_SDK/tools
```

##### 下载源码

```bash
git clone https://code.videolan.org/videolan/vlc-android.git
```

如果 git 太慢可以在[VideoLAN / VLC-Android · GitLab](https://code.videolan.org/videolan/vlc-android)下载 zip 源码。

##### 在`local.properties`中配置 SDK、NDK 目录

```bash
sdk.dir=<SDK path from $ANDROID_SDK>
ndk.dir=<NDK path from $ANDROID_NDK>
```

##### 构建

```bash
buildsystem/compile.sh -a <ABI>
```

# Android Studio

用 Android Studio 要简单的多，可以在 windows 下进行。下载源码，打开

### 问题

##### Maven 下载包太慢

在 `project build.gradle` `buildscript.repositories` 中加入阿里云源

```bash
repositories {
    flatDir dirs: "gradle/plugins"
    maven { url 'https://maven.aliyun.com/nexus/content/repositories/google' }
    maven { url 'https://maven.aliyun.com/nexus/content/groups/public' }
    maven { url 'https://maven.aliyun.com/nexus/content/repositories/jcenter'}
    google()
    mavenCentral()
    mavenLocal()
}
```

##### Minimum supported Gradle version is 8.0.0. Current version is 7.5.1. If using the gradle wrapper, try editing the distributionUrl in....

gradle 插件版本过高，建议使用匹配的 gradle 版本，而不是降低插件版本，可能会遇到很多问题

`File - Project Structure - Project`，这里可以看到插件版本和使用的 gradle 版本

在 Gradle 版本中选择一个报错中最低版本以上的版本

##### Process 'command 'git'' finished with non-zero exit value 128

点击报错可的定位到位置

```java
def revision() {
    def code = new ByteArrayOutputStream()
    exec {
        commandLine 'git', 'rev-parse', '--short', 'HEAD'
        standardOutput = code
    }
    return code.toString()
}
```

这里有一个使用命令行 git 获取最新 commit id 简短结果的代码

```bash
git rev-parse --short HEAD
0316f0ab7
```

windows 下：

```bash
commandLine 'cmd', 'git', 'rev-parse', '--short', 'HEAD'
```

ubuntu 下前面加 `/bin/sh`、`/bin/bash`、`sh`都不管用，不知道怎么解决

---

也可以简单把它注释掉，返回空字符串

```java
def revision() {
    return ""
}
```

### 构建

解决以上问题后，就是等待漫长的下载包，大概下载 1600 个包之后，终于可以打包了，第一次打包时又要下载 80 个包。。。

##### 构建指定 ABI 安装包

在`application:app build.gradle` `android.defaultConfig`中加入

```java
ndk {
    // arm64-v8a、armeabi-v7a、x86_64、x86 中的一个或多个，用逗号隔开
    abiFilters 'armeabi-v7a' 
}
```

# 修改

找到想修改的地方最简单的办法是搜索界面的中文，如搜索`关于`，找到在 strings.xml 中的键`about`

- 使用`R.string.about`可以找到在 java 文件中引用的地方
- 使用`@string/about`可以找到在资源文件中引用的地方

### 样式

##### 视频信息背景改透明

找到播放器布局文件`application\vlc-android\res\layout\player_hud.xml`

视频信息背景为`@drawable/rounded_corners`，打开文件，将背景改为透明

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:shape="rectangle">
    <solid android:color="@color/transparent">
    </solid>
    <corners android:radius="5dp">
    </corners>

</shape>
```

### 在 TV 首页加入重启

使用 SMB 协议偶尔抽风会一直要输密码，在首页加个重启方便点

> [!TIP]
>
> 制作一个风格差不多的图标
>
> ![ic_menu_quit](assets/ic_menu_quit.png)

首页`application\television\src\main\java\org\videolan\television\ui\MainTvFragment.kt`，在`override fun onViewCreated(view: View, savedInstanceState: Bundle?)`方法中添加最下方的功能菜单，在关于前面加上这个菜单

```java
otherAdapter.add(GenericCardItem(ID_QUIT, "重新启动", "", R.drawable.ic_menu_quit, R.color.tv_card_content_dark));
otherAdapter.add(GenericCardItem(ID_ABOUT_TV, getString(R.string.about), "${getString(R.string.app_name_full)} ${BuildConfig.VLC_VERSION_NAME}", R.drawable.ic_menu_info_big, R.color.tv_card_content_dark))
```

点击事件在`override fun onItemClicked(itemViewHolder: Presenter.ViewHolder?, item: Any?, rowViewHolder: RowPresenter.ViewHolder?, row: Row?)`方法中处理，加上对`ID_QUIT`的处理

```java
ID_QUIT -> android.os.Process.killProcess(android.os.Process.myPid())
ID_ABOUT_TV -> activity.startActivity(Intent(activity, AboutActivity::class.java))
```

重启的方法参考`设置 - 高级`里的重启`application\vlc-android\src\org\videolan\vlc\gui\preferences\PreferencesAdvanced.kt`

### 在播放界面加个视频信息按钮

Activity：`application\vlc-android\src\org\videolan\vlc\gui\video\VideoPlayerActivity.kt`

布局：`application\vlc-android\res\layout\player_hud.xml`

基本功能的逻辑都在这个 Activity 控制，高级功能在`application\vlc-android\src\org\videolan\vlc\gui\helpers\PlayerOptionsDelegate.kt`，Activity 持有他的引用

##### 在布局增加按钮

```xml
<ImageView
    android:id="@+id/player_overlay_video_info"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginEnd="@dimen/small_margins_sides"
    android:background="?attr/selectableItemBackgroundBorderless"
    android:clickable="true"
    android:contentDescription="视频信息"
    android:focusable="true"
    android:onClick="@{(v) -> player.showStats()}"
    android:scaleType="center"
    tools:visibility="visible"
    vlc:layout_constraintBottom_toBottomOf="@+id/player_overlay_play"
    vlc:layout_constraintEnd_toStartOf="@+id/player_resize"
    vlc:layout_constraintStart_toEndOf="@+id/player_space_right"
    vlc:layout_constraintTop_toTopOf="@+id/player_overlay_play"
    vlc:srcCompat="@drawable/ic_player_info" />
```

vector 图可以点击我们要放置的目录，点击`File - new - Vector Asset`，选择一张 svg 图，宽度参考其他按钮，为 32

`application\resources\src\main\res\drawable\ic_player_renderer.xml`

```java
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="32dp"
    android:height="32dp"
    android:viewportWidth="36"
    android:viewportHeight="36">
  <path
      android:pathData="M9,9C7.892,9 7,9.892 7,11L7,25C7,26.108 7.892,27 9,27L27,27C28.108,27 29,26.108 29,25L29,11C29,9.892 28.108,9 27,9L9,9zM9,11L27,11L27,25L9,25L9,11zM11,13L11,18L13,18L13,15L16,15L16,13L11,13zM23,18L23,21L20,21L20,23L25,23L25,18L23,18z"
      android:strokeLineJoin="miter"
      android:strokeWidth="0.75"
      android:fillColor="?attr/player_icon_color"
      android:strokeColor="#00000000"
      android:fillType="evenOdd"
      android:strokeLineCap="butt"/>
</vector>
```

这里放在缩放按钮前，要注意调整它与前后空间的相对位置

> [!TIP]
>
> `layout_constraintStart_toEndOf="xxx"`：自身的起始放在xxx的末尾

##### 按钮功能

在 Delegate 类中可以在`fun onClick(option: PlayerOption)`方法中看到开关视频信息的代码

```java
ID_VIDEO_STATS -> {
    hide()
    service.playlistManager.toggleStats()
}
```

尝试在 Activity 中加入方法供 xml 调用

```java
fun showStats() {
    optionsDelegate!!.service.playlistManager.toggleStats()
}
```

> [!NOTE]
>
> 别的按钮调用的方法都是实现接口`KeycodeListener`方法，布局如果在打开非视频的文件复用，可能会报错

测试发现空指针，观察高级菜单按钮发现展示菜单之前是有一个初始化操作的

```java
override fun showAdvancedOptions() {
    if (optionsDelegate == null) service?.let {
        optionsDelegate = PlayerOptionsDelegate(this, it)
        optionsDelegate!!.setBookmarkClickedListener {
            lifecycleScope.launch { if (!showPinIfNeeded()) overlayDelegate.showBookmarks() else overlayDelegate.showOverlay() }
        }
    }
    optionsDelegate?.show()
    overlayDelegate.hideOverlay(fromUser = false, forceTalkback = true)
}
```

将初始化的代码拷贝到`showStats`前

```java
fun showStats() {
    if (optionsDelegate == null) service?.let {
        optionsDelegate = PlayerOptionsDelegate(this, it)
        optionsDelegate!!.setBookmarkClickedListener {
            lifecycleScope.launch { if (!showPinIfNeeded()) overlayDelegate.showBookmarks() else overlayDelegate.showOverlay() }
        }
    }
    optionsDelegate!!.service.playlistManager.toggleStats()
}
```

可以正常调出视频信息了。

---

但是新的问题又出现了，返回的时候闪退，Logcat 查看`level:error`日志，是返回事件空指针。

在 Activity `override fun onCreate(savedInstanceState: Bundle?)`方法中处理返回事件`onBackPressedDispatcher.addCallback`

```java
onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
    override fun handleOnBackPressed() {
        if (optionsDelegate?.isShowing() == true) {
            optionsDelegate?.hide()
        } else if (resizeDelegate.isShowing()) {
            resizeDelegate.hideResizeOverlay()
        } else if (orientationDelegate.isShowing()) {
            orientationDelegate.hideOrientationOverlay()
        } else if (lockBackButton) {
            lockBackButton = false
                handler.sendEmptyMessageDelayed(RESET_BACK_LOCK, 2000)
                Toast.makeText(applicationContext, getString(R.string.back_quit_lock), Toast.LENGTH_SHORT).show()
        } else if (isPlaylistVisible) {
            overlayDelegate.togglePlaylist()
        } else if (isPlaybackSettingActive) {
            delayDelegate.endPlaybackSetting()
        } else if (isShowing && service?.playlistManager?.videoStatsOn?.value == true) {
            //hides video stats if they are displayed
            service?.playlistManager?.videoStatsOn?.postValue(false)
        } else if (overlayDelegate.isBookmarkShown()) {
            overlayDelegate.hideBookmarks()
        } else if ((AndroidDevices.isAndroidTv || isTalkbackIsEnabled()) && isShowing && !isLocked) {
            overlayDelegate.hideOverlay(true)
        } else {
            exitOK()
        }
    }
})
```

这段代码判断了有菜单打开（高级菜单/视频信息/缩放等）时，关闭菜单，否则退出 Activity。

空指针的位置为`optionsDelegate?.isShowing()`：

```java
fun isShowing() = rootView.visibility == View.VISIBLE
```

`showAdvancedOptions`打开高级菜单时，在初始化之后还有`optionsDelegate?.show()`，查看代码可知时渲染布局，而我们直接打开视频信息，只是初始化了 Delegate，没有渲染布局，rootView 处于未初始化的状态，`rootView.visibility`空指针。

在 Delegate 中加入一个全局变量

```java
private var isInitialized = false
```

在 show 方法中置为`true`

```java
fun show() {
    activity.findViewById<ViewStubCompat>(R.id.player_options_stub)?.let {
        isInitialized = true
```

在`isShowing`方法中加入对初始化的判断

```java
fun isShowing() = isInitialized && rootView.visibility == View.VISIBLE
```

即当高级菜单未初始化时，`isShowing`会返回`false`，还需要在返回事件中加上一个逻辑来处理当仅通过我们自己添加的按钮显示视频信息的情况

```java
else if (service?.playlistManager?.videoStatsOn?.value == true) {
    service?.playlistManager?.videoStatsOn?.postValue(false)
}
```

