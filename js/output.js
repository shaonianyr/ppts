const fs = require('fs');
const Table = require('cli-table');
const chalk = require('chalk');

const { toReadableValue } = require('./utils');
const { RELEVANT_STATS } = require('./constants');

/**
 * Build a table ready for the console output.
 *
 * @param  {Array}  data The object containing the data we want to display.
 * @return {string} The ready to display table.
 */
const buildTable = data => {
    console.log(chalk.green("========================================================================================"));
    console.log(chalk.red.bold("                      performance-puppeteer-tests 网页性能测试                        "));
    console.log(chalk.green("========================================================================================"));
    const head = [''].concat(RELEVANT_STATS.map(stat => chalk.blue(stat)));

    for (const key in data) {
        if (!data.hasOwnProperty(key)) {
            return;
        }

        const table = new Table({
            head,
        });

        data.forEach(entry => {
            table.push([
                chalk.bold(entry.key),
                ...RELEVANT_STATS.map(stat => toReadableValue(entry.key, entry.metrics[stat])),
            ]);
        });   

        return table.toString();     
    }
};

/**
 * Outputs the aggregated data to a correct JSON object.
 *
 * @param  {Array} data The object containing the data we want to convert to JSON.
 * @return {JSON}  The valid JSON Object.
 */
const toJson = data => {
    const webhook = {};

    data.forEach(metric => {
        const key = metric.key;
        const metrics = metric.metrics;
            
        webhook[key] = [
            {'min':toReadableValue(key, metrics['min'])},
            {'median':toReadableValue(key, metrics['median'])},
            {'max':toReadableValue(key, metrics['max'])},
            {'average':toReadableValue(key, metrics['average'])},
            {'standardDeviation':toReadableValue(key, metrics['standardDeviation'])},
        ];
    });

    return webhook;
};

/**
 * Outputs the aggregated data to a CSV string.
 *
 * @param  {Array}  data The object containing the data we want to convert to CSV.
 * @return {string} The CSV ready string.
 */
const toCsv = data => {
    let csv = '';
    const SEPARATOR = ',';
    const NEW_LINE = '\n';

    let header = Object.keys(data[0].metrics);

    csv += `${SEPARATOR}${header.join(SEPARATOR)}${NEW_LINE}`;

    data.forEach(metric => {
        csv += `${metric.key}${SEPARATOR}${Object.values(metric.metrics).join(SEPARATOR)}${NEW_LINE}`;
    });

    return csv;
};

/**
 * Writes all the extracted data in a file asynchronously.
 *
 * @param {Array|string} data            The previously formated data.
 * @param {string}       [fileExtension] The file extension the file should get.
 * @param {string}       [fileName]      The desired file name.
 */
const exportDataInFile = (data, fileExtension = 'txt', fileName) => {
    fileName = fileName === true ? `${+new Date()}.${fileExtension}` : fileName;

    // Make sure we get the good file extension.
    if (fileName.slice(-fileExtension.length) !== fileExtension) {
        fileName += `.${fileExtension}`;
    }

    fs.writeFile(fileName, data, error => {
        if (error) {
            throw error;
        }
    });
};

