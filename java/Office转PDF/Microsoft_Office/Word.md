# Word

```java
public void convert2Pdf(String source, String target) throws Exception {

    long start = System.currentTimeMillis();
    ActiveXComponent app = null;
    try {
        // 打开Word（不可见）
        app = new ActiveXComponent("Word.Application");
        app.setProperty("Visible", false);
        Dispatch docs = app.getProperty("Documents").toDispatch();

        // 打开文件
        Dispatch doc = Dispatch.call(docs, "Open", source, false, false).toDispatch();
        try {
            Dispatch.call(doc, "UnProtect");
        }catch(Exception e) {
            logger.log(ImportLogLevel.IMPORT_INFO, "unprotected or unprotected failed!");
        }

        // 接受所有修订
        try {
            Dispatch range = Dispatch.call(doc, "Range").toDispatch();
            Dispatch revisions = Dispatch.call(range, "Revisions").toDispatch();
            Dispatch.call(revisions, "AcceptAll");
            Dispatch.call(doc, "AcceptAllRevisions");
        }catch(Exception e) {
            logger.log(ImportLogLevel.IMPORT_INFO, "accepted all revision or accepted failed");
        }

        File tofile = new File(target);
        if (tofile.exists()) {
            tofile.delete();
        }

        // 参数17：保存为pdf
        Dispatch.call(doc, "SaveAs", target, 17);
        // 关闭文档（不保存）
        Dispatch.call(doc, "Close", false);

        long end = System.currentTimeMillis();
        logger.log(ImportLogLevel.IMPORT_INFO, String.format("[%s] [%s] conversion completed in %.2fs: %s", StringUtil.getExt(source), StringUtil.getSizeStr(new File(source).length()), (end - start) / 1000f, source));
    } catch (Exception e) {
        throw e;
    } finally {
        // 退出Word
        if (app != null) {
            //退出，不保存待定的更改
            app.invoke("Quit", 0);
        }
    }
}
```

