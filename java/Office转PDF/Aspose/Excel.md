> 测试发现 Aspose 转换大 Excel 文件时，CPU、内存暴涨，5 M 文件内存占用超过 4GB，导致应用崩溃

```java
public ConvertStatus convert2Pdf(InputStream inputStream, OutputStream outputStream) {
    if (AsposeLicenseUtil.setCellsLicense()) {
        long start = System.currentTimeMillis();
        PdfSaveOptions pdfSaveOptions = new PdfSaveOptions();
        pdfSaveOptions.setOnePagePerSheet(true);

        Workbook workbook = new Workbook(inputStream);
        Worksheet ws = workbook.getWorksheets().get(0);
        ws.getHorizontalPageBreaks().clear();
        ws.getVerticalPageBreaks().clear();
        workbook.save(outputStream, pdfSaveOptions);

        long end = System.currentTimeMillis();
        logger.debug("convert excel2pdf completed, elapsed " + (end - start) / 1000.0 + " seconds!");
        return ConvertStatus.SUCCESS;
    } else {
        return ConvertStatus.LICENSE_ERROR;
    } catch (Exception e) {
        logger.error("convert excel2pdf error!", e);
        return ConvertStatus.CONVERT_EXCEL2PDF_ERROR;
    }
}
```
