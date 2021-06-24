# 使用 CA 签发的证书

在 CA 服务商一般可以获得：

| 文件名     | 类型                       |
| ---------- | -------------------------- |
| server.crt | 服务器证书                 |
| chain.crt  | 中间证书                   |
| server.key | 服务器私钥，用于对数据加密 |

> crt ≈ cer

# 加入中间证书

为保证所有浏览器的兼容性，需要将中间证书加入到服务器证书中。

以文本方式打开 server.crt 和 chain.crt，将 chain.crt 的内容添加到服务器证书后面，形如：

```
-----BEGIN CERTIFICATE-----
服务器证书
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
中间证书
-----END CERTIFICATE-----
```

可命名为 server_with_chain.crt

# Tomcat 配置

### 生成服务端 p12 格式证书

这里使用 server_with_chain

```bash
openssl pkcs12 -export -clcerts -in G:/openssl_key/server_with_chain.crt -inkey G:/openssl_key/server.key -out G:/openssl_key/chunshu_server.p12
# 输入密码，tomcat 配置中使用生成的 p12 和证书和这里输入的密码
```

配置 Tomcat 配置方法参看[Tomcat配置https](Tomcat/Tomcat配置https.md)

# Nginx 配置

将上述 server_with_chain.crt 和 server.key 拷到服务器，nginx 配置如下

    listen       83 ssl;
    server_name  cs.qjjsxy.com;
    
    ssl_certificate     D:/nginx-1.18.0/conf/server_with_chain.crt;
    ssl_certificate_key D:/nginx-1.18.0/conf/server.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5:!DH;
    ssl_prefer_server_ciphers on;

nginx 可以用 https 代理 http

> [Nginx SSL证书安装 - 如何安装SSL证书 - 服务与支持 - 迅通诚信 (myssl.cn)](https://www.myssl.cn/ssl/nginx/openssl/install.htm)

# SSL 安装检测

使用在线工具检测服务器，当3个证书都正常时，说明 ssl 配置正确

在线检测

[SSL服务器证书安装检查器_OPENSSL工具包_迅通诚信 (myssl.cn)](https://www.myssl.cn/tools/check-server-cert.html)

本地检测

```bash
openssl s_client -debug -connect www.thedomaintocheck.com:443
```



### OkHttp3 报错 Trust anchor for certification path not found

```
java.security.cert.CertPathValidatorException: Trust anchor for certification path not found.
```

缺少中间证书

> [okhttp使用https报 Trust anchor for certification path not found解决办法 – junfei (caojunfei.com)](http://www.caojunfei.com/?p=3683)

