# js 封装

封装 js 方法时，如果有多个方法协同维护的变量，可封装为 js 类，已实现组件化复用。

# jQuery 封装类

```javascript
(function () {
    //
})();

var Id = function (i) {
  this.id = document.getElementById(i);
};
window.$ = function (i) {
  return new Id(i);
};

console.log($('main'));
```

# 示例

```javascript
function Person(name){
    this.name = name;   
}
Person.prototype.setName = function(name){
    this.name = name;
}

var p1 = new Person('haiyiya');
var p2 = new Person('haierya');
p2.setName('haisanya');

console.log(p1.name);
haiyiya
console.log(p2.name);
haisanya
```

# 封装 layui 弹窗选人

### js

```javascript
function SelLayer(){
    return this;
}

SelLayer.prototype.getOption = function(){
    return this.option;
}

SelLayer.prototype.init = function(option){
    this.option = option;
    this.oDiv = $(this.option.selector)

    // 初始赋值和填充
    for(var i = 0; i < this.option.values[this.option.idKey].length; i++){
        var obj = {};
        $.each(this.option.values, function(i1, v1){
            obj[i1] = v1[i]
        });
        this.oDiv.find('>i').before('<a href="javascript:;" ' + this.option.idKey + '="' + obj[this.option.idKey] + '"><span>'+obj[this.option.showKey]+'</span><i></i></a>');
    }

    var that = this;
    $(this.option.selector).on("click","a i",function(){ 
        that.removeSel(this);
    })

    $(this.option.selector).on("click",">i",function(){
        layui.layer.open({
            type:2,
            shade: 0.1,
            content: [that.option.content,'no'],
            area: ['800px', '550px'],
            title: that.option.title, 
            btnAlign: 'c',
            btn: ['确定', '取消'],
            yes: function(index, layero){
                var parentWin = layero.find('iframe')[0].contentWindow;
                var data = parentWin.getData();

                if(that.option.single){
                    // 单选
                    if(data.length > 0){
                        // 清空数据
                        $.each(that.option.values, function(i, v){
                            that.option.values[i] = []
                        })
                        // 清空div
                        $(that.option.selector).find('a').remove();
                        that.addSel(data[0]);
                    }
                }else{
                    // 多选
                    $.each(data, function(i0, v0){
                        that.addSel(v0);
                    })
                }

                layer.close(index);
            }
        });
    });

    return this;
}

SelLayer.prototype.addSel = function(data){
    // 重复检查
    if(this.option.values[this.option.idKey].indexOf(data[this.option.idKey]) >= 0){
        return false;
    }

    var o = $(this.option.selector);
    // 向各个数组添加数据
    $.each(this.option.values, function(i, v){
        v.push(data[i] || '');
    })
    // 填充 div
    o.find('>i').before('<a href="javascript:;" ' + this.option.idKey + '="' + data[this.option.idKey] + '"><span>'+data[this.option.showKey]+'</span><i></i></a>');
}

SelLayer.prototype.removeSel = function(eo){
    var o = $(eo);
    // 根据 idKey 获取 id
    var id = o.parent().attr(this.option.idKey);
    // 移除数据
    var i = this.option.values[this.option.idKey].indexOf(id);
    if(i >= 0){
        $.each(this.option.values, function(i, v){
            v.splice(i, 1);
        })
    }
    // 移除 div 显示
    o.parent().remove();
}
```

### 选人页面

##### 控制器

```java
@RequestMapping("/sel")
public ModelAndView sel(ModelAndView modelAndView, @RequestParam(required=false) String searchObj) {
    if(searchObj != null) {
        modelAndView.addObject("searchObj", searchObj);
    }
    modelAndView.setViewName("/space/coreInfo/corePersonnelSel");
    return modelAndView;
}
```

##### html

