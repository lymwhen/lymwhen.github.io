# Vue



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

