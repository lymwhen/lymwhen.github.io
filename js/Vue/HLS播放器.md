# HLS 播放器

使用最新版的 video.js 播放海康的 hls，有的流会在第一帧卡住，是因为这些流中有一个音轨（vlc 播放解码器为 ADTS），hls.js 测试正常播放。

```bash
npm install --save hls.js
```

api 和示例：[hls.js/API.md at master · video-dev/hls.js (github.com)](https://github.com/video-dev/hls.js/blob/master/docs/API.md)

官方 demo：[hls.js demo (hls-js.netlify.app)](https://hls-js.netlify.app/demo)

hls.js 通过绑定`video`标签播放，所以它的播放控制通过 hls.js 事件和`video`事件来完成

hls.js 异常事件：

- Hls.ErrorTypes.NETWORK_ERROR
- Hls.ErrorTypes.MEDIA_ERROR
- Hls.ErrorTypes.OTHER_ERROR

> [hls.js/API.md at master · video-dev/hls.js (github.com)](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fifth-step-error-handling)

`video`标签事件：

- timeupdate：`currentTime` 属性指定的时间发生变化。即视频正在播放
- waiting：由于暂时缺少数据，播放已停止。即播放卡住

> [\<video\>: 视频嵌入元素 - HTML（超文本标记语言） | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video#%E4%BA%8B%E4%BB%B6)

正在加载动画：

- [肝了两宿才收集的17个超炫酷的 CSS 动画加载与进度条特效，绝对值得收藏！！！_Amo Xiang的博客-CSDN博客_css好看的进度条](https://blog.csdn.net/xw1680/article/details/118126627)

```javascript
<template>
  <div class="video-container">
    <video id="video"></video>
    <div class="loading-mask" v-if="loading">
      <div class="loading"><span></span></div>
    </div>
  </div>
</template>

<script>
import Hls from 'hls.js'

export default {
  name: 'HlsPlayer',
  data() {
    return {
      // video元素
      video: {},
      url: '',
      // 正在加载标志
      loading: false,
      // video的首次timeupdate标志
      // 测试发现hls播放waiting后，回调用一次timeupdate，但实际并不是加载完成，所以waiting后的第二次timeupdate才视为开始播放
      firstTimeupdate: true,
      // 重新加载次数，用于外界判断是否需要重新生成url等
      reloadCount: 0
    }
  },
  props: {
    // 加载等待时间，超过次时间自动重新加载
    waitTimeoutDelay: {
      type: Number,
      required: false,
      default () {
        return 10000
      }
    }
  },
  components: {
  },
  mounted() {
    this.initVideo()
  },
  methods: {
    initVideo() {
      let that = this
      // 初始化video标签，绑定事件
      this.video = document.getElementById('video')
      this.video.addEventListener('timeupdate', () => {
        // console.log('timeupdate', event);
        // 利用首次加载标志控制仅第二次timeupdate时认为开始播放
        if (this.firstTimeupdate) {
          this.firstTimeupdate = false
          return
        }
        that.onNotWaiting()
      })
      this.video.addEventListener('waiting', (event) => {
        console.log('waiting', event)
        that.onWaiting()
      })
    },
    // 开始等待，refresh表示是否需要重新开始计时（如load方法加载url时）
    onWaiting(refresh) {
      console.log('onWaiting')
      var that = this
      // 重置首次timeupdate标志
      this.firstTimeupdate = true
      // 开始加载标志
      this.loading = true

      // 如需重新开始计时，清除原有计时器
      if (refresh) {
        if (this.waitTimeout) {
          clearTimeout(this.waitTimeout)
          this.waitTimeout = null
        }
      }
      // 设定超时计时器，并忽略重复调用
      if (!this.waitTimeout) {
        this.waitTimeout = setTimeout(function() {
          that.waitTimeout = null
          // 计时完成时重新加载
          that.reload()
        }, this.waitTimeoutDelay)
      }
    },
    // 开始播放
    onNotWaiting() {
      var that = this
      this.loading = false
      // 清除超时计时器
      if (this.waitTimeout) {
        console.log('onNotWaiting')
        clearTimeout(this.waitTimeout)
        that.waitTimeout = null
      }
    },
    // 加载url，isReload表示是否重新加载，传入true将清零reloadCount计数
    load(url, isReload) {
      this.url = url
      if (!isReload) {
        this.reloadCount = 0
      }
      var that = this
      this.onWaiting(true)

      // 销毁hls组件
      if (this.hls) {
        this.video.pause()
        this.hls.destroy()
      }
      if (Hls.isSupported()) {
        this.hls = new Hls({debug: false})
        var hls = this.hls
        // bind them together
        hls.attachMedia(that.video)
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          console.log('video and hls.js are now bound together !')
          // hls.loadSource('');
          hls.loadSource(url)
          hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            console.log(
              'manifest loaded, found ' + data.levels.length + ' quality level'
            )
            // console.log(hls.audioTracks);
            that.video.play()
          })
          hls.on(Hls.ErrorTypes.NETWORK_ERROR, function (event, data) {
            console.error('Hls.ErrorTypes.NETWORK_ERROR ', event, data)
          })
          hls.on(Hls.ErrorTypes.MEDIA_ERROR, function (event, data) {
            console.error('Hls.ErrorTypes.MEDIA_ERROR ', event, data)
          })
          hls.on(Hls.ErrorTypes.OTHER_ERROR, function (event, data) {
            console.error('Hls.ErrorTypes.OTHER_ERROR ', event, data)
          })
        })
      }
    },
    reload() {
      this.reloadCount++
      // 重新加载计数回调
      this.$emit('onReloadCount', this.reloadCount)
      this.load(this.url, true)
    },
    // 截图
    screenshot() {
      let video = this.video
      if (video != null) {
        var canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 300
        canvas.getContext('2d').drawImage(video, 0, 0, 400, 300)
        var src = canvas.toDataURL()

        if (!src) {
          return {success: false, msg: '截图失败，未找到有效图像'}
        }
        return {success: true, src: src}
      }
    }
  },
  beforeDestroy() {
    // 退出销毁hls组件
    if (this.hls) {
      this.video.pause()
      this.hls.destroy()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet">
.video-container
  position relative
  width 100%

  >video
    width 100%
    height 100%

  .loading-mask
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    background-color #00000020

    .loading
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      text-align center
      width 300px
      height 64px

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

</style>

```

> 其他文档：
>
> [Hls.js_API · MyAPI (gitbooks.io)](https://colinrds.gitbooks.io/myapi/content/hlsjsapi.html)
>
> [hls.js库解析（一）---事件链调用 - 简书 (jianshu.com)](https://www.jianshu.com/p/27fad1f623c8)
>
> 可参考的实现：
>
> [Vue使用hls.js拉流播放m3u8文件录播视频 - 简书 (jianshu.com)](https://www.jianshu.com/p/5a496bd5babf)
>
> [videojs判断直播流是否卡住，卡住30秒自动刷新页面 - 简书 (jianshu.com)](https://www.jianshu.com/p/4c14dd4fe7b6)
>
> [在vue中使用hls.js播放hls视频流 - 简书 (jianshu.com)](https://www.jianshu.com/p/ed997ac5ea12)

### 可能出现的问题

##### DOMException : play() can only be initiated by a user gesture

在`Hls.Events.MEDIA_ATTACHED`事件中调用`video.play()`可能报错：

```
DOMException : play() can only be initiated by a user gesture
```

原因是从 chromium 某个版本开始，必须要用户操作网页后`video`的`play`等方法才可以调用，貌似和无法直接播放声音是一个问题。

Android 参考[Android/WebView/[DOMException : play() can only be initiated by a user gesture](http://localhost:3000/#/Android/WebView?id=domexception-play-can-only-be-initiated-by-a-user-gesture)](Android/WebView.md?id=domexception-play-can-only-be-initiated-by-a-user-gesture)
