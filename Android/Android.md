# Android

> [Android 开发者  | Android Developers (google.cn)](https://developer.android.google.cn/)
>
> [API Levels | Android versions, SDK/API levels, version codes, codenames, and cumulative usage](https://apilevels.com/)

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



# 沉浸式状态栏

```java
Window window = getWindow();
//        请求进行全屏布局+更改状态栏字体颜色
//          获取程序是不是夜间模式
int uiMode = getApplicationContext().getResources().getConfiguration().uiMode;
if ((uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES){
    //            SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION  and  SYSTEM_UI_FLAG_LAYOUT_STABLE请求进行全屏布局
    //            SYSTEM_UI_FLAG_VISIBLE进行更改状态栏字体颜色
    window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_VISIBLE);//白色
} else {
    window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);//黑色

}
//                让内容显示在系统栏的后面,也就是显示在状态栏和导航栏的后面
WindowCompat.setDecorFitsSystemWindows(window, true);
//      沉浸状态栏(给任务栏上透明的色)(Android 10 上，只需要将系统栏颜色设为完全透明即可:)
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    window.setStatusBarColor(Color.TRANSPARENT);
}
//                沉浸导航栏（设置透明色）
window.setNavigationBarColor(Color.TRANSPARENT);

//                在安卓10以上禁用系统栏视觉保护。
// 当设置了  导航栏 栏背景为透明时，NavigationBarContrastEnforced 如果为true，则系统会自动绘制一个半透明背景
// 状态栏的StatusBarContrast 效果同理，但是值默认为false，因此不用设置
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
    window.setNavigationBarContrastEnforced(false);
}

/********************设置开始*****************************/
//        处理视觉冲突
//对最底部布局设置顶部和底部Padding
RecyclerView codecList = findViewById(R.id.list_codec);
codecList.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
    @NonNull
    @Override
    public WindowInsets onApplyWindowInsets(@NonNull View v, @NonNull WindowInsets insets) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            v.setPadding(v.getPaddingLeft() + insets.getSystemWindowInsets().left,
                         v.getPaddingTop() + insets.getSystemWindowInsets().top,
                         v.getPaddingRight() + insets.getSystemWindowInsets().right,
                         v.getPaddingBottom() + insets.getSystemWindowInsets().bottom);
        }
        return insets;
    }

});
/********************设置结束*****************************/
```

> [!TIP]
>
> 设置顶部和底部Padding的组件如果是包含**滚动控件或者是滚动控件中位于顶部或底部的控件（不一定非得是容器类控件）**，那么将可以实现内容滚动到状态栏和导航栏下的效果，同时又可以将它们包含的内容从状态栏和导航栏下滚动出来，非常炫酷。
>
> 导航栏的位置在不同设备中，可能出现在左中右三个方向，所以 padding 应该四个方向都加上，如果导航栏没有出现在某侧，那么`insets.getSystemWindowInsets()`在这个方向的数值也是`0`，加上也不影响。

> [android沉浸状态栏+导航栏(小白条) JAVA版小白教程 （基于安卓官方教程） - kingwzun - 博客园 (cnblogs.com)](https://www.cnblogs.com/kingwz/p/17300036.html)

### 最终效果

配个`edgeToEdge`，上述效果使用这段代码就可以实现：

```java
// 将状态栏和导航栏设为透明
EdgeToEdge.enable(this);
// 布局延展到状态栏和导航栏
getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
// 设置布局padding，避开状态栏、导航栏、标题栏
ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.list_codec), (v, insets) -> {
    Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
    v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
    return insets;
});
```

# TextView

### fontStyle 编程方式

```java
h.tvName.setTypeface(isHighlight ? Typeface.DEFAULT_BOLD : Typeface.DEFAULT);
```



# ImageView

### 旋转

```java
rotateImage.rotation(90);
rotateImage.animate().rotation(90); // 带动画
```

> [Android UI之ImageView旋转的几种方式_android imageview 旋转-CSDN博客](https://blog.csdn.net/gh8609123/article/details/60369777)

### tint 编程方式

tint 属性可以修改图片资源的颜色。

不区分版本

```java
ImageView image = new ImageView(context);
Drawable up = ContextCompat.getDrawable(context,R.drawable.ic_sort_up);
Drawable drawableUp= DrawableCompat.wrap(up);
DrawableCompat.setTint(drawableUp, ContextCompat.getColor(context,R.color.theme));
image.setImageDrawable(drawableUp);
```

> [!NOTE]
>
> 这种方式将会修改使用同一图片资源的空间，因为它们都是引用到相同的`Drawable`。
>
> 如果是固定的几种颜色，可以先定义几种`Drawable`，动态设置`ImageView`使用的`Drawable`。

API21+

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {    
    ImageView image = new ImageView(context);
    image.setImageResource(R.drawable.ic_sort_down);
    image.setImageTintList(ColorStateList.valueOf(ContextCompat.getColor(context,R.color.theme)));
}
```

> [在代码中实现android:tint效果 - 简书 (jianshu.com)](https://www.jianshu.com/p/6c288ff88ecf)

# 性能

编解码器信息：[MediaCodecList  | Android Developers (google.cn)](https://developer.android.google.cn/reference/android/media/MediaCodecList?hl=en)

显示：[Display.Mode  | Android Developers (google.cn)](https://developer.android.google.cn/reference/android/view/Display.Mode)

# 问题

### switch 语句 `Constant expression required`

将 switch 改为 if 形式

> [Androidstudio出现Constant expression required - CSDN文库](https://wenku.csdn.net/answer/5xad9vrwon)

### TextView多行显示的最后一行被遮住一半的bug

貌似并不总是出现，实测发现在`RecyclerView`中出现过。

> 将TextView的PaddingButtom设置一个切当的值即可解决（单行文字高度的一半就可以，例如10dp）。
>
> [解决Android中TextView多行显示的最后一行被遮住一半的bug_android textview最后一行显示一半-CSDN博客](https://blog.csdn.net/pretender05/article/details/56842086)

### SSL peer shut down incorrectly

- 多重试几次
- 关闭代理
- 注释掉一些仓库镜像

> [Android Studio在编译时出现SSL peer shut down incorrectly问题_android studio ssl peer shut down incorrectly-CSDN博客](https://blog.csdn.net/qq_42545144/article/details/122060073)
