# UEditor

# 初始化      

```javascript
$(document).ready(function() {          
    initUE();
}); 
function initUE(){
    var ue = UE.getEditor('editor');
    ue.ready(function() {//编辑器初始化完成再赋值 
        ue.setContent('${org.profile!''}');
    }); 
}
```



# 赋值

```javascript
UE.getEditor('editor').setContent('');
```

# 取值

```javascript
UE.getEditor('editor').getContent();
```

