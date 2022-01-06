# zTree

> [API 文档 [zTree --  jQuery 树插件]](http://www.treejs.cn/v3/api.php)

# 初始化

```javascript
var setting = {
    check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: { "Y": "ps", "N": "ps" }
    },
    async: {
        enable: true,
        url: "${rc.contextPath}/base/teacherSet/userCodeTree",
        autoParam: ["code", "name=name", "level=level"],
    },
    data: {
        key: {
            name: "name"
        },
        simpleData: {
            enable: true,
            idKey: "code",
            pIdKey: "pcode"
        }
    }, callback: {
        onClick: function (event, treeId, treeNode, clickFlag) {
            zTreeObj.checkNode(treeNode, !treeNode.checked, true);
            addCheckedTopLevelNodes();
        },
        onCheck: function (event, treeId, treeNode) {
            addCheckedTopLevelNodes();
        },
        onAsyncSuccess: function (event, treeId, treeNode, msg) {
            $.each($('.addUser a'), function (index, item) {
                var node = zTreeObj.getNodeByParam("code", $(item).attr('code'));
                zTreeObj.checkNode(node, true, true);
            })
        }
    }
};
zTreeObj = $.fn.zTree.init($("#tree"), setting, [{ pcode: '', code: "${UserUtils.getUser().org.code!''}", name: "${UserUtils.getUser().org.name!''}", type: 3, isParent: true, open: true }]);
var node = zTreeObj.getNodeByParam("level", 0);
zTreeObj.selectNode(node);
zTreeObj.expandNode(node, true, false, false);
```

# 方法

```javascript
// 获取根节点
zTreeObj.getNodeByParam("level", 0);
// 选中节点
zTreeObj.selectNode(node);
// 展开节点，节点、是否展开、是否展开子孙节点、是否设置焦点（保证进入可视区域）
zTreeObj.expandNode(node, true, false, false);
```