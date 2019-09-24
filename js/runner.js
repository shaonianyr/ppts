const { extractPerformanceMetrics } = require('./metrics');
const { buildStats } = require('./utils');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors')

/**
 * Extracts the page metrics as many time as the repeat parameter and build statistics aroud it.
 *
 * @param  {Object}   page      The puppeteer page object we are working on.
 * @param  {Object}   client    The puppeteer client we are working with.
 * @param  {number}   repeat    The number of times we want to extract data.
 * @param  {string}   waitUntil The `waitUntil` value to set to the reload.
 *                              See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagereloadoptions
 *                              for more informations.
 * @param  {Function} logStep   Functions to display the correct step in the console.
 * @return {Object}   Statistics about collected metrics.
 */
module.exports = async (url, phone, width, height, browser, page, client, repeat, waitUntil = 'load', logStep, cache) => {
    let i = 0;
    const pageMetrics = {};

    while (i < repeat) {
        logStep(i + 1, repeat);

        if (phone === null) {
            const page = await browser.newPage();
            await page.setCacheEnabled(cache);
            await page.setViewport({
                width: parseInt(width, 10),
                height: parseInt(height, 10),
            });
            const client = await page.target().createCDPSession();
            await client.send('Performance.enable');
            await page.goto(url, { timeout: 172800000, waitUntil: 'load' });
            await extractPerformanceMetrics(pageMetrics, page, client);
            await page.close();
            i++;
        } else {
            const page = await browser.newPage();
            await page.setCacheEnabled(cache);
            await page.emulate(devices[phone]);
            const client = await page.target().createCDPSession();
            await client.send('Performance.enable');
            await page.goto(url, { timeout: 172800000, waitUntil: 'load' });
            await extractPerformanceMetrics(pageMetrics, page, client);
            await page.close();
            i++;
        }  
    }

    return buildStats(pageMetrics);
};
