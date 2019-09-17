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
    const json = {};

    data.forEach(metric => {
        const key = metric.key;
        const metrics = metric.metrics;

        json[key] = metrics;
    });

    return JSON.stringify(json);
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

module.exports = (data, format, outputFile) => {
    let formatedData;
    let fileExtension;

    switch (format) {
        case 'table':
            formatedData = buildTable(data);
            break;

        case 'json':
            formatedData = toJson(data);
            fileExtension = 'json';
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
