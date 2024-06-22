# Wi-Fi

众所周知 WIFI 各种协议速率比较复杂，对于消费者来说必须得缕一缕

# Wi-Fi 技术标准

| <font color="#FF4081">WiFi标准</font> | 版本    | 协议标准 | <font color="#FF4081">频段</font> | PHY技术              | 调制方式           | <font color="#FF4081">空间流数</font> | <font color="#FF4081">信道带宽</font>/MHz | 数据速率  |
| -------- | ------- | -------- | -------------- | -------------------- | ------------------ | -------- | ---------------- | --------- |
| 802.11   | Wi-Fi 1 | 1997     | 2.4 GHz        | DSSS                 | BPSK<br/>QPSK    | 1        | 20               | 2 Mbps    |
| 802.11b  | Wi-Fi 1 | 1999     | 2.4 GHz        | DSSS                 | CCK<br/>QPSK     | 1        | 20               | 11 Mbps   |
| 802.11a  | Wi-Fi 2 | 1999     | 5 GHz          | OFDM                 | BPSK<br/>QPSK<br/>16-QAM | 1        | 20               | 54 Mbps   |
| 802.11g  | Wi-Fi 3 | 2003     | 2.4 GHz        | OFDM                 | BPSK<br/>QPSK<br/>16-QAM | 1        | 20               | 54 Mbps   |
| 802.11n  | Wi-Fi 4 | 2009     | 2.4 GHz<br/>5 GHz | MIMO-OFDM            | BPSK<br/>QPSK<br/>16-QAM | 4        | 20/40            | 600 Mbps  |
| 802.11ac | Wi-Fi 5 | 2013     | 5 GHz          | MIMO-OFDM            | BPSK<br/>QPSK<br/>16-QAM | 8        | 20/40/80/160     | 3.47 Gbps |
| 802.11ax | Wi-Fi 6 | 2019     | 2.4 GHz<br/>5 GHz | OFDMA<br/>MU-MIMO  | BPSK<br/>QPSK<br/>16-QAM | 8        | 20/40/80/160     | 9.6 Gbps  |
| 802.11be | Wi-Fi 7 | 2024     | 2.4 GHz<br/>5 GHz<br/>6 GHz | OFDMA<br>MU-MIMO | 4096-QAM           | 8        | 20/40/80/160/320 | 23 Gbps   |

> [一文带你了解WiFi标准的演进历程，WiFi 7 标准来了！-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/1500024)

# 理论速率计算

而消费者只关注速率，下面列出速率的影响因素

- 现有设备至少都是 WIFI5，所以 WIFI 4 802.11n 的 5GHz 就不再计算之列
- 虽然 5GHz 频段也支持 20/40 MHz 带宽，但是貌似厂商都只支持 80/160（例如某些路由器带的 AIoT 天线就支持所有带宽），就不考虑它了，默认只有 80/160

| WiFi标准 | 版本    | 频段    | 空间流数 | 信道带宽     | 速率      |
| -------- | ------- | ------- | -------- | ------------ | --------- |
| 802.11n  | Wi-Fi 4 | 2.4 GHz | 1（4）   | 20（20/40）  | 72.2 Mbps |
| 802.11ac | Wi-Fi 5 | 5 GHz   | 1（8）   | 80（80/160） | 433 Mbps  |
| 802.11ax | Wi-Fi 6 | 2.4 GHz | 1（8）   | 20（20/40）  | 143 Mbps  |
| 802.11ax | Wi-Fi 6 | 5 GHz   | 1（8）   | 80（80/160） | 601 Mbps  |

当空间流数或者信道带宽翻倍时，速录也翻倍，例如

- WIFI4 最大理论带宽为`72.2 * 4 * 2 = 577.6 Mbps`
- WIFI6 2x2 160MHz 速率为`601 * 2 * 2 = 2404 Mbps`

