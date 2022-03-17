'use strict'
const { sortByDate, loopLogsSync, addLogEntryIndex } = require('./helper');

module.exports = (logSources, printer) => {
  const lastLogs = logSources.map(addLogEntryIndex).sort(sortByDate);
  loopLogsSync(lastLogs, printer, logSources)
  printer.done();
};