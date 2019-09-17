const BYTES_BASED_VALUES = ['jsHeapUsedSize', 'jsHeapTotalSize'];

const DEFAULT_REPEAT_TIMES = 5;

const DEFAULT_VIEWPORT_SIZE = {
    HEIGHT: '1080',
    WIDTH: '1920',
};

const DEFAULT_OUTPUT_FORMAT = {
    CLI: 'table',
    DEFAULT: 'raw',
};

const OUTPUT_FORMATS = ['raw', 'json', 'table', 'csv'];

const RELEVANT_STATS = ['average', 'median', 'min', 'max', 'standardDeviation'];

const URL_REGEX = /([a-z]{1,2}tps?):\/\/((?:(?!(?:\/|#|\?|&)).)+)(?:(\/(?:(?:(?:(?!(?:#|\?|&)).)+\/))?))?(?:((?:(?!(?:\.|$|\?|#)).)+))?(?:(\.(?:(?!(?:\?|$|#)).)+))?(?:(\?(?:(?!(?:$|#)).)+))?(?:(#.+))?/g;

module.exports = {
    BYTES_BASED_VALUES,
    DEFAULT_VIEWPORT_SIZE,
    DEFAULT_REPEAT_TIMES,
    DEFAULT_OUTPUT_FORMAT,
    OUTPUT_FORMATS,
    RELEVANT_STATS,
    URL_REGEX,
};