module.exports = (data, format, outputFile, webhook, url) => {
    let formatedData;
    let fileExtension;

    switch (format) {
        case 'table':
            formatedData = buildTable(data);
            break;

        case 'json':
            formatedData = toJson(data);
            fileExtension = 'json';
            if (webhook) {
                const md = "====================================" + "\n"
                   + " ppts  url: " + url + "\n"
                   + "====================================" + "\n"
                   + "{ jsHeapUsedSize:(使用的JavaScript堆大小)" + "\n"
                   + "    [ { min: '" + formatedData.jsHeapUsedSize[0].min + "' }," + "\n"
                   + "      { median: '" + formatedData.jsHeapUsedSize[1].median + "' }," + "\n"
                   + "      { max: '" + formatedData.jsHeapUsedSize[2].max + "' }," + "\n"
                   + "      { average: '" + formatedData.jsHeapUsedSize[3].average + "' }," + "\n"
                   + "      { standardDeviation: '" + formatedData.jsHeapUsedSize[4].standardDeviation + "' } ]," + "\n"
                   + "  jsHeapTotalSize:(JavaScript堆总大小)" + "\n"
                   + "    [ { min: '" + formatedData.jsHeapTotalSize[0].min + "' }," + "\n"
                   + "      { median: '" + formatedData.jsHeapTotalSize[1].median + "' }," + "\n"
                   + "      { max: '" + formatedData.jsHeapTotalSize[2].max + "' }," + "\n"
                   + "      { average: '" + formatedData.jsHeapTotalSize[3].average + "' }," + "\n"
                   + "      { standardDeviation: '" + formatedData.jsHeapTotalSize[4].standardDeviation + "' } ]," + "\n"
                   + "  firstPaint:(白屏时间)" + "\n"
                   + "    [ { min: '" + formatedData.firstPaint[0].min + "' }," + "\n"
                   + "      { median: '" + formatedData.firstPaint[1].median + "' }," + "\n"
                   + "      { max: '" + formatedData.firstPaint[2].max + "' }," + "\n"
                   + "      { average: '" + formatedData.firstPaint[3].average + "' }," + "\n"
                   + "      { standardDeviation: '" + formatedData.firstPaint[4].standardDeviation + "' } ]," + "\n"
                   + "  firstMeaningfulPaint:(首屏时间)" + "\n"
                   + "    [ { min: '" + formatedData.firstMeaningfulPaint[0].min + "' }," + "\n"
                   + "      { median: '" + formatedData.firstMeaningfulPaint[1].median + "' }," + "\n"
                   + "      { max: '" + formatedData.firstMeaningfulPaint[2].max + "' }," + "\n"
                   + "      { average: '" + formatedData.firstMeaningfulPaint[3].average + "' }," + "\n"
                   + "      { standardDeviation: '" + formatedData.firstMeaningfulPaint[4].standardDeviation + "' } ]," + "\n"
                   + "  domContentLoaded:(用户可操作时间)" + "\n"
                   + "    [ { min: '" + formatedData.domContentLoaded[0].min + "' }," + "\n"
                   + "      { median: '" + formatedData.domContentLoaded[1].median + "' }," + "\n"
                   + "      { max: '" + formatedData.domContentLoaded[2].max + "' }," + "\n"
                   + "      { average: '" + formatedData.domContentLoaded[3].average + "' }," + "\n"
                   + "      { standardDeviation: '" + formatedData.domContentLoaded[4].standardDeviation + "' } ]," + "\n"
                   + "  loadEventEnd:(加载完成时间)" + "\n"
                   + "    [ { min: '" + formatedData.loadEventEnd[0].min + "' }," + "\n"
                   + "      { median: '" + formatedData.loadEventEnd[1].median + "' }," + "\n"
                   + "      { max: '" + formatedData.loadEventEnd[2].max + "' }," + "\n"
                   + "      { average: '" + formatedData.loadEventEnd[3].average + "' }," + "\n"
                   + "      { standardDeviation: '" + formatedData.loadEventEnd[4].standardDeviation + "' } ]}";

                const request = require('request');
                const headers = {
                    'Content-type': 'application/json'
                };

                const dataString = { msgtype: "text", text: {content: md}};
                const options = {
                    url: webhook,
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(dataString)
                };

                function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log('The message has been sent to the webhook-url.\nMessage:');
                        console.log(md);
                    }
                }

                request(options, callback);
            }
            formatedData = JSON.stringify(formatedData);
            break;

        case 'csv':
            formatedData = toCsv(data);
            fileExtension = 'csv';
            break;

        default:
            formatedData = data;
            break;
    }

    if (outputFile) {
        exportDataInFile(formatedData, fileExtension, outputFile);
    }

    return formatedData;
};
