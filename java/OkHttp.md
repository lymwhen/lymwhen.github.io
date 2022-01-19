# OkHttp

HTTP is the way modern applications network. It’s how we exchange data & media. Doing HTTP efficiently makes your stuff load faster and saves bandwidth.

> [OkHttp (square.github.io)](https://square.github.io/okhttp/)

# Params

> 对应 Postman - Params

```java
HttpUrl.Builder builder = HttpUrl.parse("https://sso.yyy.com").newBuilder();
builder.addQueryParameter("grant_type", "authorization_code");
builder.addQueryParameter("redirect_uri", "https://xxx/ssoClient/login");
builder.addQueryParameter("code", "okdd");
Request request1 = new Request.Builder()
    .url(builder.build())
    .build();
try (Response response = client.newCall(request1).execute()) {
    String resp = response.body().string();
    System.out.println(resp);
}catch (Exception ex){
    ex.printStackTrace();
}
```



# Form

> 对应 Postman - Body - form-data

```java
FormBody.Builder formBody = new FormBody.Builder()
    .add("grant_type", "authorization_code")
    .add("redirect_uri", "https://xxx/ssoClient/login")
    .add("code", "okdd");

Request request1 = new Request.Builder()
    .url("https://sso.yyy.com")
    .post(formBody.build())
    .build();
try (Response response = client.newCall(request1).execute()) {
    String resp = response.body().string();
    System.out.println(resp);
}catch (Exception ex){
    ex.printStackTrace();
}
```

# Body

> 对应 Postman - Body - raw

```java
Map<String, Object> map = new HashMap<>();
map.put("grant_type", "authorization_code");
map.put("redirect_uri", "https://10.20.108.14/ssoClient/login");
map.put("code", "okdd");
RequestBody body = RequestBody.create(mediaType, JSON.toJSON(map).toString());

Request request1 = new Request.Builder()
    .url("https://sso.yyy.com")
    .post(body)
    .build();
try (Response response = client.newCall(request1).execute()) {
    String resp = response.body().string();
    System.out.println(resp);
}catch (Exception ex){
    ex.printStackTrace();
}
```

# 异步请求
```java
OkHttpClient okHttpClient = new OkHttpClient();
Request request = new Request.Builder().url(url).build();
okHttpClient.newCall(request).enqueue(new Callback() {
    @Override
    public void onFailure(Call call, IOException e) {

    }

    @Override
    public void onResponse(Call call, Response response) throws IOException {
        InputStream is = null;
        byte[] buf = new byte[2048];
        int len = 0;
        FileOutputStream fos = null;

        File file = new File(destFilePath);
        File dir = file.getParentFile();
        // 储存下载文件的目录
        if (!dir.exists() && !dir.mkdirs()) {
            Message msg = new Message();
            msg.what = MSG_FAILED;
            msg.obj = new Exception("创建文件目录失败");
            handler.sendMessage(msg);
        }
        try {
            is = response.body().byteStream();
            fos = new FileOutputStream(file);
            while ((len = is.read(buf)) != -1) {
                fos.write(buf, 0, len);
            }
            fos.flush();
        } catch (Exception e) {
            
        } finally {
            try {
                if (is != null)
                    is.close();
            } catch (IOException e) {
            }
            try {
                if (fos != null)
                    fos.close();
            } catch (IOException e) {
            }
        }
    }
});
```

# 文件上传

```java
OkHttpClient okHttpClient = new OkHttpClient();
File file = new File(filePath);
RequestBody requestBody = new MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        .addFormDataPart("file", file.getName(),
                RequestBody.create(MediaType.parse("multipart/form-data"), file))
        .addFormDataPart("savePath", serverSavePath)
        .build();
Request request = new Request.Builder().url(ServerConfig.URL_API_FILE2PDF)
        .post(requestBody)
        .addHeader("J-Token", jToken)
        .build();
okHttpClient.newCall(request).enqueue(new Callback() {
    @Override
    public void onFailure(Call call, IOException e) {
        Message msg = new Message();
        msg.what = MSG_FAILED;
        msg.obj = e;
        handler.sendMessage(msg);
    }

    @Override
    public void onResponse(Call call, Response response) {
        response.close();
        Message msg = new Message();
        msg.what = MSG_SUCCESS;
        handler.sendMessage(msg);
    }
});
```

# Authorization

> 对应 Postman - Authorization

### Basic Authentication

```java
String credential = Credentials.basic("test", "1234");
Request request1 = new Request.Builder()
	.addHeader(credential)
	...
```

> yntsjy sso Authorization 自动生成了一个名为`Authorization`的header，但headers中还有另一个同名header，在 Postman 中正常，在代码中报 400，删除多出的名为`Authorization`的header，正常

# XMLHttpRequest

```javascript
var xhr = new XMLHttpRequest();
xhr.open('POST', 'https://192.168.3.105/api/notification/list?page=1&limit=2');
xhr.setRequestHeader("J-Token", "eyJhbGciOiJIUzUxMiJ9.eyJzdW...f4Mm18VPvrztQzTO3yopgdQoKPkh28g");
xhr.send();
```

