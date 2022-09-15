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

# stylus

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

> [css预处理框架stylus——@keyframes 帧动画 和@font-face字体引入_@红@旗下的小兵的博客-CSDN博客](https://blog.csdn.net/qq_42778001/article/details/101540267)