```html
<!DOCTYPE HTML>
<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <title>云南省特殊教育</title>
    <link rel="stylesheet" type="text/css" href="${rc.contextPath}/js/layui/css/layui.css" media="all">
    <link rel="stylesheet" type="text/css" href="${rc.contextPath}/css/edusmart.css">
    <script type="text/javascript" src="${rc.contextPath}/js/json2.js"></script>
    <script type="text/javascript" src="${rc.contextPath}/js/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="${rc.contextPath}/js/layui/layui.js"></script>
    <script type="text/javascript" src="${rc.contextPath}/js/base.js"></script>
    <script type="text/javascript">
        var contextPath = "${rc.contextPath}";
    </script>
    <style type="text/css">
        #sel .layui-select-title input {
            height: 30px;
            width: 130px;
        }

        a:HOVER {
            color: #35c672;
        }

        #provincesWrap,
        #citiesWrap,
        #areaWrap,
        #typeWrap {
            position: relative;
            float: left;
            margin-right: 15px;
            width: 150px;
        }

        #typeWrap input,
        #provincesWrap input,
        #citiesWrap input,
        #areaWrap input {
            height: 32px;
            line-height: 32px;
            border-radius: 3px;
        }
    </style>
</head>

<body style="overflow:auto; overflow-x:hidden; background-color:#fff; ">
    <form class="layui-form" style="margin-top: 10px;">
        <div class="layui-form-item" style="margin-bottom: 5px;">
            <div id="provincesWrap" class="select-wrapper-hide">
                <select name="provinces" id="provinces" lay-filter="provinces">
                    <option value="">请选择省</option>
                </select>
            </div>
            <div id="citiesWrap" class="select-wrapper-hide">
                <select name="cities" id="cities" lay-filter="cities">
                    <option value="">请选择州/市</option>
                </select>
            </div>
            <div id="areaWrap" class="select-wrapper-hide">
                <select name="areas" id="areas" lay-filter="areas">
                    <option value="">请选择县/区</option>
                </select>
            </div>
            <div class="list_search" style="float: left;margin-top: 0px;margin-right: 10px;">
                <input id="search" name="search" placeholder="请输入关键字查询" />
                <button class="list_search_tj" lay-submit lay-filter="search">搜索</button>
            </div>
        </div>
    </form>
    <table class="layui-table"
        lay-data="{id:'gride',height: 'full-70', cellMinWidth: 80, cellMaxWidth: 140,page: true, limit:20}">
        <thead>
            <tr>
                <th lay-data="{type:'checkbox'}">ID</th>
                <th lay-data="{field:'name', width:150}">姓名</th>
                <th lay-data="{field:'phone', width:220}">电话号码</th>
                <th lay-data="{field:'postName', width:160}">职务</th>
                <th lay-data="{field:'unitName'}">所在部门</th>
            </tr>
        </thead>
    </table>
    <#assign u=UserUtils.getUser()>
    <script type="text/javascript">
        layui.use(['jquery', 'table'], function () {
            var $ = layui.jquery;
            var form = layui.form;
            var table = layui.table;
            // 接收初始搜索参数
            var par = JSON.parse('${searchObj!'{}'}');

            // 初始化下拉
            userRegionId = '${u.unit.regionId}';
            regionLevels = [{ id: 'provinces', defaultText: '请选择省' }, { id: 'cities', defaultText: '请选择州/市' }, { id: 'areas', defaultText: '请选择县/区' }];
            nextRegionLevel(0, '${Constants.DIC_ID_REGION}');

            // 下拉事件及回调
            initRegionEvent(function (regionLevel, data, regionId) {
                par.searchRegionId = trimSearchRegionId(regionId);
                initTable();
            });

            getData = function () {
                var checkStatus = table.checkStatus('gride');
                return checkStatus.data;
            }

            form.on("select(roleId)", function (data) {
                initTable({ roleId: data.value })
            });

            function initTable(parameter) {
                par = $.extend(par, parameter);
                table.reload('gride', {
                    url: '${rc.contextPath}/coreInfo/corePersonnel/list'
                    , where: { data: JSON.stringify(par) } //设定异步数据接口的额外参数
                });
            }
            initTable();

            //搜索
            form.on('submit(search)', function (data) {
                initTable(data.field);
                return false;
            });
        });
    </script>
</body>

</html>
```

