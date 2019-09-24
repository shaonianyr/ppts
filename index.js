const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors')
const ora = require('ora');

const runMetricsExtracter = require('./js/runner');

const {
    DEFAULT_REPEAT_TIMES,
    DEFAULT_VIEWPORT_SIZE,
    DEFAULT_OUTPUT_FORMAT,
    OUTPUT_FORMATS,
    URL_REGEX,
    DEFAULT_CACHE,
} = require('./js/constants');

const output = require('./js/output');

module.exports = async function start(
    {
        url,
        repeat = DEFAULT_REPEAT_TIMES,
        height = DEFAULT_VIEWPORT_SIZE.HEIGHT,
        width = DEFAULT_VIEWPORT_SIZE.WIDTH,
        cache = DEFAULT_CACHE,
        phone = null,
        outputFormat = DEFAULT_OUTPUT_FORMAT.DEFAULT,
        outputFile = false,
        customPath,
        waitUntil,
        headless = true,
        sandbox = false,
    },
    errorHandler,
) {
    // TODO: Make function to check options.
    if (url === undefined || !URL_REGEX.test(url)) {
        errorHandler(Error('Invalid URL'));
    }

    if (!OUTPUT_FORMATS.includes(outputFormat)) {
        errorHandler(Error('Unsupported output format'));
    }

    const spinner = ora('Launching Browser').start();

    const logStep = (step, repeat) => {
        spinner.text = `Extracting metrics ${step}/${repeat}`;
    };

    const logInfo = log => {
        spinner.text = log;
    };

    if (phone === null) {
        const browser = await puppeteer.launch({
            headless,
            args: sandbox ? ['--start-maximized'] : ['--start-maximized', '--no-sandbox'],
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: parseInt(width, 10),
            height: parseInt(height, 10),
        });
        try {
            let client;

            if (customPath) {
                const customPathFunction = require(customPath);
                await customPathFunction(page, logInfo);
            }

            // If we want tu use a custom url, reach it before making metrics.
            logInfo(`Testing ${url}...`);

            await page.goto(url, { timeout: 172800000, waitUntil: 'load' }).catch(errorHandler);

            if (!client) {
                client = await page.target().createCDPSession();
                await client.send('Performance.enable');
            }

            const aggregatedData = await runMetricsExtracter(url, phone, width, height, browser, page, client, repeat, waitUntil, logStep, cache);

            spinner.stop();

            await browser.close();

            return output(aggregatedData, outputFormat, outputFile);
        } catch (error) {
            await browser.close();
            errorHandler(error);
        }
    } else {
        const browser = await puppeteer.launch({
            headless,
            args: sandbox ? undefined : ['--no-sandbox'],
        });
        const page = await browser.newPage();
        try {
            await page.emulate(devices[phone]);
        } catch (error) {
            console.log('可能错误： 1. 你输入的机型不存在 2.你输入的机型格式有误 3.暂不支持该机型');
            console.log('支持的机型有：');
            devices.forEach(function(item) {
                console.log(item.name);
            });
            await browser.close();
            errorHandler(error);
        }
        try {
            let client;

            if (customPath) {
                const customPathFunction = require(customPath);
                await customPathFunction(page, logInfo);
            }

            // If we want tu use a custom url, reach it before making metrics.
            logInfo(`Testing ${url}...`);

            await page.goto(url, { timeout: 172800000, waitUntil: 'load' }).catch(errorHandler);

            if (!client) {
                client = await page.target().createCDPSession();
                await client.send('Performance.enable');
            }

            const aggregatedData = await runMetricsExtracter(url, phone, width, height, browser, page, client, repeat, waitUntil, logStep, cache);

            spinner.stop();

            await browser.close();

            return output(aggregatedData, outputFormat, outputFile);
        } catch (error) {
            await browser.close();
            errorHandler(error);
        }
    }
};
