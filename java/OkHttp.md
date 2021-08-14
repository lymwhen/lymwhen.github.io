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

