# WebView

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

