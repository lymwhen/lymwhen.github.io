# node.js

```bash
# 安装组件
npm install vue
npm i vue
# 把依赖写入进devDependencies对象里面
npm i xxx --save-dev
# 把依赖写入进dependencies对象里面
npm i xxx --save
# 安装指定版本
npm install -g vue@2.6.14

# 全局安装
npm install -g vue

# 使用淘宝源
# 一说建议不要用cnpm安装 会有各种诡异的bug可以通过如下操作解决npm下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org
npm install --registry https://registry.npm.taobao.org

# 安装yarn
npm install -g yarn

# 使用代理
npm install --proxy http://localhost:10809
yarn install --proxy http://localhost:10809

# 创建项目
npm init
```

# HelloWrold

`npm init`后，工程目录会出现 package.json 文件

```json
{
  // 项目基本信息
  "name": "wechat_directurl",
  "version": "1.0.0",
  "description": "",
  // 入口文件
  "main": "index.js",
  // 脚本
  // 例如创建start执行node index.js，运行npm run start即可启动项目
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  "author": "lyml",
  "license": "ISC",
  // 依赖项
  // 可通过命令npm i xxx --save添加依赖，会自动加入到这里
  // 也可手动输入依赖和版本，然后npm i安装
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

##### 编写入口文件 index.js

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

> [Express "Hello World" example - Express 中文文档 | Express 中文网 (expressjs.com.cn)](https://www.expressjs.com.cn/starter/hello-world.html)

##### 引入 js 文件

utils.js

```javascript
function getPars(parsStr) {
    var pars = {};
    var arr = parsStr.split(/[?|&]/);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].indexOf('=') >= 0) {
            var pArr = arr[i].split('=');
            pars[pArr[0]] = decodeURIComponent(pArr[1]);
        }
    }
    return pars;
}

function getParsStr(pars) {
    var str = '';
    for (var i in pars) {
        str += '&' + i + '=' + encodeURIComponent(pars[i]);
    }
    return str.replace(/^&/g, '?')
}

module.exports = {
    getPars,
    getParsStr
}
```

index.js

```javascript
const utils = require('./utils.js')

let map = utils.getPars('?id=1')
```

