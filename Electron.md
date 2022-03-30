# Electron

> [electron 官方文档](https://www.electronjs.org/zh/docs/latest/tutorial/quick-start)
>
> 更换 npm 源为淘宝源
>
> ##### 临时
> ```bash
> npm --registry https://registry.npm.taobao.org install express1
> ```
>
> ##### 永久
> ```bash
> npm config set registry https://registry.npm.taobao.org
> # 验证
> npm config get registry
> ```

安装

```bash
npm i -g electron
npm i -g electron-forge
```

> [!TIP]
>
> npm i 就是 npm install

初始化应用

```bash
electron-forge init
npm start
```

# Electron Fiddle

> [Electron Fiddle](https://www.electronjs.org/fiddle)
>
> 你可以使用 Electron Fiddle 创建并运行小段 Electron 程序，从一个简单的模板开始，随心所欲地挥洒你的创意，选择一个 Electron 版本欣赏运行效果。最后，你可以将其下载保存，或推送 GitHub Gist 上，所有人都可以输入网址运行你的 Fiddle。

下载安装，打开，正常情况下左上角 electron 版本旁边会是 run 按钮，如果一直在`Checking status`，说明 electron 安装的不正确