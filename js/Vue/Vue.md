# Vue

```bash
# 安装vue
npm install -g vue
# 安装vue 2.0
npm install -g vue@2.6.14
# 安装vue-cli
npm install -g @vue/cli

# 查看vue/cli版本
vue --version
# 创建项目
vue create test1
```

> [Vue.js 2.0 (vuejs.org)](https://v2.cn.vuejs.org/)
>
> [安装 — Vue.js (vuejs.org)](https://v2.cn.vuejs.org/v2/guide/installation.html)
>
> [Installation | Vue CLI (vuejs.org)](https://cli.vuejs.org/guide/installation.html)

# 引入图片

```javascript
import noPic from '@/assets/images/no-pic.png'
// 或者
// let noPic2 = require('@/assets/images/marker_blue.png')
// let noPic2 = require('../../assets/images/marker_blue.png')

export default {
  name: 'Mine',
  data() {
    return {
      noPic: noPic,
      noPic2: require('../../common/image/defaultHead.png')
    }
  },
}
```

```html
<img :src="noPic"/>
<img :src="noPic2"/>
```

> [!TIP]
>
> 使用`@`作为`src`路径别名需要在`vue.config.js`中配置：
>
> ```javascript
> module.exports: {
>   configureWebpack: {
>     name: name,
>     resolve: {
>       alias: {
>         '@': resolve('src')
>         // 或者
>         // '@': path.resolve(__dirname, 'src')
>       }
>     },
>   }
> }
> ```

### 动态引入

```javascript
let script = require(`../../common/js/scripts/${this.module.code}.js`)
let icon = require(`../../common/js/scripts/icon_${this.module.code}.png`)
```

# css

### 仅在本组件生效

在`style`标签中使用`scoped`

```css
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
</style>
```

> [!NOTE]
>
> `scoped`默认仅在本组件生效，在其他组件、子组件中均不生效。

在子组件中也生效

```css
<style lang="scss" scoped>
.avatar-uploader::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader::v-deep .el-upload:hover {
  border-color: #409EFF;
}
</style>
```

> [深度解析为什么vue组件中添加scoped后某些样式不生效？给出解决办法_vue scoped 样式不生效-CSDN博客](https://blog.csdn.net/qq_41800366/article/details/107062781)
>
> [Scoped CSS | Vue Loader (vuejs.org)](https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors)

### 帧动画

css

```css
.box>span {
    animation: loader 1000ms infinite linear;
    border-radius: 100%;
    border: 6px solid #2dbb55;
    border-left-color: transparent;
    color: transparent;
    display: inline-block;
    line-height: 1.2;
    width: 50px;
    height: 50px;
}
@keyframes loader {
    0% {  transform: rotate(0deg);  }
    100% {transform: rotate(360deg);}
}
```

stylus

```stylus
>span
  animation loader 1000ms infinite linear
  @keyframes loader
      0%
          transform rotate(0deg)
      100%
          transform rotate(360deg)
  border-radius 100%
  border 6px solid #2dbb55
  border-left-color transparent
  color transparent
  display inline-block
  line-height 1.2
  width 50px
  height 50px
```

> stylus

> [css预处理框架stylus——@keyframes 帧动画 和@font-face字体引入_@红@旗下的小兵的博客-CSDN博客](https://blog.csdn.net/qq_42778001/article/details/101540267)



# vscode 设置

### 保存自动修正

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
}
```

### stylus 不使用分号冒号（输入时）

插件：`stylus`，参看插件商店详情页

```json
{
    // Use ':' as separator between property and value
    "languageStylus.useSeparator": false, // default value
}
```

### 格式化

插件：`Vuter`

> [Formatting | Vetur (vuejs.github.io)](https://vuejs.github.io/vetur/guide/formatting.html#formatters)
>
> These formatters are available:
>
> - [`prettier` (opens new window)](https://github.com/prettier/prettier): For css/scss/less/js/ts.
> - [`prettier` (opens new window)](https://github.com/prettier/prettier)with [@prettier/plugin-pug (opens new window)](https://github.com/prettier/plugin-pug): For pug.
> - [`prettier-eslint` (opens new window)](https://github.com/prettier/prettier-eslint): For js. Run `prettier` and `eslint --fix`.
> - [`stylus-supremacy` (opens new window)](https://github.com/ThisIsManta/stylus-supremacy): For stylus.
> - [`vscode-typescript` (opens new window)](https://github.com/Microsoft/TypeScript): For js/ts. The same js/ts formatter for VS Code.
> - [`sass-formatter` (opens new window)](https://github.com/TheRealSyler/sass-formatter): For the .sass section of the files.
>
> You can choose each language's default formatter in VS Code config, `vetur.format.defaultFormatter`. **Setting a language's formatter to `none` disables formatter for that language.**
>
> 可以选择语言的默认 formatter，使用`vetur.format.defaultFormatter`，默认设置为：
>
> ```json
> {
>   "vetur.format.defaultFormatter.html": "prettier",
>   "vetur.format.defaultFormatter.pug": "prettier",
>   "vetur.format.defaultFormatter.css": "prettier",
>   "vetur.format.defaultFormatter.postcss": "prettier",
>   "vetur.format.defaultFormatter.scss": "prettier",
>   "vetur.format.defaultFormatter.less": "prettier",
>   "vetur.format.defaultFormatter.stylus": "stylus-supremacy",
>   "vetur.format.defaultFormatter.js": "prettier",
>   "vetur.format.defaultFormatter.ts": "prettier",
>   "vetur.format.defaultFormatter.sass": "sass-formatter"
> }
> ```

##### html 的 formatter 为`prettier`

> [vetur/htmlFormat.ts at master · vuejs/vetur (github.com)](https://github.com/vuejs/vetur/blob/master/server/src/modes/template/services/htmlFormat.ts)

从默认设置中可以看到坑爹的是 html 默认 formatter 竟然是`prettier`:dog:

```json
{
  // 修改默认formatter为js-beautify-html
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      // 折行
      "wrap_line_length": 120,
      // 属性
      "wrap_attributes": "auto",
      "end_with_newline": false
    },
  },
}
```

##### js 的 formatter 为`prettier`

> [Options · Prettier](https://prettier.io/docs/en/options.html)

```json
{
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      // 末尾分号
      "semi": false,
      // 单引号
      "singleQuote": true,
      // 尾随逗号
      "trailingComma": "none"
    },
  },
}
```

##### stylus 的 formatter 为`stylusSupremacy`

插件：`stylusSupremacy`

> [Formatting | Vetur (vuejs.github.io)](https://vuejs.github.io/vetur/guide/formatting.html#stylus-supremacy)
>
> Other settings are read from `stylusSupremacy.*`. You can install [Stylus Supremacy extension (opens new window)](https://marketplace.visualstudio.com/items?itemName=thisismanta.stylus-supremacy)to get IntelliSense for settings, but Vetur will work without it. A useful default:
>
> 可以下载[Stylus Supremacy extension (opens new window)](https://marketplace.visualstudio.com/items?itemName=thisismanta.stylus-supremacy)扩展获得智能设置
>
> ```json
> {
>   // class的大括号
>   "stylusSupremacy.insertBraces": false,
>   // 属性名和值中的冒号
>   "stylusSupremacy.insertColons": false,
>   // 末尾分号
>   "stylusSupremacy.insertSemicolons": false
> }
> ```

### editor

> [VSCode中的用户自定义配置文件settings.json和默认配置defaultSettings.json_wuyujin1997的博客-CSDN博客_settings.json](https://blog.csdn.net/wuyujin1997/article/details/89318361)

```json
{
  "editor.suggestSelection": "first",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```

### vsintellicode

```json
{
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
}
```

