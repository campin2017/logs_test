'use strict'
const { sortByDate, loopLogsAsync, addLogEntryIndex } = require('./helper');

module.exports = async (logSources, printer) => {
  const indexedLogs = await Promise.all(logSources.map(addLogEntryIndex));
  const lastLogs = indexedLogs.sort(sortByDate);
  await loopLogsAsync(lastLogs, printer,logSources,false)
  printer.done(false);
}