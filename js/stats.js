/**
 * Return the median value for an array of raw values.
 *
 * @param  {Array}  values The array of values.
 * @return {number} The median value.
 */
const getMedian = values => {
    values.sort((a, b) => a - b);
    const pivot = Math.floor(values.length / 2);

    return values.length % 2 ? values[pivot] : (values[pivot - 1] + values[pivot]) / 2;
};

/**
 * Calculate the average value for an array of raw values.
 *
 * @param  {Array}  values The array of values.
 * @return {number} The average value.
 */
const getAverage = values => values.reduce((a, b) => a + b, 0) / values.length;

/**
 * Calculate standard deviation for an array of raw values.
 *
 * @param  {Array}  values The array of values to get the standard deviation from.
 * @return {number} The stantdard deviation.
 */
const getStandardDeviation = values => {
    const avg = getAverage(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));

    return Math.sqrt(getAverage(squareDiffs));
};

/**
 * Get max value.
 *
 * @param  {Array}  values The array of values to get the max value from.
 * @return {number} The max value
 */
const getMax = values => Math.max(...values);

/**
 * Get min value.
 *
 * @param  {Array}  values The array of values to get the max value from.
 * @return {number} The max value
 */
const getMin = values => Math.min(...values);

module.exports = {
    getAverage,
    getMedian,
    getStandardDeviation,
    getMax,
    getMin,
};
