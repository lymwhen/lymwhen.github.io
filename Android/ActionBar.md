# ActionBar

### 返回键

```java
public class AboutActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

        ActionBar actionBar = getSupportActionBar();  // 获取ActionBar
        if (actionBar != null) {
            actionBar.setTitle("关于");  // 设置ActionBar的标题
            // actionBar.setSubtitle("请详细阅读");  // 副标题
            actionBar.setDisplayHomeAsUpEnabled(true);  // 设置返回按钮
        }
    }

    // 监听返回按钮，如果点击返回按钮则关闭当前Activity
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            this.finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
```

> [【Android】ActionBar监听返回按钮_actionbar返回按钮-CSDN博客](https://blog.csdn.net/qq_39147299/article/details/120879365)

### 菜单

res/menu/menu_activity_codec_details.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

    <item
        android:id="@+id/menu_reference"
        android:icon="@drawable/baseline_open_in_new_24"
        android:title="拍照"
        app:showAsAction="always" />
</menu>
```

Activity

```java
// 绑定菜单项
@Override
public boolean onCreateOptionsMenu(Menu menu) {
    MenuInflater inflater = getMenuInflater();
    inflater.inflate(R.menu.menu_activity_codec_details, menu);
    return super.onCreateOptionsMenu(menu);
}

// 点击事件
@Override
public boolean onOptionsItemSelected(MenuItem item) {
    if (item.getItemId() == android.R.id.home) {
        finish();

    } else if(item.getItemId() == R.id.menu_reference) {
        Uri uri = Uri.parse("https://developer.android.google.cn/reference/android/media/MediaCodecInfo");
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        startActivity(intent);
    }
    return super.onOptionsItemSelected(item);
}
```

> [【Android】actionbar显示选项菜单_android actionbar 显示菜单-CSDN博客](https://blog.csdn.net/zhangzeyuaaa/article/details/40783681)