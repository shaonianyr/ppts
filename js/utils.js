const { BYTES_BASED_VALUES, RELEVANT_STATS } = require('./constants');
const statsFunction = require('./stats');

/**
 * Convert raw ms values to readable values.
 *
 * @param   {number} ms The number of milliseconds.
 * @returns {string} The readable value.
 */
const addMsSuffix = ms => `${Math.floor(ms)} ms`;

/**
 * Makes the diff between a time and the navigation start to get a usable time in ms.
 *
 * @param  {integer} time            The time we want the metric from.
 * @param  {integer} navigationStart The navigation time.
 * @return {integer} The difference between time variable and navigation time.
 */
const getRelevantTime = (time, navigationStart) => (time - navigationStart) * 1000;

/**
 * Populates a data object. An array of values will be associated to each key.
 *
 * @param {Object} objectToPopulate The object containing all the data as key => Array<value>
 * @param {Object} dataObject       The object contanin the key => value pair.
 */
const populateDataObject = (objectToPopulate, dataObject) => {
    objectToPopulate = objectToPopulate || {};

    for (const key in dataObject) {
        const value = dataObject[key];

        if (objectToPopulate[key]) {
            objectToPopulate[key].push(value);
        } else {
            objectToPopulate[key] = [value];
        }
    }
};

/**
 * Transforms a snake-case string to camelCase.
 *
 * @param {string} value The string to transform.
 */
const toCamelCase = value => {
    return value.replace(/(\-[a-z])/g, function($1) {
        return $1.toUpperCase().replace('-', '');
    });
};

/**
 * Humanize values.
 *
 * @param  {string} key   The metric's name to display
 * @param  {value}  value The metric's value.
 * @return {string} The ready to display value.
 */
const toReadableValue = (key, value) => (BYTES_BASED_VALUES.includes(key) ? bytesToSize(value) : addMsSuffix(value));

/**
 * Transforms the metrics Object into a more readable object.
 *
 * @param  {Object} metrics The metrics Object we get from Chrome Dev Tools.
 * @return {Object} The correctly translated metrics.
 */
const translateMetrics = ({ metrics }) => {
    return metrics.reduce((obj, item) => {
        return {
            ...obj,
            [item.name]: item.value,
        };
    }, {});
};

/**
 * Returns an array containing statistics made with extracted metrics.
 * Returns the min value, the max value, the average, the median and the standard deviation for each collected metric.
 *
 * @param  {Array}  data The data we'll build the stats on.
 * @return {Array}  The aggregated data.
 */
const buildStats = data => {
    const aggregatedData = [];

    // Then, make statistics over those metrics.
    for (const key in data) {
        const datas = data[key];
        const metrics = {};

        RELEVANT_STATS.map(stat => {
            const functionName = `get${stat.charAt(0).toUpperCase()}${stat.slice(1)}`;

            if (statsFunction[functionName] instanceof Function) {
                metrics[stat] = statsFunction[functionName](datas);
            }
        });

        aggregatedData.push({
            key,
            metrics,
        });
    }

    return aggregatedData;
};

/**
 * Convert bytes into readable value.
 * See : https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript/18650828
 *
 * @param   {number} bytes The number of bytes to convert.
 * @returns {string} The redable value.
 */
const bytesToSize = bytes => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${parseFloat(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

module.exports = {
    bytesToSize,
    buildStats,
    getRelevantTime,
    populateDataObject,
    toCamelCase,
    toReadableValue,
    translateMetrics,
};
