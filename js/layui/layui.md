# layui

# 表单

```html
# 必填、校验
lay-verify="required"
lay-verify="required|number"
# 事件过滤器
lay-filter="leaveType"
# 关闭自动填充
autocomplete="off"
# select多选
multiple=""
```

### 赋值

```javascript
o.prop('checked', true);
o.val('xx');
```



### 下拉

```html
<select id="leaveType" name="leaveType" lay-verify="required" lay-filter="leaveType">
    <option value="">请选择</option>
    <option value="带薪假">带薪假</option>
    <option value="其他">其他</option>
</select>
```

### 事件

##### 下拉、checkbox、radio

```javascript
form.on('select(searchByClass)', function(data) {
	search.classId = data.value;
	init({data:JSON.stringify(search)});
});

form.on('radio(gride)', function(obj){
    selData =  obj.data;
});

form.on('checkbox(gride)', function(data){
    selData =  data.value; // boolean
});
```
##### 提交

```javascript
form.on('submit(save)', function(data) {
    if (data.field.type == '') {
        data.field.type = 0;
    }
    $.post("${rc.contextPath}/iot/broadcastResource/save", data.field, function success(data) {
        if (data.success) {
            closeForm();
            initTable();
        } else {
            layer.alert(data.msg);
        }
    }, "json");
    return false;
});
```
> 使用ajax方式提交需要在最后return false
>
> 若提交事件中途报错也会直接提交

##### select选中项的text

```javascript
// 方法1：元素选择器
$('#jld option[value="' + $('#jld').val() + '"]').html()

// 方法2：在下拉选择事件中的回调方法参数中寻找
```



# Table

```html
<table class="layui-table" lay-data="{id:'gride1',cellMinWidth: 80, page: true, limit:10}" lay-filter="gride1">
    <thead>
        <tr>
            <th lay-data="{type:'checkbox'}"></th>
            <th lay-data="{field:'title', width:250}">标题</th>
            <th lay-data="{templet: '#operaTpl', width:120}">操作</th>
            <th lay-data="{templet: '#contentTpl', width:200}">内容</th>
            <th lay-data="{templet: '#phasesTpl', width:170}">适用学段</th>
            <th lay-data="{field:'sort'}">排序</th>
        </tr>
    </thead>
</table>
```
### 模板

```html
<th lay-data="{templet: '#operaTpl', width:120}">操作</th>
```



```html
<script type="text/html" id="operaTpl">
	&#123;&#123;&#35;  if(d.type === 1){ &#125;&#125;
		<a class="layui-btn layui-btn-xs" onclick="send('{{d.resourceUrl}}');" lay-event="edit">播放</a>
		<a class="layui-btn layui-btn-xs" onclick="stop();" lay-event="edit">暂停</a>
	&#123;&#123;&#35;  }&#125;&#125;
</script>
```
### 加载数据

```javascript
var data = tableIns.config.data

function initTable(){
	tableIns = layui.table.reload('gride', {
		url:'${rc.contextPath}/teacher/leave/list',
		where: {data:JSON.stringify(searchObj)},
		done: function(res, curr, count){
			pageCurr = curr;
		}
	});
	layui.table.render(dataTable.config);
}
```



### 获取选中的条目

```javascript
table.checkStatus('gride');
```

### 列控制

	layui table 隐藏列
	done: function(res, curr, count){
		$("[data-field='id']").css('display','none');
		// $("[data-field='id']").css('pointer-events','none');
	}
	强制显示 并不可编辑
	done: function(res, curr, count){
		if(search.postId == 0){
			$("td[data-field='weight'] div").html('-');
			$("td[data-field='weight']").css('pointer-events', 'none');
		}
	}
> 权限控制可使用列控制

### 刷新当前页



```javascript
$(".layui-laypage-btn").click();
```

# laydate

```html
<input type="text" id="overTime" name="overTime" lay-verify="required"  class="layui-input input-text" placeholder="预计归还日期" autocomplete="off">
```



```javascript
laydate.render({
	elem: '#overTime',
	type: 'datetime',
	format: 'yyyy-MM-dd HH:mm'
});
```

