# Android端不安全https处理

当使用 CA 签发的证书且证书配置正确时，无需做额外的配置就能正常访问。

当使用自签名证书时，需要对各组件进行不校验证书配置。

# OkHttp3

不校验证书的 OkHttpClient

```java
public static OkHttpClient getNoVerifyOkHttpClient() throws Exception {
    X509TrustManager trustManager = new X509TrustManager() {
        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) {

        }
        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) {

        }

        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[0];
        }
    };

    SSLSocketFactory sslSocketFactory = null;
    try {
        SSLContext sslContext;
        sslContext = SSLContext.getInstance("SSL");
        // trustAllCerts信任所有的证书
        sslContext.init(null,new X509TrustManager[]{trustManager},null);
        sslSocketFactory = sslContext.getSocketFactory();
    } catch (GeneralSecurityException e) {
        throw new Exception(e);
    }

    // 不进行服务名校验
    HostnameVerifier noVerifier = (hostname, session) -> true;

    // 处理重定向，如 tomcat 配置 80 端口重定向到 443
    Interceptor redirectInterceptor = chain -> {
        Request request = chain.request();
        Response response = chain.proceed(request);
        int code = response.code();
        Log.d("redirect", String.valueOf(code));
        if (code == 307 || code == 302) {
            //获取重定向的地址
            String location = response.headers().get("Location");
            Log.d(TAG, "redirect：" + "location = " + location);
            //重新构建请求
            Request newRequest = request.newBuilder().url(location).build();
            response = chain.proceed(newRequest);
        }
        return response;
    };

    OkHttpClient client = new OkHttpClient.Builder()
        .followRedirects(false)
        .addInterceptor(redirectInterceptor)
        .hostnameVerifier(noVerifier)
        .sslSocketFactory(sslSocketFactory, trustManager)
        .build();
    return client;
}
```

> https://blog.csdn.net/MoonLoong/article/details/79760428（未发现方案一所说的情况）

# WebView

WebView 打开不安全的 https 网页时默认白屏

```java
x5WebView.setWebViewClient(new WebViewClient() {
    @Override
    public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
        // super.onReceivedSslError(view, handler, error);
        // handler.cancel();// super中默认的处理方式，WebView变成空白页
        if (handler != null) {
            //忽略证书的错误继续加载页面内容
            handler.proceed();
        }
    }
});
```

# HttpURLConnection

```java
HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();
urlConnection.setRequestMethod("POST");
urlConnection.setSSLSocketFactory(context.getSocketFactory());
urlConnection.setHostnameVerifier(new HostnameVerifier() {
    @Override
    public boolean verify(String hostname, SSLSession session) {
            return true;
        }
    });
```

```java
private static InputStream getImageStream(String urlParam) throws Exception {
    URL url = new URL(urlParam);
    HttpURLConnection conn = null;

    //**关键代码**
    //ignore https certificate validation |忽略 https 证书验证
    if (url.getProtocol().toUpperCase().equals("HTTPS")) {
        trustAllHosts();
        HttpsURLConnection https = (HttpsURLConnection) url
                .openConnection();
        https.setHostnameVerifier(InternetUtil.DO_NOT_VERIFY);
        conn = https;
    } else {
        conn = (HttpURLConnection) url.openConnection();
    }


    conn.setConnectTimeout(5 * 1000);
    conn.setRequestMethod("GET");
    if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
        return conn.getInputStream();
    }
    return null;
}

public static void trustAllHosts() {
    // Create a trust manager that does not validate certificate chains
    // Android use X509 cert
    TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
            return new java.security.cert.X509Certificate[] {};
        }

        public void checkClientTrusted(X509Certificate[] chain,
                                       String authType) throws CertificateException {
        }

        public void checkServerTrusted(X509Certificate[] chain,
                                       String authType) throws CertificateException {
        }
    } };

    // Install the all-trusting trust manager
    try {
        SSLContext sc = SSLContext.getInstance("TLS");
        sc.init(null, trustAllCerts, new java.security.SecureRandom());
        HttpsURLConnection
                .setDefaultSSLSocketFactory(sc.getSocketFactory());
    } catch (Exception e) {
        e.printStackTrace();
    }
}

public final static HostnameVerifier DO_NOT_VERIFY = new HostnameVerifier() {
    public boolean verify(String hostname, SSLSession session) {
        return true;
    }
};
```

> [android https请求 certpathvalidatorexception | APP开发技术博客 (appblog.cn)](https://www.appblog.cn/2019/11/09/Android HTTPS请求 CertPathValidatorException/)

