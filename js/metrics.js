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
        ...(await extractPageTimings1(page)),
        firstMeaningfulPaint: getRelevantTime(firstMeaningfulPaint, navigationStart),
        ...(await extractPageTimings2(page)),
    };

    populateDataObject(pageMetrics, extratedData);
};

/**
 * Extract metrics which are accessible via the `window` object.
 *
 * @param  {Object} page The puppeteer page instance we are working with.
 * @return {Object} The extracted relevant metrics.
 */
const extractPageTimings1 = async page => {
    // Get timing performance metrics from the `window` object.
    const performanceTimings = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.timing)));

    const navigationStart = performanceTimings.navigationStart;
    const relevantData = {};

    relevantData['firstPaint'] = performanceTimings.responseStart - navigationStart;

    return {
        firstPaint: relevantData.firstPaint,
    };
};

const extractPageTimings2 = async page => {
    // Get timing performance metrics from the `window` object.
    const performanceTimings = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.timing)));
 
    const navigationStart = performanceTimings.navigationStart;
    const relevantDataKeys = ['domContentLoadedEventEnd', 'loadEventEnd'];
    const relevantData = {};

    relevantDataKeys.forEach(name => {
        relevantData[name] = performanceTimings[name] - navigationStart;
    });

    return {
        domContentLoaded: relevantData.domContentLoadedEventEnd,
        loadEventEnd: relevantData.loadEventEnd,
    };
};

module.exports = {
    extractPerformanceMetrics,
};