# 表单内调用

### css

```css
.layui-lable {
	border: 1px solid #d2d2d2;
	line-height: normal;
	height: auto;
	padding: 4px 10px;
	overflow: hidden;
	min-height: 28px;
	left: 0;
	z-index: 99;
	position: relative;
	background: none;
}

.layui-lable a {
	padding: 2px 5px;
	background: #908e8e;
	border-radius: 2px;
	color: #fff;
	display: block;
	line-height: 20px;
	height: 20px;
	margin: 2px 5px 2px 0;
	float: left;
}

.layui-lable a span {
	float: left;
}

.layui-lable a i {
	float: left;
	display: block;
	margin: 2px 0 0 2px;
	border-radius: 2px;
	width: 8px;
	height: 8px;
	background: url("../images/oldLayui/close.png") no-repeat center;
	background-size: 65%;
	padding: 4px;
}

.layui-lable a i:hover {
	background-color: #545556;
}

.layui-lable>i {
	font-family: "layui-icon" !important;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #1E9FFF;
	cursor: pointer;
	padding: 2px 5px;
	border: 1px solid #1E9FFF;
	border-radius: 2px;
	display: block;
	line-height: 20px;
	height: 20px;
	margin: 2px 5px 2px 0;
	float: left;
}

.layui-lable>i:hover {
	border: 1px solid #009688;
	color: #009688;
}

.layui-lable>i:before {
	content: "\e654";
}
```



### 表单项

```html
<div class="layui-form-item">
    <label class="layui-form-label"><em style="color:red;">*</em>观察人</label>
    <div class="layui-input-block">
        <div id="observePersonDiv" class="layui-lable" >
            <i></i>
        </div>
    </div>
</div>
```

### 调用

```javascript
var observeSel = new SelLayer().init({
    title: '选择人员',
    // 链接及初始搜索条件
    content: '${rc.contextPath}/coreInfo/corePersonnel/sel?searchObj=' + encodeURIComponent(JSON.stringify({typeId: 'xjzx'})), 
    // 表单项选择器
    selector: '#observePersonDiv', 
    // 是否单选
    single: false, 
    // 数据对象 id 键
    idKey: 'id', 
    // 数据对象显示键
    showKey: 'name', 
    // 要保存的键值及初始值
    values: {
        id: '${info.observePersonId!''}' ? '${info.observePersonId!''}'.split(',') : [], 
        name: '${info.observePerson!''}' ? '${info.observePerson!''}'.split('、') : []
	}
});
```

### 取值

```javascript
form.on('submit(save)', function (data) {
    uploadLoading = layer.msg('正在保存...', {
        time: 0,
        icon: 16,
        shade: 0.1
    });

    // 取值
    data.field.observePersonId = observeSel.getOption().values['id'].join(',');
    data.field.observePerson = observeSel.getOption().values['name'].join('、');
    
    data.field.content = UE.getEditor('editor').getContent();
    data.field.enclosure = enclosures.join(';');
    if (data.field.enclosure == '') {
        layer.alert("请上传附件！！！");
    } else {
        $.post("${rc.contextPath}/studentService/behaviorRecord/save", data.field, function success(data) {
            if (data.success) {
                parent.init();
                parent.layer.closeAll();
            } else {
                layer.alert(data.msg);
            }
        }, "json");
    }
    return false;
});
```

# 扩展 js 对象方法

```javascript
Array.prototype.indexOf = function(elt /*, from*/){
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
        ? Math.ceil(from)
    : Math.floor(from);
    if (from < 0)
        from += len;

    for (; from < len; from++){
        if (from in this && this[from] === elt)
            return from;
    }
    return -1;
};
```

