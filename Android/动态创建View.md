# 动态创建 View

> [!TIP]
>
> Android 中可以存放子组件的组件继承于`ViewGroup `

```java
// 创建
SurfaceViewRenderer surfaceViewRenderer = new SurfaceViewRenderer(context);
// 创建后即可进行操作
surfaceViewRenderer.setMirror(true);

// 设置布局参数
ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
surfaceViewRenderer.setLayoutParams(layoutParams);
// 设置父组件
container_svr.addView(surfaceViewRenderer);
```

布局参数可以设置`dp`、`sp`等指，需要转换成像素

```java
public static int dp2px(Context context, int dpValue){
    return (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP,dpValue, context.getResources().getDisplayMetrics());
}

public static int sp2px(Context context, int spValue){
    return (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP,spValue, context.getResources().getDisplayMetrics());
}
```

> [Android 获取屏幕宽度，dp,sp,px转换方法_claus_gao的博客-CSDN博客](https://blog.csdn.net/u010236169/article/details/52198900)

### 从布局文件创建

```java
// 从布局文件创建
ViewGroup viewLayout = (ViewGroup) LayoutInflater.from(context).inflate(R.layout.item_chat_client_view, null);
```

遇到一个问题：在布局文件中，即使设置固定大小的布局，创建后放到 ViewGroup 中后根节点的 View 仍会丢失宽高、边距等属性。

一个解决办法：在布局文件中套一层跟节点:dog:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content">
    <RelativeLayout
        android:layout_width="210dp"
        android:layout_height="120dp"
        android:layout_marginHorizontal="10dp"
        android:layout_marginVertical="5dp"
        app:cardCornerRadius="0dp"
        app:cardElevation="5dp"
        android:elevation="5dp"
        android:clickable="true"
        android:foreground="?attr/selectableItemBackgroundBorderless">

    </RelativeLayout>
</RelativeLayout>
```

```java
ViewGroup viewLayout = (ViewGroup) LayoutInflater.from(context).inflate(R.layout.item_chat_client_view, null);
// 从套的根节点中取出真实的根节点
ViewGroup viewWindow = (ViewGroup) viewLayout.getChildAt(0);
// 添加到ViewGroup中
viewLayout.removeView(viewWindow);
containerWindows.addView(viewWindow);
```

> [!NOTE]
>
> Android View 放到父节点中前，要先从原来的父中移除
>
> ```java
> // 从原父级移除
> ViewGroup oldViewGroup = (ViewGroup) surfaceViewRenderer.getParent();
> if(oldViewGroup != null){
>     oldViewGroup.removeView(surfaceViewRenderer);
> }
> 
> // 添加
> windowContainerSvr.addView(surfaceViewRenderer);
> ```