# Promise (ES6)

> # 描述
> 一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 promise，以便在未来某个时候把值交给使用者。
> 
> 一个 Promise 必然处于以下几种状态之一：
> 
> - 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
> - 已兑现（fulfilled）: 意味着操作成功完成。
> - 已拒绝（rejected）: 意味着操作失败。
> 待定状态的 Promise 对象要么会通过一个值被兑现（fulfilled），要么会通过一个原因（错误）被拒绝（rejected）。当这些情况之一发生时，我们用 promise 的 then 方法排列起来的相关处理程序就会被调用。如果 promise 在一个相应的处理程序被绑定时就已经被兑现或被拒绝了，那么这个处理程序就会被调用，因此在完成异步操作和绑定处理方法之间不会存在竞争状态。
> 
> 因为 Promise.prototype.then 和  Promise.prototype.catch 方法返回的是 promise， 所以它们可以被链式调用。
>
> [Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

> # 使用 Promise
>
> Promise 是一个对象，它代表了一个异步操作的最终完成或者失败。
> 
> 本质上 Promise 是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始把回调函数作为参数传入这个函数了。
> 
> 假设现在有一个名为 createAudioFileAsync() 的函数，它接收一些配置和两个回调函数，然后异步地生成音频文件。一个回调函数在文件成功创建时被调用，另一个则在出现异常时被调用。
> 
> 以下为使用 createAudioFileAsync() 的示例：
> 
> ```javascript
> // 成功的回调函数
> function successCallback(result) {
>   console.log("音频文件创建成功: " + result);
> }
> 
> // 失败的回调函数
> function failureCallback(error) {
>   console.log("音频文件创建失败: " + error);
> }
> 
> createAudioFileAsync(audioSettings, successCallback, failureCallback)
> ```
> 
> 更现代的函数会返回一个 Promise 对象，使得你可以将你的回调函数绑定在该 Promise 上。
> 
> 如果函数 createAudioFileAsync() 被重写为返回 Promise 的形式，那么我们可以像下面这样简单地调用它：
> 
> ```javascript
> const promise = createAudioFileAsync(audioSettings);
> promise.then(successCallback, failureCallback);
> Copy to Clipboard
> 或者简写为：
> 
> createAudioFileAsync(audioSettings).then(successCallback, failureCallback);
> ```
> 
> # 约定
> 不同于“老式”的传入回调，在使用 Promise 时，会有以下约定：
> 
> - 在本轮 事件循环 运行完成之前，回调函数是不会被调用的。
> - 即使异步操作已经完成（成功或失败），在这之后通过 then() 添加的回调函数也会被调用。
> - 通过多次调用 then() 可以添加多个回调函数，它们会按照插入顺序进行执行。
>
> > [!TIP]
> > 对约定的理解：
> > 1. 方法链中的 Promise 会逐个决议 - then/catch
> > 2. Promise 对象一旦创建，内部的任务会立即执行，当调用`then`/`catch`时未执行完毕，`then`/`catch`中方法会等待执行完后执行；当调用`then`/`catch`时已执行完毕，`then`/`catch`中方法会立即执行
>
> # 构造函数
> ### Promise()
> 创建一个新的 Promise 对象。该构造函数主要用于包装还没有添加 promise 支持的函数。
> 静态方法
> ### Promise.all(iterable)
> 这个方法返回一个新的promise对象，该promise对象在iterable参数对象里所有的promise对象都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。这个新的promise对象在触发成功状态以后，会把一个包含iterable里所有promise返回值的数组作为成功回调的返回值，顺序跟iterable的顺序保持一致；如果这个新的promise对象触发了失败状态，它会把iterable里第一个触发失败的promise对象的错误信息作为它的失败错误信息。Promise.all方法常被用于处理多个promise对象的状态集合。（可以参考jQuery.when方法---译者注）
> ### Promise.allSettled(iterable)
> 等到所有promises都已敲定（settled）（每个promise都已兑现（fulfilled）或已拒绝（rejected））。
> 返回一个promise，该promise在所有promise完成后完成。并带有一个对象数组，每个对象对应每个promise的结果。
> ### Promise.any(iterable)
> 接收一个Promise对象的集合，当其中的一个 promise 成功，就返回那个成功的promise的值。
> ### Promise.race(iterable)
> 当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象。
> ### Promise.reject(reason)
> 返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法
> ### Promise.resolve(value)
> 返回一个状态由给定value决定的Promise对象。如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定；否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。通常而言，如果您不知道一个值是否是Promise对象，使用Promise.resolve(value) 来返回一个Promise对象,这样就能将该value以Promise对象形式使用。
>
> [Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

# Promise then 和 catch

> [!TIP]
> Promise 决议指一个 promise 已 fulfilled 或 rejected，即已调用了`resolve()`或`reject()`方法

```javascript
Promise.resolve(1)
.then(resp => console.log('resp: ' + resp))

Promise.reject(2)
.catch(err => console.log('err: ' + err))

Promise.reject(2)
.then(resp => console.log('resp' + resp), err => console.log('err: ' + err))

Promise.reject(2)
.then(resp => console.log('resp: ' + resp))
.catch(err => console.log('err: ' + err))

// 输出：
// resp: 1
// err: 2
// err: 2
// err: 2
```

# 链式调用和值传递

> [!TIP]
> 链式调用和值传递的关键是`then`/`catch`方法返回一个 Promise 对象，当`then`/`catch`中传递的方法返回：
> - Promise：等价于将这个 Promise 暴露给后续的方法链[1]
> - 一个值：等价于`Promise.resolve(这个值)`[2]
>
> [Promise.prototype.then - 链式调用 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#%E9%93%BE%E5%BC%8F%E8%B0%83%E7%94%A8)

```javascript
Promise.resolve('1')
// 对应[2]，执行方法链下一个then
.then(resp => {
    console.log('resp: ' + resp)
    return resp + '2'
})
// 对应[1]，且为决议为拒绝，执行方法链下一个catch
.then(resp => {
    console.log('resp: ' + resp)
    return Promise.reject(resp + '3')
})
// 不会执行
.then(resp => {
    console.log('resp: ' + resp)
    return resp + '4'
})
// 对应[2]，所以执行方法链下一个then
.catch(err => {
    console.log('err: ' + err)
    return err + '5'
})
.then(resp => {
    console.log('resp: ' + resp)
})

// 输出：
// resp: 1
// resp: 12
// err: 123
// resp: 1235
```

# 异常

> catch() 方法返回一个Promise (en-US)，并且处理拒绝的情况。它的行为与调用`Promise.prototype.then(undefined, onRejected)` 相同。 (事实上, calling `obj.catch(onRejected)` 内部calls `obj.then(undefined, onRejected))`.
>
> [Promise.prototype.catch() - Javascript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

当 Promise 决议为拒绝后，将会执行方法链的下一个`catch`，且其间的`then`不会执行

```javascript
Promise.reject(1)
.then(resp => console.log('resp1:' + resp))
.then(resp => console.log('resp2:' + resp))
.then(resp => console.log('resp3:' + resp))
.catch(err => console.log('err: ' + err))

// 输出：
// err: 1
```

# 基于 Promise API 的函数

> 你也可以在另一个顶层函数上使用链式去实现基于 Promise API 的函数。
> 
> ```javascript
> function fetch_current_data() {
>   // fetch() API 返回了一个 Promise.
>   // 这个函数提供了类似的API，
>   // 这个函数除了实现 Promise，它还能够完成更多的工作。
>   return fetch('current-data.json').then(response => {
>     if (response.headers.get('content-type') != 'application/json') {
>       throw new TypeError();
>     }
>     var j = response.json();
>     // maybe do something with j
>     return j; // fulfillment value given to user of
>               // fetch_current_data().then()
>   });
> }
> ```

```javascript
function request(url, data, type) {
	var type = type || 'GET';
	return new Promise(function (resolve, reject) {
		$.ajax({
			url: url,
			type: type,
			dataType: "json",
			data: type == 'GET' ? data : JSON.stringify(data),
			async: true,
			contentType: "application/json; charset=utf-8",
			success: function (resp) {
				resolve(resp);
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				reject(textStatus);
			}
		});
	});
}

request('/user/get', {id: 1}).then(resp => console.log(resp))
```

# 等待多个异步结果

- Promise.all(iterable)：所有兑现或任一拒绝
- Promise.allSettled(iterable)：所有兑现或拒绝
- Promise.any(iterable)：第一个兑现
- Promise.race(iterable)：第一个兑现或拒绝

```javascript
function t1(time){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log('on: ' + time)
            resolve('after: ' + time)
        }, time)
    })
}

Promise.all([t1(1000), t1(2000)])
.then(resp => {
    console.log(resp[0]);
    console.log(resp[1]);
})

// 输出：
// on: 1000
// on: 2000
// after: 1000
// after: 2000
```

# MDN 官方示例 - 使用 XHR 加载图像

```javascript
function imgLoad(url) {
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise(function (resolve, reject) {
        // Standard XHR to load an image
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'blob';
        // When the request loads, check whether it was successful
        request.onload = function () {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.response);
            } else {
                // If it fails, reject the promise with a error message
                reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };
        request.onerror = function () {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(Error('There was a network error.'));
        };
        // Send the request
        request.send();
    });
}
// Get a reference to the body element, and create a new image object
var body = document.querySelector('body');
var myImage = new Image();
// Call the function with the URL we want to load, but then chain the
// promise then() method on to the end of it. This contains two callbacks
imgLoad('myLittleVader.jpg').then(function (response) {
    // The first runs when the promise resolves, with the request.response
    // specified within the resolve() method.
    var imageURL = window.URL.createObjectURL(response);
    myImage.src = imageURL;
    body.appendChild(myImage);
    // The second runs when the promise
    // is rejected, and logs the Error specified with the reject() method.
}, function (Error) {
    console.log(Error);
});
```