# ppts

performance-puppeteer-tests

基于 node 以及 puppeteer 开发的一款网页性能分析工具，对网页的加载收集关键性的指标，包括白屏时间，首屏时间，可交互时间等等，并可以指定次数去加载，计算平均值，方差等等。这里的指定次数为非并发，而是单次加载完成以后重新去加载，支持清除浏览器缓存的重新加载，也支持指定手机型号模拟手机web端的加载。更多详情见用法。

## 最新版本: v1.4.0
    版本新特性:
        v1.4.0: 当输出格式为 json 时，支持通过 webhook 发送测试数据给群机器人
        v1.3.0: 改变打开 url 的方式
        v1.2.0: 支持手机模式和有无缓存等模式
        v1.1.1: 支持对网页性能指标的测量

## 安装

ppts npm 包安装 :

```bash
npm install -g ppts --registry=https://registry.npm.taobao.org
```

或者:

```bash
git clone https://github.com/ShaoNianyr/ppts.git
cd ppts
cnpm link
```


## 对网页加载的性能指标的检测
```console
计算结果:
    |  min  |  median  |  max  |  average  |  standardDeviation  |
      最小值    中间值    最大值    平均值            方差

性能指标：
    jsHeapUsedSize             占用的堆的大小
    jsHeapTotalSize            堆占用的总内存
    firstPaint                 白屏时间
    firstMeaningfulPaint       首屏时间
    domContentLoaded           可交互时间
    loadEventEnd               加载完成时间
```

## 用法

使用如下指令对 url 进行性能测试 :

```bash
ppts <url>
```

更多用法使用 `-h (--help)` 可以获取。

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
        --webhook [webhook-url]              是否启用webhook通知（default: null）
        --output-file [output-file]          输出报告文件（default: txt）
        --wait-until [wait-until]            加载完成的标志（default: load）
        --no-headless                        浏览器无头模式（default: true）
        --no-sandbox                         适配Linux无沙盒模式（default: false）
        -h, --help                           output usage information
```

### 指定运行次数 (不指定默认为 5 次)
```shell
ppts -r 100 https://www.baidu.com
```
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/Settings_repeat_times.png">

### 关闭无头模式 （此模式下会弹出浏览器显示加载详情，不指定默认开启无头模式）
```shell
ppts https://www.baidu.com --no-headless false
```

### 开启无沙盒模式 (适配 Linux 系统性 Chrome 的运行，不指定默认关闭无沙盒模式) 
```shell
ppts https://www.baidu.com --no-sandbox true
```

### 支持挂载复杂的动作脚本 (比如提交表单，鼠标点击等等，提供demo login.js 的登录脚本，测试幕布网登录成功后的页面加载速度，不指定默认无挂载。)
```shell
ppts -c './extend_custom/login.js' https://mubu.com
```
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/mubu.png">
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/view_the_index_after_login.png">

### 开启浏览器缓存（不指定默认清除浏览器缓存）
```shell
ppts https://www.baidu.com --cache true
```
### 设置 webhook（不指定默认不开启 webhook，此处以企业微信群机器人为例）
```shell
ppts https://www.baidu.com --output-format json --webhook your-webhook-url
```
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/webhook.png">

### 开启手机模式并指定型号 (不指定默认为 PC 端运行）
```shell
ppts https://www.baidu.com --phone 'iPhone X' --no-headless false
```
<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/Setting_phone_mode_with_iPhone_X.png">

<img src="https://github.com/ShaoNianyr/ppts/blob/master/picture/Setting_phone_errors.png">

#### 开启手机模式下支持模拟的手机型号
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

## 贡献

-   [Puppeteer](https://github.com/GoogleChrome/puppeteer)
-   [Puppeteer API](https://pptr.dev/)
-   [metrx](https://github.com/lumapps/metrx)