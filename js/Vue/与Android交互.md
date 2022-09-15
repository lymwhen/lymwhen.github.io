# 与Android交互



# js 调用 Android 方法

> 支持传参与获取返回值

### 创建 js 接口

```java
import android.app.Activity;
import android.webkit.JavascriptInterface;

public class JsInterface {
    private MainActivity activity;

    public JsInterface(Activity activity) {
        this.activity = (MainActivity)activity;
    }
    
    @JavascriptInterface
    public void setPrefString(String key, String value){
        PrefUtils.setString(activity.getApplicationContext(), key, value);
    }

    @JavascriptInterface
    public String getPrefString(String key){
        return PrefUtils.getString(activity.getApplicationContext(), key, "");
    }

    @JavascriptInterface
    public void delPrefString(String key){
        PrefUtils.delString(activity.getApplicationContext(), key);
    }
}
```

### 在 WebView 添加 js 接口

```java
// 添加js接口，添加$App到window
webView.addJavascriptInterface(new JsInterface(this), "$App");
```

### 在 Vue 中调用

```javascript
if (window.$App && window.$App.setPrefString) {
    window.$App.setPrefString('jToken', resp.data.data.jToken)
    window.$App.setPrefString('studentNo', resp.data.data.studentNo)
}
```

```javascript
if (window.$App && window.$App.getPrefString) {
    this.studentNo = window.$App.getPrefString('studentNo')
}
```



# Android 通过链接传入初始参数

### 传入参数

```java
x5WebView.loadUrl("http://192.168.3.127:8081?id=103")
```

### Vue 中读取

在 Vue 工程目录下 index.html 中加入脚本

```html
<script>
    curParams = {};
    var arr = location.search.split(/[?|&]/);
    if(arr.length > 1){
        for(var i = 1; i < arr.length; i++){
            var pArr = arr[i].split('=');
            curParams[pArr[0]] = decodeURIComponent(pArr[1]);
        }
    }
</script>
```

读取参数

```javascript
let userNo = window.curParam['userNo'] || ''
```



# Android 调用 Vue 方法

这里使用 EventBus 实现，参看 [EventBus](Vue/EventBus.md)

### 在 window 中添加接收方法

```javascript
let that = this
// 当调用 window 中 onQrResult 方法时，向 EventBus 中提交 onQrResult 事件，传入参数
window.onQrResult = function(code) {
	that.$EventBus.$emit('onQrResult', code)
}
```

### 在 Vue 方法所在的组件中注册事件

在 methods 中定义需要被调用的方法

```javascript
onQrResult(code) {
	console.log(code)
},
```

在 created 中注册事件

```javascript
this.$EventBus.$on('onQrResult', this.onQrResult)
```

在 beforeDestroy 中注销事件

```javascript
this.$EventBus.$off('onQrResult')
```

在 Android 中调用

```java
webView.loadUrl("javascript:onQrResult('" + qrResult + "')");
```

