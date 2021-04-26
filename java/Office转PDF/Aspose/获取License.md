```java
package com.chunshu.common.aspose;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.log4j.Logger;

import com.chunshu.common.aspose.convert.DocConvertServiceImpl;
import com.chunshu.common.aspose.convert.IFileConvertService;

/**
 * Aspose注册工具
 */
public class AsposeLicenseUtil {

	private static Logger logger = Logger.getLogger(AsposeLicenseUtil.class);

	public static boolean setWordsLicense() {
		InputStream inputStream = null;
		try {
			inputStream = AsposeLicenseUtil.class.getClassLoader().getResourceAsStream("license.xml");
			if (inputStream != null) {
				com.aspose.words.License aposeLic = new com.aspose.words.License();
				aposeLic.setLicense(inputStream);
				return true;
			}
		} catch (Exception e) {
			logger.error("set words license error!", e);
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	}

	/**
	 * 设置License
	 * 
	 * @return true表示已成功设置License, false表示失败
	 */
	public static boolean setCellsLicense() {
		InputStream inputStream = null;
		try {
			inputStream = AsposeLicenseUtil.class.getClassLoader().getResourceAsStream("license.xml");
			if (inputStream != null) {
				com.aspose.cells.License aposeLic = new com.aspose.cells.License();
				aposeLic.setLicense(inputStream);
				return true;
			}
		} catch (Exception e) {
			logger.error("set words license error!", e);
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	}

	/**
	 * 设置License
	 * 
	 * @return true表示已成功设置License, false表示失败
	 */
	public static boolean setSlidesLicense() {
		InputStream inputStream = null;
		try {
			inputStream = AsposeLicenseUtil.class.getClassLoader().getResourceAsStream("license_ppt.xml");
			if (inputStream != null) {
				com.aspose.slides.License aposeLic = new com.aspose.slides.License();
				aposeLic.setLicense(inputStream);
				return true;
			}
		} catch (Exception e) {
			logger.error("set words license error!", e);
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	}

	/**
	 * 设置Aspose PDF的license
	 * 
	 * @return true表示设置成功，false表示设置失败
	 */
	public static boolean setPdfLicense() {
		InputStream inputStream = null;
		try {
			inputStream = AsposeLicenseUtil.class.getClassLoader().getResourceAsStream("license.xml");
			if (inputStream != null) {
				com.aspose.pdf.License aposeLic = new com.aspose.pdf.License();
				aposeLic.setLicense(inputStream);
				return true;
			}
		} catch (Exception e) {
			logger.error("set words license error!", e);
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return false;
	}
}
```