```javascript
// 动态添加laydate mark
// 我的日程
var schedule = laydate.render({
	elem: '#rc',
	showBottom: false,
	position: 'static',
	done: function(value, date) {
		if ($('#scheduleDiv td[lay-ymd="' + date.year + '-' + date.month + '-' + date.date + '"] span').length > 0) {
			layer.open({
				type: 1,
				title: '日程',
				area: ['540px', '420px'],
				content: $('#rcList'),
				btn: ['知道了'],
				btnAlign: 'c'
			});
			initScheduleList(date);
		}
	},
	ready: function(date) {
		initDateMark(date);
	},
	change: function(value, date, endDate) {
		if (lastMonth.year != date.year || lastMonth.month != date.month) {
			lastMonth.year = date.year;
			lastMonth.month = date.month;

			initDateMark(date);
		}
	}
});

//获取相邻月的含有日程的日期（通过修改laydate的config对象和界面元素实现）
function initDateMark(date) {
	$.ajax({
		url: "${rc.contextPath}/hr/schedule/dayList/" + date.year + '-' + (date.month < 10 ? '0' : '') + date.month + '-' + (date.date < 10 ? '0' : '') + date.date,
		dataType: "json",
		success: function(data) {
			$.each(data.data, function(index, item) {
				var day = item.replace(/-0/g, '-');
				var elem = $('#scheduleDiv td[lay-ymd="' + day + '"]');
				if (elem.find('span').length == 0) {
					schedule.config.mark[day] = '';
					elem.html('<span class="laydate-day-mark">' + elem.html() + '</span>');
				}
			})
		}
	});
}
```



# laytpl

模板渲染

```javascript
laytpl(coursesTmp.innerHTML).render(data, function(html){
	$('#list').html(html);
})
```



# layer

### 正在加载

```javascript
uploadLoading = layer.msg('正在上传附件...', {
        time: 0,
        icon: 16,
        shade: 0.01 // 阴影透明度
    });
```

### 弹窗打开页面

```javascript
layer.open({
    type:2 // 2：打开url
    ,shade: 0.1
    ,content:['${rc.contextPath}/iot/workAndRest']
    ,area: ['600px', '540px']
    ,title: '添加作息时间' 
    ,skin: 'demo-class'
    ,btnAlign: 'c'
    ,btn: ['确定', '取消']
});
```

### 全屏弹窗

```javascript
index = layer.open({
    type: 2 
    ,title:false
    ,closeBtn: 0
    ,area: ['100%', '100%']
    ,content: '${rc.contextPath}/oa/shouwen/shouwenForm?id=' + curObj.relationSwId
    ,anim: 5
    ,isOutAnim: false
}); 
layer.full(index);
```



### 关闭弹窗

```javascript
layer.close(loadingLayer);
layer.closeAll();
```

### 提示

```javascript
layer.alert("请选择记录");
```



```javascript
layer.confirm('确认删除选中项?', {
    icon: 3,
    title: '提示'
}, function(index) {
    ...
    layer.close(index);
});
```



### 调用layer弹窗中的方法

```javascript
var parentWin = layero.find('iframe')[0].contentWindow;
var data = parentWin.getData();
```

### 调用父页面方法

```javascript
parent.xxx
parent.$("#id").val()
parent.table.reload('grideJob', {
   url: '${rc.contextPath}/safe/emergencyJobList'
   ,where: {data:JSON.stringify(parent.search)}
});
```



# element

初始化

```javascript
layui.element.init();
```

> element内容重新渲染后需要调用初始化方法才能正常显示

# upload

```javascript
upload.render({
    elem: '#addFile'
    ,accept: 'file'		//允许上传的文件类型
    ,exts:'doc|docx|ppt|pptx|xls|xlsx|pdf|png|jpeg|jpg|mp3|wav|mp4|swf'
    ,size: 256000 	    //最大允许上传的文件大小
    ,url: '${rc.contextPath}/upload/file2PdfLimited'
    ,data: {
        type: "doc"
    }
    ,before: function(obj){
        uploadLoading = layer.msg('正在上传附件...', {
            time: 0,
            icon: 16,
            shade: 0.01
        });
    }
    ,done: function(res){
        layer.close(uploadLoading);
        if(!res.success){
            return layer.msg(res.data.msg);
        }else{
            $("#title").val(res.data.title);
            $("#filePath").val(res.data.src);
            $("#fileSize").val(res.data.size);
        }
    }
});
```
### 动态参数

```javascript
data: {
    type: function(){
        return $('#type').html()
    }
}
```
# 疑难问题

### 火狐浏览器layer异常

html标签改为

```html
<!DOCTYPE html>
```

### layui事件不触发

查看是否添加lay-filter属性

### layui table 复选框向上偏 不居中

```css
.layui-table-cell .layui-form-checkbox[lay-skin="primary"]{
     top: 50%;
     transform: translateY(-50%);
}
```

