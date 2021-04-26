```java
public ConvertStatus convert2Pdf(InputStream inputStream, OutputStream outputStream) {
    try {
        if (AsposeLicenseUtil.setSlidesLicense()) {
            long start = System.currentTimeMillis();
            Presentation presentation = new Presentation(inputStream);

            ISaveOptions pdfSaveOptions = new PdfOptions();
            presentation.save(outputStream, SaveFormat.Pdf);
            long end = System.currentTimeMillis();
            logger.debug("convert ppt2pdf completed, elapsed " + (end - start) / 1000.0 + " seconds!");
            return ConvertStatus.SUCCESS;
        } else {
            return ConvertStatus.LICENSE_ERROR;
        } catch (Exception e) {
            logger.error("convert ppt2pdf error!", e);
            return ConvertStatus.CONVERT_PPT2PDF_ERROR;
        }
    }
}
```