> [不同的 Wi-Fi 协议和数据速率 (intel.cn)](https://www.intel.cn/content/www/cn/zh/support/articles/000005725/wireless/legacy-intel-wireless-products.html)

> [!TIP]
>
> **影响 WIFI 理论速率的有三个因素：协议版本、空间流数和信道带宽。**

> [!TIP]
>
> `控件流数`对应设备的参数为`TX/RX 流`或者`天线`，描述为`1x1`（1个空间流）、`2x2`（2个空间流）等。可能是因为一收一发，所以称之为`1x1`。
>
> 并不是指路由器外壳上的天线数！！！

理论速率需要发送端和接收端都达到相关的参数才能支持。可以网络协商的速度中基本确定相关参数，电脑**近距离**连接 WIFI，打开`控制面板\网络和 Internet\网络连接`，双击无线网卡打开`WLAN 状态`，可以看到协商的速度，例如

- 144.4 Mbps：802.11n 2x2 20Mhz
- 866 Mbps: 802.11ac 2x2 80Mhz

# 接收端

例如笔记本、手机等连接 WIFI 的设备，主流手机和无线网卡均为 2x2 天线。

> TX/RX 流 2x2
>
> 频带 2.4, 5 GHz
>
> 最高速度 867 Mbps
>
> Wi-Fi CERTIFIED* Wi-Fi 5 (802.11ac)
>
> 蓝牙版本 4.2
>
> [英特尔® 双频带 Wireless-AC 8260 (intel.cn)](https://www.intel.cn/content/www/cn/zh/products/sku/86068/intel-dual-band-wirelessac-8260/specifications.html)

| 频段   | 参数                       | 最高速率   |
| ------ | -------------------------- | ---------- |
| 2.4GHz | 802.11ax 2.4GHz  2x2 40Mhz | 288.8 Mbps |
| 5GHz   | 802.11ax 5GHz  2x2 80Mhz   | 866 Mbps   |

> ##### 英特尔® Wireless-AC 9260
>
> TX/RX 流 2x2
>
> 频带 2.4, 5 GHz (160 MHz)
>
> 最高速度 1.73 Gbps
>
> Wi-Fi CERTIFIED* Wi-Fi 5 (802.11ac)
>
> 蓝牙版本 5.1
>
> [英特尔® Wireless-AC 9260 (intel.cn)](https://www.intel.cn/content/www/cn/zh/products/sku/99445/intel-wirelessac-9260/specifications.html)

| 频段   | 参数                       | 最高速率   |
| ------ | -------------------------- | ---------- |
| 2.4GHz | 802.11ax 2.4GHz  2x2 40Mhz | 288.8 Mbps |
| 5GHz   | 802.11ax 5GHz  2x2 160Mhz  | 1732 Mbps  |

> ##### 英特尔® Wi-Fi 6E AX210
>
> TX/RX 流 2x2
>
> 频带 2.4, 5, 6 GHz (160MHz)
>
> 最高速度 2.4 Gbps
>
> Wi-Fi CERTIFIED* Wi-Fi 6E (802.11ax)
>
> 蓝牙版本 5.3
>
> [英特尔® Wi-Fi 6E AX210 (intel.cn)](https://www.intel.cn/content/www/cn/zh/products/sku/204836/intel-wifi-6e-ax210-gig/specifications.html)

| 频段   | 参数                       | 最高速率  |
| ------ | -------------------------- | --------- |
| 2.4GHz | 802.11ax 2.4GHz  2x2 40Mhz | 572 Mbps  |
| 5GHz   | 802.11ax 5GHz  2x2 160Mhz  | 2404 Mbps |

# 发送端

现在的路由器型号基本就表示了它的基本技术参数，它指 2.4G 与 5G WIFI 最大速率之和。

| 型号 | 2.4G 参数                  | 最大速率 | 5G 参数                   | 速率      |
| ---- | -------------------------- | -------- | ------------------------- | --------- |
| 1800 | 802.11ax 2.4GHz  2x2 40Mhz | 572 Mbps | 802.11ax 5GHz  2x2 80Mhz  | 1202 Mbps |
| 3000 | 802.11ax 2.4GHz  2x2 40Mhz | 572 Mbps | 802.11ax 5GHz  2x2 160Mhz | 2404 Mbps |
| 3600 | 802.11ax 2.4GHz  2x2 40Mhz | 572 Mbps | 802.11ax 5GHz  2x2 160Mhz | 2404 Mbps |
| 5400 | 802.11ax 2.4GHz  2x2 40Mhz | 572 Mbps | 802.11ax 5GHz  4x4 160Mhz | 4808 Mbps |

> 3600 比 3000 多了1根 AIoT 天线，支持 2.4G/5Ghz 双频（802.11ax 1x1 最大 160MHz 601 Mpbs），所以叫3600。
