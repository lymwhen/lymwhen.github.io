# node.js

### 安装

```bash
# 安装项目依赖，会根据项目的package.json进行安装
npm install
npm i

# 新增项目依赖，安装后自动写入项目的package.json中
# 项目依赖，会自动写入dependencies，例如项目运行使用富文本组件
npm i xxx --save
# 开发依赖，会自动写入devDependencies，例如打包资源复制插件copy-webpack-plugin
npm i xxx --save-dev

# 全局安装，在任意地方都可以调用，一般用于安装npm、yarn、vue-cli等工具、脚手架
npm install -g yarn

# 安装指定版本
npm install --save vue@2.6.14

# 卸载
npm -g uninstall yarn
```

```bash
# 本次安装使用源
npm install --registry=https://registry.npmmirror.com
npm install --registry https://registry.npmmirror.com

# 本次安装使用代理
npm install --proxy=http://localhost:7890
```



### 配置

通过`npm config`命令配置后，将会在全局生效。

```bash
# 查看全部配置
npm config list

# 配置源
npm config set registry https://registry.npmmirror.com
npm config get registry
npm config delete registry

# 配置代理
npm config set proxy http://localhost:7890
npm config get proxy
npm config delete proxy
```

> [!NOTE]
>
> 淘宝源已经关闭，建议使用`https://registry.npmmirror.com`源，比默认的源快很多。可以解决`npm install`慢，或者卡在`sill idealTree buildDeps`的问题。

# node 工程

```bash
my-node-app/
│
├── package.json
├── package-lock.json
├── .gitignore
├── node_modules/            # 存放 npm 包的目录，通常不手动创建，由 npm 自动生成
│
├── bin/                     # 存放可执行文件的脚本
│   └── www
│
├── app/                     # 应用程序的主要逻辑
│   ├── controllers/        # 请求处理器
│   ├── models/             # 数据模型
│   ├── routes/             # 路由定义
│   └── services/           # 业务逻辑服务
│
├── config/                  # 配置文件
│   ├── config.js
│   ├── database.js
│   └── express.js
│
├── public/                  # 静态文件（如 CSS、JavaScript、图片等）
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/                   # 模板文件（如果使用模板引擎）
│
├── test/                    # 测试文件
│
└── logs/                    # 日志文件
```

### package.json

规定了 node 工程的名称、版本、脚本、依赖等信息。

- scripts：工程的运行脚本

```json
"scripts": {
  "dev": "vue-cli-service serve",
  "build:prod": "vue-cli-service build",
  "build:stage": "vue-cli-service build --mode staging",
  "preview": "node build/index.js --preview",
  "lint": "eslint --ext .js,.vue src"
},
```

例如`dev`，表示可以通过`npm run dev`，来运行开发环境，实际执行的命令是`vue-cli-service serve`。在 idea 中可以点击左侧的三角图标运行。可以自行添加需要脚本。

- dependencies：项目依赖，如富文本组件，对应`npm install --save`
- devDependencies：开发依赖，如打包资源复制插件copy-webpack-plugin，对应`npm install --save-dev`

### package-lock.json

由`npm install`时自动生成，不应该被手动编辑。**可以在其中查看各组件实际安装的版本**。

> [!TIP]
>
> 当安装出问题时，可尝试删除`package-lock.json`和`node_modules`，然后重新安装。

### .env 环境变量

工程根目录下可以创建`.env`开头的文件，代表不同环境中的环境变量配置。

```bash
-a----         2024/6/30      8:02            226 .env.development
-a----         2024/6/30      8:02            165 .env.production
-a----         2024/6/30      8:02            188 .env.staging
```

- .env.development：开发环境
- .env.production：线上环境

```bash
# 页面标题
VUE_APP_TITLE = 若依管理系统
# 基础地址
VUE_APP_API_BASE_URL = '/prod-api'
```

> [!TIP]
>
> 字符串中如果有特殊符号，最好使用引号。

在开发中使用环境变量：

```bash
# 当前环境，development/production/staging
process.env.NODE_ENV === 'production' ? 'build' : 'dev',

# 调用环境变量
const define = {
  copyright: 'Copyright @ 2024',
  sysVersion: 'V1.0',
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 1000000,
}
```



# HelloWrold

```bash
# 创建项目
npm init
```

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

# Node 与浏览器支持的模块规范

> | 条目     | Node                         | 浏览器                 |
> | -------- | ---------------------------- | ---------------------- |
> | 模块规范 | CommonJS                     | ES6                    |
> | 导出     | `* modules.exports`; exports | export; export default |
> | 引入     | require                      | import；require        |
>
> [export报错SyntaxError: Unexpected token export_unexpected token 'export-CSDN博客](https://blog.csdn.net/weixin_40817115/article/details/81534819)

##### node

des.js

```nginx
function strEnc(xxx) {
    return xxx
}

module.exports = {
  strEnc
}
```

主 js

```nginx
let args = process.argv.splice(2)

var des = require('./des')
console.log(des.strEnc(args[0], args[1], args[2], args[3]))
```

##### 浏览器

utils.js

```nginx
function strEnc(xxx) {
    return xxx
}

export default {
  strEnc
}
```

主 js

```nginx
import utils from '../../common/js/utils.js'
// 或
const utils = require(`../../common/js/flow/${this.flowParams.code}.js`)
console.log(des.strEnc(args[0], args[1], args[2], args[3]))
```

