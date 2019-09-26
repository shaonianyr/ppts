#!/usr/bin/env node

'use strict';

const program = require('commander');

const start = require('./');

const { DEFAULT_REPEAT_TIMES, DEFAULT_CACHE, DEFAULT_OUTPUT_FORMAT, DEFAULT_VIEWPORT_SIZE} = require('./js/constants');

program
    .description('Description:\n  performance-puppeteer-tests\n\nAuthor:\n  Shaonian <licetianyr@163.com>')
    .usage('<url> [options] ')
    .arguments('<url>')
    .action(url => {
        program.url = url;
    })
    .option('-r, --repeat [n]', '指定加载次数', DEFAULT_REPEAT_TIMES)
    .option('-w, --width [width]', '浏览器首屏的宽度', DEFAULT_VIEWPORT_SIZE.WIDTH)
    .option('-H, --height [height]', '浏览器首屏的高度', DEFAULT_VIEWPORT_SIZE.HEIGHT)
    .option('-o, --output-format [output-format]', '输出报告格式', DEFAULT_OUTPUT_FORMAT.CLI)
    .option('-c, --custom-path [custom-path]', '载入配置文件（default: null）')
    .option('--phone [device-name]', '是否启用手机模式（default: null）')
    .option('--cache', '是否启用浏览器缓存', DEFAULT_CACHE)
    .option('--webhook [webhook-url]', '是否启用webhook通知（default: null）')
    .option('--output-file [output-file]', '输出报告文件（default: txt）')
    .option('--wait-until [wait-until]', '加载完成的标志（default: load）')
    .option('--no-headless', '浏览器无头模式（default: true）')
    .option('--no-sandbox', '适配Linux无沙盒模式（default: false）')
    .parse(process.argv);

const errorHandler = error => {
    console.error(error);
    process.exit(1);
};

if (!program.url) {
    program.help();
    process.exit(1);
} else {
    try {
        start(program, errorHandler).then(output => {
            console.log(output);
        });
    } catch (error) {
        errorHandler(error);
    }
}
