# EventBus

使用事件总线 EventBus 可以方便地实现 Vue 组件间通信

# 在 main.js 中定义 EventBus

```javascript
import Vue from 'vue'
// eventBus 通信组件
let eventBus = new Vue()
// 添加为 Vue 的静态属性
Vue.prototype.$EventBus = eventBus
```

# 在组件创建时注册事件

```javascript
methods: {
    countRefreshHandle(code) {
        console.log(code)
    }
},
created() {
    this.$EventBus.$on('countRefresh', this.countRefreshHandle)
},
```

# 在组件销毁时注销事件

```javascript
beforeDestroy() {
    this.$EventBus.$off('countRefresh', this.countRefreshHandle)
}
```

# 提交事件

> 支持参数传递

```
this.$EventBus.$emit('countRefresh', code)
```

