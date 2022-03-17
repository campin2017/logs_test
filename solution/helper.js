const sortByDate = (a, b) => Date.parse(b.date) -  Date.parse(a.date);

const addLogEntryIndex = (source, index) => {
  const logEntry = source.pop();
  return addEntry(logEntry,index)
}

const addLogEntryIndexAsync = async (source, index) => {
    const logEntry = await source.popAsync();
    return addEntry(logEntry,index)
}

const addEntry = (logEntry, index) => {
    return logEntry ? Object.assign({index}, logEntry) : false;
}

const splitDate = (start, end) => start + ((end - start) >>> 1)

const merge = (log, list, start = 0, end = list.length - 1) => {
    const logDate = Date.parse(log.date)
    const dateSplit = splitDate(start,end);
    if (list.length <= 0) {
      return [log];
    }
    if (logDate <= Date.parse(list[end].date)) {
      return [...list.slice(0, end + 1), log, ...list.slice(end + 1)]
    }
    if (logDate >= Date.parse(list[start].date)) {
      return [...list.slice(0,start), log, ...list.slice(start)]
    }
    if (logDate >= Date.parse(list[dateSplit].date)) {
      return merge(log, list, start, dateSplit);
    } else {
      return merge(log, list, dateSplit + 1, end);
    }
}

const loopLogsAsync = async (lastLogs,printer,logSources) => {
    while (lastLogs.length > 0) {
          const index = loopValidations(lastLogs, printer)
          let notSortedSource = await addLogEntryIndex(logSources[index], index);    
          if (notSortedSource) {
            lastLogs = merge(notSortedSource, lastLogs);
          }
      }
}

const loopValidations = (lastLogs, printer) => {
      const oldestEntry = lastLogs.pop();
      if (oldestEntry) {
        printer.print(oldestEntry);
        const { index } = oldestEntry;
        return index
      }
}

const loopLogsSync = (lastLogs,printer,logSources) => {
  while (lastLogs.length > 0) {
        const index = loopValidations(lastLogs, printer)
        let notSortedSource = addLogEntryIndex(logSources[index], index);    
        if (notSortedSource) {
          lastLogs = merge(notSortedSource, lastLogs);
        }
    }
}

module.exports.sortByDate = sortByDate;
module.exports.addLogEntryIndex = addLogEntryIndex;
module.exports.addLogEntryIndexAsync = addLogEntryIndexAsync;
module.exports.loopLogsSync = loopLogsSync;
module.exports.loopLogsAsync = loopLogsAsync;
