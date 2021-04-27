# js

# 对象

```javascript
// 数组是否包含索引
index in arr
// 对象是否包含键
xx.hasOwnProperty(key)

// 循环
for(var i in arr){
    console.log(i); //键
    console.log(arr[i]); //值
}
```

### 合并对象

```javascript
// 将arg2参数合并/覆盖到arg1中，返回arg1
var zzz = Object.assign(xxx, {x: 100})
// 克隆对象
var zzz = Object.assign({}, yyy)
```



# iFrame

向 iFrame 填充 html

```javascript
// 清空 iFrame
$('#pdfContent')[0].contentWindow.document.write('<body></body>');
// 调用 close 方法，后面的 write 将不再追加，而是覆盖
$('#pdfContent')[0].contentWindow.document.close();

// 修改 body 内容
$('#pdfContent')[0].contentWindow.document.body.innerHTML = '<div>文件正在转码中，您可以<a href="javascript:void(0);" onclick="parent.downloadOriginFile()">点击下载</a></div>'
```

调用 iFrame 方法

```
$('#pdfContent')[0].contentWindow.getData()
```

调用父级方法或变量

```
parent.initTable();
// 顶层
top.initTable();
```



# 方法

```javascript
join
split
JSON.stringify
JSON.parse
```



### Array.shift(xx)

从首位插入

### Array.splice(2, 1, items...)

从2位置，删除1位，插入items

### toFixed(1)

保留一位小数（向下取整）

# 可变长度参数

```javascript
function test(text, ...args){
    alert(text);
    for(var i = 0; i < args.length; i++){
        console.log(args[i])
    }
}
```

### IE

```javascript
function test(text){
    alert(text);
    var args = Array.prototype.slice.call(arguments, test.length);
    console.log(args.length)
    for(var i = 0; i < args.length; i++){
        console.log(args[i])
    }
}
```
