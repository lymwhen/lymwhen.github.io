# Excel

```javascript
public void convert2Pdf(String source, String target) throws Exception {
    long start = System.currentTimeMillis();
    int pageCount = 0;
    File sourceFile = new File(source);
    ActiveXComponent app = null;
    try {
        // 打开PPT
        app = new ActiveXComponent("Excel.Application");
        app.setProperty("Visible", false);
        Dispatch docs = app.getProperty("Workbooks").toDispatch();

        // 打开文件
        Dispatch doc = Dispatch.call(docs, "Open", source, false, false).toDispatch();

        Dispatch sheets = Dispatch.call(doc, "Sheets").toDispatch();
        for(int i = 1; i <= Dispatch.get(sheets, "Count").getInt(); i++) {
            Dispatch sheet = Dispatch.call(sheets, "Item", new Variant(i)).toDispatch();
            Dispatch pageSetup = Dispatch.call(sheet, "PageSetup").toDispatch();
            Dispatch pages = Dispatch.call(pageSetup, "Pages").toDispatch();
            pageCount += Dispatch.get(pages, "Count").getInt();
        }
        if(pageCount > 5000) {
            throw new Exception(String.format("too many pages: %d, skipped", pageCount));
        	// 关闭文档（不保存）
        	Dispatch.call(doc, "Close", false);
        }
        logger.log(ImportLogLevel.IMPORT_INFO, String.format("[%s] [%s] [%d pages] pages calculation completed in %.2fs: %s", StringUtil.getExt(source), StringUtil.getSizeStr(sourceFile.length()), pageCount, (System.currentTimeMillis() - start) / 1000f, source));

        File tofile = new File(target);
        if (tofile.exists()) {
            tofile.delete();
        }

        // 参数32：保存为pdf
        Dispatch.call(doc, "ExportAsFixedFormat", 0, target);
        // 关闭文档（不保存）
        Dispatch.call(doc, "Close", false);

        long end = System.currentTimeMillis();
        logger.log(ImportLogLevel.IMPORT_INFO, String.format("[%s] [%s] [%d pages] conversion completed in %.2fs: %s", StringUtil.getExt(source), StringUtil.getSizeStr(new File(source).length()), pageCount, (end - start) / 1000f, source));
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

> 测试 1000 页 Excel 转换时间为 3 分钟左右

> 由于部分 Excel 设置了统一的板式，使打印页数到达 5000 页以上，跳过该文件

# 其他代码

```java
// 获取 Sheets
Dispatch sheets = Dispatch.call(doc, "Sheets").toDispatch();
// 获取 sheet 个数
System.out.println(Dispatch.get(sheets, "Count").getInt());
// 获取 sheet（索引或名称，索引从 1 开始）
Dispatch sheet = Dispatch.call(sheets, "Item", new Variant(2)).toDispatch();
// 获取使用的范围（不准确）
Dispatch range = Dispatch.get(sheet, "UsedRange").toDispatch();
// 获取 Range 的行数
Dispatch rows = Dispatch.get(range, "Rows").toDispatch();
System.out.println(Dispatch.get(rows, "Count").getInt());

// 获取 PageSetup
Dispatch pageSetup = Dispatch.call(sheet, "PageSetup").toDispatch();
// 获取打印页
Dispatch pages = Dispatch.call(pageSetup, "Pages").toDispatch();
// 获取打印页数（准确）
System.out.println(Dispatch.get(pages, "Count"));
```

