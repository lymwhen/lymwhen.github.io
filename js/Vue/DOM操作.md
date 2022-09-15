# DOM操作

# 元素移动

```html
<div>
    <div class="icon_bg add" :class="{'show': showIcon}" v-on:click="addApp($event)" @click.prevent.stop>+</div>
</div>
```

```js
    // 演示常用应用的新增和减少
    removeApp(e) {
      let dom = e.currentTarget.parentElement
      dom.remove()
    },
    addApp(e) {
      let comDom = document.getElementById('comAppWarp')
      let dom = e.currentTarget
      dom.className = 'icon_bg del show'
      dom.innerHTML = '-'
      let domParent = dom.parentElement
      comDom.append(domParent)
    }
```

