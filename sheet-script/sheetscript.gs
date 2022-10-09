// start of the func to accept trigger
function setUpTrigger() {
  const excelId = '10btex5Fyk3_SNxLGK59fbzrbRbcY3X45_7hWcBW1Xsw'
  const triggerFuncName = 'eventListener'

  ScriptApp.newTrigger(triggerFuncName).forSpreadsheet(excelId).onEdit().create();
}

// entry point of the trigger method
function eventListener(e) { 
  var range = e.range;
  var records = e.source.getDataRange().getValues();

  const data = {
    row: getUpdatedRow(records, updatedRowIdx), // row data based of updatedRowIdx in array
    colName: getColumnName(records), // name of the col lists in array
    colIdx: range.getColumn().toFixed(0) - 1, // getColumn() starts index at 1.0,
    rowIdx: range.getRow().toFixed(0) -1 // getRow() starts index at 1.0
    value: e.value // user updated value
  }
  
  //todo: error handling
  sendTriggerEvent(data)
}

// sendTriggerEvent send the sheet data to the sheetpilot apiserver
function sendTriggerEvent(data) {
  return UrlFetchApp.fetch('http://3.0.54.51:4001/api/v1/sheet', {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  });
}

// getColumnName transform the 2D array of sheet records to single array of column names
function getColumnName(values, idx) {
  var col = []
  for (var j = 0; j < values[idx].length; j++) {
    if (values[0][j]) {
      col.push(values[0][j]);
    }
  }
  return col;
}

// getUpdatedRow transform the 2D array of sheet records to single array that contains updated row data
function getUpdatedRow(values, updatedRowIdx) {
  var row = []
  for (var j = 0; j < values[updatedRowIdx].length; j++) {
    if (values[updatedRowIdx][j]) {
      row.push(values[updatedRowIdx][j])
    }
  }
  return row;
}