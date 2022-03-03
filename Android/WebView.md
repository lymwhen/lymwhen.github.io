# WebView

> [WebView | Android Developers](https://developer.android.google.cn/reference/android/webkit/WebView)
>
> [WebSettings | Android Developers](https://developer.android.google.cn/reference/android/webkit/WebSettings)

```java
WebView webView = findViewById(R.id.webView);
WebSettings webSetting = webView.getSettings();
// 从网络加载，不使用缓存
webSetting.setCacheMode(WebSettings.LOAD_NO_CACHE);

// 启用javascript
webSetting.setJavaScriptEnabled(true);
// Sets whether the WebView should enable support for the "viewport" HTML meta tag or should use a wide viewport.
webSetting.setUseWideViewPort(true);

if (Build.VERSION.SDK_INT >= 21) {
    // 直播流需要开启（VP9等）
    // In this mode, the WebView will allow a secure origin to load content from any other origin, even if that origin is insecure. This is the least secure mode of operation for the WebView, and where possible apps should not set this mode.
    // 在此模式下，WebView 将允许安全源从任何其他源加载内容，即使该源不安全也是如此。这是 WebView 最不安全的操作模式，在可能的情况下，应用不应设置此模式。
    webView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
}
webView.getSettings().setUserAgentString("Mozilla/5.0 (Linux; U; Android 2.0; en-us; Droid Build/ESD20) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17");
webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
webView.getSettings().setPluginState(WebSettings.PluginState.ON_DEMAND);
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
    // Sets whether the WebView requires a user gesture to play media. The default is true.
    // 设置 WebView 是否需要用户手势才能播放媒体。缺省值为 true
    webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
}

// 开启Cookie
CookieSyncManager.createInstance(this);
CookieManager.getInstance().setAcceptCookie(true);
if (Build.VERSION.SDK_INT >= 21) {
    CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
}

// 开启localStorage
x5WebView.getSettings().setDomStorageEnabled(true);
x5WebView.getSettings().setAppCacheMaxSize(1024*1024*8);
String appCachePath = getApplicationContext().getCacheDir().getAbsolutePath();
x5WebView.getSettings().setAppCachePath(appCachePath);
x5WebView.getSettings().setAllowFileAccess(true);
x5WebView.getSettings().setAppCacheEnabled(true);

// 默认背景，对于底色不是白色的页面可以设置
// webView.setBackgroundColor(Color.argb(1, 0, 0, 0));

webView.setWebViewClient(new WebViewClient() {
    //覆盖shouldOverrideUrlLoading 方法
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        // 拨打电话、发短信特殊处理
        if (url.startsWith("tel:")) {
            Intent sendIntent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
            startActivity(sendIntent);
        } else if (url.startsWith("sms:")) {
            Intent sendIntent = new Intent(Intent.ACTION_SENDTO, Uri.parse(url));
            startActivity(sendIntent);
        } else {
            view.loadUrl(url);
        }

        Log.d("noa", "loadUrl: " + url);
        return true;
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        // 页面记载完成同步cookie
        CookieSyncManager.getInstance().sync();
        super.onPageFinished(view, url);
    }

    @Override
    public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
        // 处理证书错误的情况，如不安全的https
        // super.onReceivedSslError(view, handler, error);
        // super中默认的处理方式，WebView变成空白页
        // handler.cancel();
        if (handler != null) {
            // 忽略证书的错误继续加载页面内容，不会变成空白页面
            handler.proceed();
        }
    }
});

webView.setWebChromeClient(new WebChromeClient() {

    @Override
    public void onProgressChanged(WebView view, int newProgress) {
        // 加载进度条
        if (newProgress == 100) {
            progressBar.setVisibility(View.GONE);
        } else {
            progressBar.setVisibility(View.VISIBLE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                progressBar.setProgress(newProgress, true);
            }else{
                progressBar.setProgress(newProgress);
            }
        }
    }

    // For Android < 3.0
    public void openFileChooser(ValueCallback<Uri> valueCallback) {
        uploadMessage = valueCallback;
        openImageChooserActivity();
    }

    // For Android  >= 3.0
    public void openFileChooser(ValueCallback valueCallback, String acceptType) {
        uploadMessage = valueCallback;
        openImageChooserActivity();
    }

    //For Android  >= 4.1
    public void openFileChooser(ValueCallback<Uri> valueCallback, String acceptType, String capture) {
        uploadMessage = valueCallback;
        openImageChooserActivity();
    }

    // For Android >= 5.0
    @Override
    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
        uploadMessageAboveL = filePathCallback;
        openImageChooserActivity();
        return true;
    }
});

// 下载监听
webView.setDownloadListener(new DownloadListener() {
    @Override
    public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
        NativeUtils.download(WebViewActivity.this, url, contentDisposition, mimetype);
    }
});

// 添加js接口，添加$App到window
webView.addJavascriptInterface(new JsInterface(this, webView), "$App");
webView.loadUrl(url);
```

Cookie 同步与 Activity 生命周期

```java
@Override
protected void onResume() {
    CookieSyncManager.getInstance().startSync();
    if (isOnCreate) {
        isOnCreate = false;
    } else {
        // 通知web进行更新操作
        webView.loadUrl("javascript:onActivityResume()");
    }
    Log.d("noa", "onActivityResume");
    super.onResume();
}

@Override
protected void onPause() {
    CookieSyncManager.getInstance().stopSync();
    super.onPause();
}
```

文件选择与回调

```java
private void openImageChooserActivity() {
    Intent i = new Intent(Intent.ACTION_GET_CONTENT);
    i.addCategory(Intent.CATEGORY_OPENABLE);
    i.setType("*/*");
    //i.setType("image/*");
    startActivityForResult(Intent.createChooser(i, "Image Chooser"), FILE_CHOOSER_RESULT_CODE);
}

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == FILE_CHOOSER_RESULT_CODE) {
        if (null == uploadMessage && null == uploadMessageAboveL) return;
        Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
        if (uploadMessageAboveL != null) {
            onActivityResultAboveL(requestCode, resultCode, data);
        } else if (uploadMessage != null) {
            uploadMessage.onReceiveValue(result);
            uploadMessage = null;
        }
    }
}

@TargetApi(Build.VERSION_CODES.LOLLIPOP)
private void onActivityResultAboveL(int requestCode, int resultCode, Intent intent) {
    if (requestCode != FILE_CHOOSER_RESULT_CODE || uploadMessageAboveL == null)
        return;
    Uri[] results = null;
    if (resultCode == Activity.RESULT_OK) {
        if (intent != null) {
            String dataString = intent.getDataString();
            ClipData clipData = intent.getClipData();
            if (clipData != null) {
                results = new Uri[clipData.getItemCount()];
                for (int i = 0; i < clipData.getItemCount(); i++) {
                    ClipData.Item item = clipData.getItemAt(i);
                    results[i] = item.getUri();
                }
            }
            if (dataString != null)
                results = new Uri[]{Uri.parse(dataString)};
        }
    }
    uploadMessageAboveL.onReceiveValue(results);
    uploadMessageAboveL = null;
}
```

# 执行 js 方法

```java
// 两者区别：evaluateJavascript可接收返回值
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    x5WebView.evaluateJavascript(String.format("javascript:onNativeResult('%s', '%s')", type, json.toJSONString()), null);
}else{
    x5WebView.loadUrl(String.format("javascript:onNativeResult('%s', '%s')", type, json.toJSONString()));
}
```

# 处理加载失败

```java
class MyClient extends WebViewClient {
    /**
     * 这里进行无网络或错误处理，具体可以根据errorCode的值进行判断，做跟详细的处理。
     *
     * @param view
     */
    // 旧版本，会在新版本中也可能被调用，所以加上一个判断，防止重复显示
    @Override
    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
        super.onReceivedError(view, errorCode, description, failingUrl);
        //Log.e(TAG, "onReceivedError: ----url:" + error.getDescription());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return;
        }
        // 在这里显示自定义错误页
        mErrorView.setVisibility(View.VISIBLE);
        mWebView.setVisibility(View.GONE);
        mProgressBar.setVisibility(View.GONE);
        mIsLoadSuccess = false;
    }

    // 新版本，只会在Android6及以上调用
    @TargetApi(Build.VERSION_CODES.M)
    @Override
    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
        super.onReceivedError(view, request, error);
        if (request.isForMainFrame()) { // 或者： if(request.getUrl().toString() .equals(getUrl()))
            // 在这里显示自定义错误页
            mErrorView.setVisibility(View.VISIBLE);
            mWebView.setVisibility(View.GONE);
            mIsLoadSuccess = false;
        }
    }
}
```

```java
webView.setWebViewClient(new WebViewClient() {
    @Override
    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
        super.onReceivedError(view, request, error);

        Log.d(TAG, "onReceivedError");
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                view.reload();
            }
        }, 1000);
    }
});
```

# 显示加载进度

```xml
<ProgressBar
    android:id="@+id/pb"
    style="?android:attr/progressBarStyleHorizontal"
    android:progressDrawable="@drawable/progressbar"
    android:layout_width="match_parent"
    android:layout_height="3dp"
    android:background="@color/colorGray"
    android:visibility="gone"/>
```

drawable/progressbar.xml

```xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android" >
    <item android:id="@android:id/background">
        <shape>
            <corners android:radius="0dp" />
            <gradient
                android:angle="270"
                android:centerColor="#FFFFFF"
                android:endColor="#FFFFFF"
                android:startColor="#FFFFFF" />
        </shape>
    </item>
    <item android:id="@android:id/progress">
        <clip>
            <shape>
                <corners android:radius="0dp" />
                <gradient
                    android:centerColor="#2f66d2"
                    android:endColor="#144ebd"
                    android:startColor="#4b93ff" />
            </shape>
        </clip>
    </item>
</layer-list>
```

在 WebView的`WebChromeClient.onProgressChanged`中根据进度值`newProgress`处理

```java
webview.setWebChromeClient(new WebChromeClient() {

    @Override
    public void onProgressChanged(WebView view, int newProgress) {
        // TODO 自动生成的方法存根

        if (newProgress == 100) {
            progressBar.setVisibility(View.GONE);//加载完网页进度条消失
        } else {
            progressBar.setVisibility(View.VISIBLE);//开始加载网页时显示进度条
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                progressBar.setProgress(newProgress, true);//设置进度值
            }else{
                progressBar.setProgress(newProgress);//设置进度值
            }
        }
    }
}
```

# 疑难问题

##### logcat: Uncaught TypeError: Cannot read property 'getItem' of null

很有可能是没有开启`localStorage`，因为`setItem`和`getItem`是它的常用方法