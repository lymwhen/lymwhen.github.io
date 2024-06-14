# http

### 服务端

```javascript
var http = require('http');
var fs = require('fs');
http.createServer(function (request, response) {
    // 文本
    // // 发送 HTTP 头部
    // // HTTP 状态值: 200 : OK
    // // 内容类型: text/plain。并用charset=UTF-8解决输出中文乱码
    // response.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
 
    // // 下句是发送响应数据
    // response.end('Hello World! 这是简单的web服务器测试。\n');

    // 文件下载
    // var rs = fs.createReadStream(__dirname + "/" + 'npg');
    // // 设置响应请求头，200表示成功的状态码，headers表示设置的请求头
    // response.writeHead(200, {
    //     'Content-Type': 'application/force-download',
    //     'Content-Disposition': 'attachment; filename=' + 'npg'
    // });

    // rs.pipe(response);
    response.end()
    // 将可读流传给响应对象response
}).listen(8888);
// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
```

