# OpenAPI

# 代理 hls/ws 流

需要代理海康流的情况：

- 海康平台没有映射外网

- 海康平台没有CA证书

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http{
	include       mime.types;
	default_type  application/octet-stream;
	sendfile        on;
	keepalive_timeout  65;

    map $http_upgrade $connection_upgrade { 
        default upgrade; 
        '' close; 
    }

	server {
        listen       36635 ssl;
        server_name  xxx.com;
        
        ssl_certificate     /usr/local/nginx/xxx.com.crt;
        ssl_certificate_key /usr/local/nginx/xxx.com.key;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5:!DH;
        ssl_prefer_server_ciphers on;
        
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
        uwsgi_read_timeout 300;

        location /openUrlHls/ {
        #    root   html;
        #    index  index.html index.htm;
            proxy_pass http://39.33.122.100:83/openUrl/;
            types {
                application/vnd.apple.mpegurl m3u8;
                video/mp2t ts;
            }
            
            add_header Cache-Control no-cache;
            client_max_body_size 50m; #允许客户端请求的最大单文件字节数
            client_body_buffer_size 1m;#缓冲区代理缓冲用户端请求的最大字节数，
            proxy_buffer_size 256k;#设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffers 4 256k;  #proxy_buffers缓冲区，网页平均在256k下，这样设置
            proxy_busy_buffers_size 256k; #高负荷下缓冲大小（proxy_buffers*2）
            proxy_temp_file_write_size 256k;  #设定缓存文件夹大小
            proxy_next_upstream error timeout invalid_header http_500 http_503 http_404;
            proxy_max_temp_file_size 128m;
        }

        location /openUrl/ {
            proxy_http_version 1.1;
            proxy_pass http://39.33.122.100:559/openUrl/;
            proxy_redirect off; 
            proxy_set_header Host $host; 
            proxy_set_header X-Real-IP $remote_addr; 
            proxy_read_timeout 3600s; 
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
            proxy_set_header Upgrade $http_upgrade; 
            proxy_set_header Connection $connection_upgrade; 
        }
        
        location /media {
            proxy_http_version 1.1;
            proxy_pass http://39.33.122.100:559/media;
            proxy_redirect off; 
            proxy_set_header Host $host; 
            proxy_set_header X-Real-IP $remote_addr; 
            proxy_read_timeout 3600s; 
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
            proxy_set_header Upgrade $http_upgrade; 
            proxy_set_header Connection $connection_upgrade; 
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

> [!TIP]
>
> 海康 hls 流端口为 83，ws 流端口为 559

> [!NOTE]
>
> 代理 ws 时，必须要同时代理`/openUrl/`和`/media`，且修改无效

播放流时，替换一下海康流地址：

```yaml
hls-server: http://39.33.122.100:83/openUrl
hls-server-proxy: https://xxx.com:36635/openUrlHls
ws-server: ws://39.33.122.100:559/openUrl
ws-server-proxy: wss://xxx.com:36635/openUrl
```

# h5player

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<title>xxx</title>
	<link rel="shortcut icon" href="${rc.contextPath}/images/base/logo.png">
	<link rel="stylesheet" href="${rc.contextPath}/js/layui/css/layui.css">
	<link rel="stylesheet" type="text/css" href="${rc.contextPath}/css/main.css">
	<script type="text/javascript" src="${rc.contextPath}/js/jquery-1.12.4.min.js"></script>
	<script type="text/javascript" src="${rc.contextPath}/js/layui/layui.js"></script>
	<script type="text/javascript" src="${rc.contextPath}/js/base.js"></script>
	<script type="text/javascript" src="${rc.contextPath}/js/hikh5/bin/h5player.min.js"></script>
	<style>

		.control {
			height: 38px;
			display: flex;
		}

		#player {
			width: 100vw;
			height: calc(100vh - 38px);
		}

		.sub-wnd {
			border: 0 !important;
		}
	</style>
</head>

<body>
<div class="control">
	<input type="text" id="time" name="createTime" placeholder="请选择回放时间" autocomplete="off" readonly class="layui-input">
	<button type="button" class="btn-full-screen layui-btn" style=" background: #3784FF;">全屏</button>
</div>
<div id="player" class="myplayer"></div>
</video>
	<script type="text/javascript">

		layui.use(['form', 'layer', 'table', 'laydate'], function () {
			var form = layui.form;
			var layer = layui.layer;
			var table = layui.table;
			var laydate = layui.laydate;

			var time;
			var url;

			laydate.render({
				elem: '#time',
				trigger: 'click',
				format: 'yyyy-MM-dd HH:mm:ss',
				type: 'datetime',
				done:function(value,date,endDate){
					time = value;
					setTime();
				}
			})

			var cameraIndexCode = '${info.cameraIndexCode}';

			var player = new JSPlugin({
					szId: 'player',
					szBasePath: '${rc.contextPath}/js/hikh5/bin'
				});

			// https://open.hikvision.com/docs/docId?productId=618cf0a9ec4acb67a0a10fd6&version=%2F3711510d6ee846c8a1ece880a4615932&tagPath=%E9%99%84%E5%BD%95-%E9%99%84%E5%BD%95F%20expand%E6%89%A9%E5%B1%95%E5%86%85%E5%AE%B9%E8%AF%B4%E6%98%8E
			function setTime() {
				var timeEnd = timeAdd(time, 60 * 60 * 1000);
				var timeBeginTz = timeTz(time)
				var timeEndTz = timeTz(timeEnd)
				if(!url) {
					loadingLayer = layer.msg('正在载入...', {
						time: 0,
						icon: 16,
						shade: 0.01
					});
					// expand参数说明：https://open.hikvision.com/docs/docId?productId=5c67f1e2f05948198c909700&version=%2F60df74fdc6f24041ac3d2d7f81c32325&tagPath=%E7%BB%BC%E5%90%88%E5%AE%89%E9%98%B2%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0V2.1.0-%E9%99%84%E5%BD%95-%E9%99%84%E5%BD%95F%20expand%E6%89%A9%E5%B1%95%E5%86%85%E5%AE%B9%E8%AF%B4%E6%98%8E
					// streamform=rtp&transcode=1&resolution=D1
					$.post("${rc.contextPath}/playbackURLs",{cameraIndexCode:cameraIndexCode, protocol: 'ws', expand: 'streamform=rtp&transcode=1&resolution=720P',
						beginTime: time, endTime: timeEnd},function success(data){
						url = data.data.data.url
						player.JS_Play(url, {playURL: url, mode: 1}, 0, timeBeginTz, timeEndTz).then(
								() => { layer.close(loadingLayer);console.log('realplay success') },
								e => { layer.close(loadingLayer);console.error(e) }
						)
					},"json");
				} else {
					player.JS_Play(url, {playURL: url, mode: 1}, 0, timeBeginTz, timeEndTz).then(
							() => { console.log('realplay success') },
							e => { console.error(e) }
					)
				}
			}

			$('.btn-full-screen').click(function() {
				player.JS_FullScreenSingle(0).then(
						() => { console.log(`wholeFullScreen success`) },
						e => { console.error(e) }
				)
			})

		});

		function timeTz(timeStr){
			var a = timeStr.split(' ');
			return a[0] + 'T' + a[1] + 'Z';
		}

		function timeAdd(timeStr, millis) {
			return new Date(new Date(timeStr).getTime() + millis).format('yyyy-MM-dd HH:mm:ss');
		}
	</script>
</body>
</html>
```

# 海康平台配置证书

http://ip:8001/center

`系统管理 - 证书管理`

> [!TIP]
>
> 如果有中间证书，需要合并一下，因为海康服务器只能配置一个 crt，不然 h5 或小程序播放 hlss 失败。
