# Android TV

Android TV 操作方式为遥控器，所以关键是控件的焦点及焦点效果。

### 允许获得焦点

1. 控件需要能够获得焦点
2. 获得焦点后的效果，例如 TextView 获得焦点是没有显示效果的

一般设置`android:focusable="true"`即可获得焦点

##### MaterialCardView

`app:rippleColor="?attr/colorPrimary"`可以修改获得焦点的颜色

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_marginTop="10dp"
    android:layout_marginHorizontal="14dp"
    app:cardBackgroundColor="?attr/colorSurfaceContainer"
    app:cardElevation="0dp"
    app:rippleColor="?attr/colorPrimary"
    app:strokeWidth="0dp"
    android:focusable="true"
    android:clickable="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:id="@+id/v_container"
        android:padding="10dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:id="@+id/tv_title"
            android:paddingVertical="6dp"
            android:textSize="20sp"
            android:textStyle="bold"
            android:textColor="?attr/colorPrimary"/>

    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
```

##### TextView

如果设置允许复制`android:textIsSelectable="true"`，TextView 将会能够获得焦点，但它有没有焦点效果，所以会导致控制很奇怪。
