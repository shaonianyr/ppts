const { populateDataObject, toCamelCase, translateMetrics, getRelevantTime } = require('./utils');

/**
 * Collect and extracts performance metrics.
 *
 * @param  {Object}  pageMetrics The object to populate.
 * @param  {Object}  page        The puppeteer page instance we are working with.
 * @param  {Object}  client      The puppeteer client instance we are working with.
 */
const extractPerformanceMetrics = async (pageMetrics, page, client) => {
    let firstMeaningfulPaint = 0;
    let translatedMetrics;

    while (firstMeaningfulPaint === 0) {
        await page.waitFor(100);
        let performanceMetrics = await client.send('Performance.getMetrics');
        translatedMetrics = translateMetrics(performanceMetrics);
        firstMeaningfulPaint = translatedMetrics.FirstMeaningfulPaint;
    }

    const navigationStart = translatedMetrics.NavigationStart;

    const extratedData = {
        jsHeapUsedSize: translatedMetrics.JSHeapUsedSize,
        jsHeapTotalSize: translatedMetrics.JSHeapTotalSize,
        scriptDuration: translatedMetrics.ScriptDuration * 1000,
        firstMeaningfulPaint: getRelevantTime(firstMeaningfulPaint, navigationStart),
        domContentLoaded: getRelevantTime(translatedMetrics.DomContentLoaded, navigationStart),
        ...(await extractPageTimings(page)),
    };

    populateDataObject(pageMetrics, extratedData);
};

/**
 * Extract metrics which are accessible via the `window` object.
 *
 * @param  {Object} page The puppeteer page instance we are working with.
 * @return {Object} The extracted relevant metrics.
 */
const extractPageTimings = async page => {
    // Get timing performance metrics from the `window` object.
    const performanceTimings = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.timing)));
    const paintTimings = JSON.parse(await page.evaluate(() => JSON.stringify(performance.getEntriesByType('paint'))));

    const navigationStart = performanceTimings.navigationStart;
    const relevantDataKeys = ['domInteractive', 'loadEventEnd', 'responseEnd'];
    const relevantData = {};

    relevantDataKeys.forEach(name => {
        relevantData[name] = performanceTimings[name] - navigationStart;
    });

    paintTimings.forEach(timing => {
        relevantData[toCamelCase(timing.name)] = timing.startTime;
    });

    return {
        firstPaint: relevantData.firstPaint,
        firstContentfulPaint: relevantData.firstContentfulPaint,
        responseEnd: relevantData.responseEnd,
        loadEventEnd: relevantData.loadEventEnd,
    };
};

module.exports = {
    extractPerformanceMetrics,
};
