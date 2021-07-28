# 安装 nginx



# 下载 nginx

官网下载nginx，上传到服务器

> [nginx: download](http://nginx.org/en/download.html)
>
> 也可用 wget 下载
>
> ```bash
> wget http://nginx.org/download/nginx-1.12.2.tar.gz
> ```

# 编译安装

```bash
# 安装依赖
yum -y install gcc zlib zlib-devel pcre-devel openssl openssl-devel
# 解压缩
tar -zxvf linux-nginx-1.12.2.tar.gz
cd nginx-1.12.2/
# 执行配置
./configure
# 编译安装(默认安装在/usr/local/nginx)
make
make install
```

### 编译配置参数

```bash
# 安装在/usr/local/nginx，带上https模块
./configure --prefix=/usr/local/nginx --with-http_ssl_module

./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
```

--prefix 安装位置

--with-模块名称 编译时需要带上的模块

### 添加模块

```bash
# 切换到源码包：
cd /usr/local/src/nginx-1.11.3
# 查看nginx原有的模块
/usr/local/nginx/sbin/nginx -V
# 在configure arguments:后面显示的原有的configure参数如下：
# --prefix=/usr/local/nginx --with-http_stub_status_module
# 那么我们的新配置信息就应该这样写：
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
# 运行上面的命令即可，等配置完，运行命令
make
# 这里不要进行make install，否则就是覆盖安装

# 然后备份原有已安装好的nginx
cp /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.bak
# 然后将刚刚编译好的nginx覆盖掉原有的nginx（这个时候nginx要停止状态）
cp ./objs/nginx /usr/local/nginx/sbin/
# 然后启动nginx，仍可以通过命令查看是否已经加入成功
/usr/local/nginx/sbin/nginx -V　
```



# 常用命令

```
测试配置文件：${Nginx}/sbin/nginx -t
启动命令：${Nginx}/sbin/nginx
停止命令：${Nginx}/sbin/nginx -s stop/quit
重启命令：${Nginx}/sbin/nginx -s reload
查看进程命令：ps -ef | grep nginx
平滑重启：kill -HUP [Nginx主进程号(即ps命令查到的PID)]
```

