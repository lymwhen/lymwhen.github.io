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



