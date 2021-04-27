# Word

```java
public ConvertStatus convert2Pdf(InputStream inputStream, OutputStream outputStream) {
    try {
        long start = System.currentTimeMillis();

        Document doc = new Document(inputStream);

        // insertWatermarkText(doc, "水印水印"); // 添加水印
        doc.acceptAllRevisions(); // 接受所有修订（不显示痕迹）

        PdfSaveOptions pdfSaveOptions = new PdfSaveOptions();
        pdfSaveOptions.setSaveFormat(SaveFormat.PDF);
        pdfSaveOptions.getOutlineOptions().setHeadingsOutlineLevels(3); // 设置3级doc书签需要保存到pdf的heading中
        pdfSaveOptions.getOutlineOptions().setExpandedOutlineLevels(1); // 设置pdf中默认展开1级

        doc.save(outputStream, pdfSaveOptions);
        long end = System.currentTimeMillis();
        logger.debug("convert doc2pdf completed, elapsed " + (end - start) / 1000.0 + " seconds!");
        return ConvertStatus.SUCCESS;
    } catch (Exception e) {
        logger.error("convert doc2pdf error!", e);
        return ConvertStatus.CONVERT_DOC2PDF_ERROR;
    }
}
```

