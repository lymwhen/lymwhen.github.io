# PowerPoint

```java
public void convert2Pdf(String source, String target) throws Exception {

    long start = System.currentTimeMillis();
    ActiveXComponent app = null;
    try {
        // 打开PPT
        app = new ActiveXComponent("PowerPoint.Application");
        //            app.setProperty("Visible", 0);
        Dispatch docs = app.getProperty("Presentations").toDispatch();

        // 打开文件
        Dispatch doc = Dispatch.call(docs, "Open", source, false, false, false).toDispatch();

        File tofile = new File(target);
        if (tofile.exists()) {
            tofile.delete();
        }

        // 参数32：保存为pdf
        Dispatch.call(doc, "SaveAs", target, new Variant(32));
        // 关闭文档（不保存）
        Dispatch.call(doc, "Close");

        long end = System.currentTimeMillis();
        logger.log(ImportLogLevel.IMPORT_INFO, String.format("[%s] [%s] conversion completed in %.2fs: %s", StringUtil.getExt(source), StringUtil.getSizeStr(new File(source).length()), (end - start) / 1000f, source));
    } catch (Exception e) {
        throw e;
    } finally {
        // 退出Word
        if (app != null) {
            //退出，不保存待定的更改
            app.invoke("Quit");
        }
    }
}
```

