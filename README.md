# ppts
-   [ppts 中文文档(待补充)](待补充链接)

performance-puppeteer-tests, based on node and puppeteer, try to measures the indicators of the web performance, including the jsHeapUsedSize, jsHeapTotalSize, firstPaint, firstMeaningfulPaint, domContentLoaded and loadEventEnd. 

What's more, ppts can be used to calculate the average and standardDeviation of indicators of the web performance when you repeat a specific number of time. And ppts is also support to choose the specific phone devices to emulate. 

See the Usage for more details.

<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/Usage_Options.png">

## Installation

To install ppts :

```bash
npm install -g ppts
```

## Measures indicators of the web performance
```console
Measures:
    |  min  |  median  |  max  |  average  |  standardDeviation  |
      最小值    中间值    最大值    平均值            方差

Indicators：
    jsHeapUsedSize             占用的堆的大小
    jsHeapTotalSize            堆占用的总内存
    firstPaint                 白屏时间
    firstMeaningfulPaint       首屏时间
    domContentLoaded           可交互时间
    loadEventEnd               加载完成时间
```

## Usage

To run the application, just use :

```bash
ppts <url>
```

Several options are available to enhance metrics easily. Use `-h (--help)` to display them.

```console
➜ ppts -h

    Usage: cli <url> [options]

    Description:
        performance-puppeteer-tests

    Author:
        Shaonian <licetianyr@163.com>
    
    Options:
        -r, --repeat [n]                     指定加载次数 (default: 5)
        -w, --width [width]                  浏览器首屏的宽度 (default: "1920")
        -H, --height [height]                浏览器首屏的高度 (default: "1080")
        -o, --output-format [output-format]  输出报告格式 (default: "table")
        -c, --custom-path [custom-path]      载入配置文件（default: null）
        --phone [device-name]                是否启用手机模式（default: null）
        --cache                              是否启用浏览器缓存 (default: false)
        --output-file [output-file]          输出报告文件（default: txt）
        --wait-until [wait-until]            加载完成的标志（default: load）
        --no-headless                        浏览器无头模式（default: true）
        --no-sandbox                         适配Linux无沙盒模式（default: false）
        -h, --help                           output usage information
```

### Setting repeat times
```shell
ppts -r 100 https://www.baidu.com
```
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/Settings_repeat_times.png">

### Setting no-headless
```shell
ppts https://www.baidu.com --no-headless false
```

### Setting no-sandbox (Run in Linux) 
```shell
ppts https://www.baidu.com --no-sandbox true
```

### Setting complex actions as extend customs (Such as: login.js)
```shell
ppts -c './extend_custom/login.js' https://mubu.com
```
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/mubu.png">
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/view_the_index_after_login.png">

### Setting with cache
```shell
ppts https://www.baidu.com --cache true
```

### Setting with phone mode
```shell
ppts https://www.baidu.com --phone 'iPhone X' --no-headless false
```
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/Setting_phone_mode_with_iPhone_X.png">

<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/Setting_phone_errors.png">

#### Support devices
```console
Blackberry PlayBook
Blackberry PlayBook landscape
BlackBerry Z30
BlackBerry Z30 landscape
Galaxy Note 3
Galaxy Note 3 landscape
Galaxy Note II
Galaxy Note II landscape
Galaxy S III
Galaxy S III landscape
Galaxy S5
Galaxy S5 landscape
iPad
iPad landscape
iPad Mini
iPad Mini landscape
iPad Pro
iPad Pro landscape
iPhone 4
iPhone 4 landscape
iPhone 5
iPhone 5 landscape
iPhone 6
iPhone 6 landscape
iPhone 6 Plus
iPhone 6 Plus landscape
iPhone 7
iPhone 7 landscape
iPhone 7 Plus
iPhone 7 Plus landscape
iPhone 8
iPhone 8 landscape
iPhone 8 Plus
iPhone 8 Plus landscape
iPhone SE
iPhone SE landscape
iPhone X
iPhone X landscape
iPhone XR
iPhone XR landscape
JioPhone 2
JioPhone 2 landscape
Kindle Fire HDX
Kindle Fire HDX landscape
LG Optimus L70
LG Optimus L70 landscape
Microsoft Lumia 550
Microsoft Lumia 950
Microsoft Lumia 950 landscape
Nexus 10
Nexus 10 landscape
Nexus 4
Nexus 4 landscape
Nexus 5
Nexus 5 landscape
Nexus 5X
Nexus 5X landscape
Nexus 6
Nexus 6 landscape
Nexus 6P
Nexus 6P landscape
Nexus 7
Nexus 7 landscape
Nokia Lumia 520
Nokia Lumia 520 landscape
Nokia N9
Nokia N9 landscape
Pixel 2
Pixel 2 landscape
Pixel 2 XL
Pixel 2 XL landscape
```

## Useful Resources

-   [Puppeteer](https://github.com/GoogleChrome/puppeteer)
-   [Puppeteer API](https://pptr.dev/)
-   [metrx](https://github.com/lumapps/metrx)