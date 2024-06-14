# net

# tcp

### 服务端

> [net 网络 | Node.js v22 文档 (nodejs.cn)](https://nodejs.cn/api/net.html#netcreateserveroptions-connectionlistener)

```javascript
const net = require('net');
const buffer = Buffer.alloc(1024 * 8, 'x');
buffer[buffer.length - 1] = 0x0A

const server = net.createServer((socket) => {

  // 处理连接错误
  socket.on('error', (err) => {
    console.error('连接错误：', err.message);
  });

  socket.on('end', () => {
    console.log('客户端已断开连接');
  });

  let i = 0;
  let start = new Date().getTime();
  let n = 0;
  let lastStart = start;
  let lastn = n;

  function send() {
    socket.write(buffer, () => {
      let cur = new Date().getTime()
      if(i < 10) {
        n += buffer.length
        if(cur - lastStart >= 1000) {
          let sn = (n - lastn) / ((cur - lastStart) / 1000)
          console.log((sn / 1000 / 1000 * 8).toFixed(1))
          socket.write(Buffer.from(`--ctrl--:spsec:${sn.toFixed()}\n`))
          lastn = n
          lastStart = cur
          i++
        }
  
        send()
        return
      }
      let sn = n / ((cur - start) / 1000)
      console.log('spfinal', (sn / 1000 / 1000 * 8).toFixed(1))
      socket.write(Buffer.from(`--ctrl--:spfinal:${sn.toFixed()}\n`))
    })
  }
  
  send()
});

server.listen(8000, () => {
  console.log('服务器正在监听 8000 端口');
});

function writeBuffer(socket) {
  socket.write()
}
```



### 客户端

```javascript
const net = require('net');
// const client = net.createConnection({ port: 8000 }, () => {
const client = net.createConnection({ host: '10.6.22.1', port: 8000 }, () => {
  console.log('已连接到服务器');
});

client.on('connect', () => {
    console.log('start');
});

let recvData = ''
client.on('data', (data) => {
  recvData += data.toString()
  // console.log(recvData)
  let recvArr = recvData.split('\n')
  recvArr.forEach((v, i) => {
    // console.log(v.length)
    if(i === recvArr.length - 1) {
      recvData = v + '\n'
    } else {
      if(v.startsWith('--ctrl--:')) {
        console.log(v)
      }
    }
  })
});

client.on('end', () => {
  console.log('与服务器的连接已断开');
});

// 处理连接错误
client.on('error', (err) => {
  console.error('连接错误：', err.message);
});

// 完成后关闭连接
client.on('close', () => {
  console.log('连接已关闭');
});
```

### Buffer

> [buffer 缓冲区 | Node.js v22 文档 (nodejs.cn)](https://nodejs.cn/api/buffer.html)

tcp 客户端服务端的`socket.on('data', function(data) {})`和`socket.write(data)`方法中的`data`都是使用 Buffer。

##### 生成 buffer

```javascript
let buffer = Buffer.alloc(1024 * 8, 'x');
let buffer = Buffer.from(`--ctrl--:spfinal:${sn.toFixed()}\n`
```

buffer 是字节序列，相当于 java 的`byte[]`，不太一样的是 node.js 没有像`byte`一样的数据类型来表示单个的字节，只能以序列形式存在。

##### 修改序列中字节

> [!TIP]
>
> 为了方便呈现字节序列的内容，上方为命令，下方为`buffer.toString().split()`的结果。

```javascript
let x3 = Buffer.alloc('\n', 3)
 [ '\n\n\n' ]
x3[1] = 0x0A 
 [ '\n\n\n' ]
x3[1] = 10
 [ '\n\n\n' ]
x3[1] = '\n'
 [ '\n\x00\n' ]
x3[1] = String.fromCharCode(0x0A)
 [ '\n\x00\n' ]
x3.fill('\n', 1, 2)
 [ '\n\n\n' ]
x3.fill(10, 1, 2)
 [ '\n\n\n' ]
x3.fill(10, 1, 2, 'hex')
 [ '\n\n\n' ]
x3.fill(String.fromCharCode(0x0A), 1, 2)
 [ '\n\n\n' ]
```

可以看到，定义 Buffer 中字节的方式：

初始化：

- `Buffer.alloc`初始化
- `Buffer.from`初始化

修改：

- `buffer[2] = xx`
- `buffer.fill(10, 1, 2)`

**`alloc`、`from`、`fill`都比较正常，可以使用字符串或ASCII码定义，但是`=`进行赋值时，使用字符串不能符合预期**。

