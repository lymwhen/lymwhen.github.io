// DOM事件路径是否包含标签
function pathContains(arr, tagName) {
    tagName = tagName.toUpperCase();
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].nodeName == tagName) {
            return true;
        }
    }
    return false;
}