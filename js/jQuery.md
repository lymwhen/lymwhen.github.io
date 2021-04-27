# jQuery

# 循环数组、对象

```javascript
$.each($('#form').find('input,select'),function(index,item){
    assessObj[$(item).attr('name')]=$(item).val();
});
```

# 元素选择器

> 元素选择器获得的对象为jQuery对象	

```javascript
$('#form') // id
$('.form') // class
$('tr') // tag
$('[name="test"]') // 属性
$('input.password') // and
$('div .password') // 从元素中选择子元素
$('#form').find('input,select') // 从元素中选择子元素
$('#form').parent() // 父元素
$('#div').next() // 同级下一元素
$('#div').prev() // 同级上一元素
$(':checkbox') // checkbox
$(':checkbox:checked') // 选中的checkbox
$(':not(:checked)') // 未选中的checkbox
$('input:checked').not('input[name*="-"]') // 排除
```

### 当前元素索引

```javascript
var elem = $('#oaLists li.layui-this');
var index = $('#oaLists li').index(elem);
```

```javascript
var i = $('option:selected', '#pdfMenu').index();
```



# jQuery 对象与 DOM 对象

## 	jQuery对象转DOM对象

```javascript
oDiv[0]
```

## 	DOM对象转jQuery对象

```javascript
$(oDiv[0])
```

# 	获得/设置 属性/样式

> jQuery颜色渐变效果需引入jquery.color.js

```javascript
var xxx = $(".coursesPeriod").attr('id')
$(".coursesPeriod").attr('id', '1')

var xxx = $(".coursesPeriod").prop('checked')
$(".coursesPeriod").prop('checked', true)

$(".coursesPeriod").css({"borderColor":"#f0f0f0","color":"#333"});
// 恢复默认
$(".coursesPeriod").css({"borderColor":""});

$("html,body").animate({scrollTop:0}, 300);
$(".coursesPeriod").animate({"borderColor":"#f0f0f0","color":"#333"});
```

# 合并对象

```javascript
// 将arg2参数合并/覆盖到arg1中，返回arg1
var zzz = $.extend(xxx, {x: 100})
// 克隆对象
var zzz = $.extend({}, yyy)
```

# 事件

## 	点击

```javascript
// 重新添加元素需要重新设置
$("span").click(function(){});
// 重新添加元素不需要重新设置
$("#appConfigList").on("click",".appBox",function(){});
```

### 修改

```javascript
$("#unitWord").change(function (data) {
    $(this).val()
})
```

### 取消事件

```javascript
$('.layui-colla-title').unbind('click');
```

> 重复设置元素点击事件会导致事件方法多次执行，解决办法：
>
> 1. 在设置之前先解绑
> 2. 使用document事件

### 将事件挂到Document

元素重新加载后事件依然有效

```javascript
//显示分组、分层表单
$(document).on("click", ".shareTo", function() {
    alert($(this).attr('id'))
})
```
# 调用iframe中的方法

```javascript
$('#content')[0].contentWindow.closePage
```

# 阻止事件冒泡到父元素

```javascript
return false
event.stopPropagation();

$("span").click(function(event){
	event.stopPropagation();
	alert("The span element was clicked.");
});
```

# AJAX

## 	post

```javascript
$.post('/api/test', {name: 'test'}, function(data){}, 'json')

$.ajax({  
    url:'${rc.contextPath}/affairs/studentSave',
    data:{name: 'test'},
    type:'post',  
    dataType:"json",  
    success:function(data){ 
        initTable();
    }
});
```

## 	get

```javascript
$.get('/api/test', function(data){}, 'json')、
   
$.ajax({  
    url:'${rc.contextPath}/affairs/studentSave',
    type:'get',  
    dataType:"json",  
    success:function(data){ 
    	initTable();
    }
});
```

# 方法

### jQuery对象

```
attr
prop
val
text // span标签
addClass
removeClass
```

