const { extractPerformanceMetrics } = require('./metrics');
const { buildStats } = require('./utils');

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
module.exports = async (page, client, repeat, waitUntil = 'load', logStep) => {
    let i = 0;
    const pageMetrics = {};

    while (i < repeat) {
        logStep(i + 1, repeat);

        await page.reload({
            waitUntil: waitUntil.split(','),
        });

        await extractPerformanceMetrics(pageMetrics, page, client);

        i++;
    }

    return buildStats(pageMetrics);
};
