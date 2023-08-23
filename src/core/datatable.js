
export const rowMoveAbove = ({ rows, rowIndex }) => arrayMove(rows, rowIndex, rowIndex - 1);
export const rowMoveBelow = ({ rows, rowIndex }) => arrayMove(rows, rowIndex, rowIndex + 1);
export const rowAddAbove = ({
  rows, rowIndex, rowData,
}) => {
  let _rows = [...rows];
  _rows.splice(rowIndex - 1, 0, rowData);
  return _rows;
};
export const rowAddBelow = ({
  rows, rowIndex, rowData,
}) => {
  let _rows = [...rows];
  _rows.splice(rowIndex + 1, 0, rowData);
  return _rows;
};
export const rowDelete = ({ rows, rowIndex }) => {
  let _rows = [...rows];
  _rows.splice(rowIndex, 1);
  return _rows;
};
export const cellEdit = ({
  rows, rowIndex, columnIndex, value, data,
}) => {
  let _rows = rows.map(cells => [...cells]);
  // if row index points beyond end of array, 
  // then add as many empty rows as needed to 
  // make it a valid, even if empty row
  if ( rowIndex >= rows.length || rows[rowIndex] === undefined ) {
    //console.log("Undo delete process begins")
    //console.log("[datatable.js] cellEdit() number of row=", rows.length, " rowIndex=", rowIndex, " rows[rowIndex]", rows[rowIndex]);
    for (let i=-1; i < (rowIndex - rows.length); i++) {
      let _row = new Array(rows[0].length);
      // set each cell in new row to be empty string
      for (let j=0; j < _row.length; j++) {
        //_row[j] = "";
      }
      _rows.push( _row );
    }
    // now do an "undo" by filling in values from source
    for (let i=0; i < _rows[rowIndex].length; i++) {
      _rows[rowIndex][i] = data[rowIndex][i].trim();
    }
    //console.log("Undo delete process ends")
  }
  
  _rows[rowIndex][columnIndex] = value;
  //console.log("_rows before filter:", _rows);
  // next remove any empty rows created by the undo delete process
  _rows = _rows.filter( arow => arow[0] !== undefined );
  //console.log("_rows after filter:", _rows);

  return _rows;
};

export const rowGenerate = ({
  rows, columnNames, rowIndex,
}) => {
  let rowsIndex = {};
  let lengthIndex = {};
  const rowData = rows[rowIndex];

  rows.forEach(_row => {
    _row.forEach((value, index) => {
      const column = columnNames[index];

      if (!rowsIndex[column]) {
        rowsIndex[column] = {};
      }

      if (!rowsIndex[column][value]) {
        rowsIndex[column][value] = 0;
      }
      rowsIndex[column][value]++;
      const valueLength = value.length;

      if (!lengthIndex[column]) {
        lengthIndex[column] = {};
      }

      if (!lengthIndex[column][valueLength]) {
        lengthIndex[column][valueLength] = 0;
      }
      lengthIndex[column][valueLength]++;
    });
  });

  const rowCount = rows.length;
  let newRow = rowData.map((value, index) => {
    const column = columnNames[index];
    const values = Object.keys(rowsIndex[column]).length;
    const valuesRatio = values / rowCount;
    const duplicateValue = (valuesRatio < 0.65); // If the value is reused many times then it should be duplicated.

    const valuesLengths = Object.keys(lengthIndex[column]);
    const valuesLengthsLength = valuesLengths.length;
    const needRandomId = (valuesRatio > 0.99 && valuesLengthsLength <= 2);
    let newValue = '';

    if (duplicateValue) {
      newValue = value;
    } else if (needRandomId) {
      const allIds = Object.keys(rowsIndex[column]);
      newValue = generateRandomUID(allIds);
    }
    return newValue;
  });
  return newRow;
};

export function generateRandomUID(allIds=[], defaultLength=4) {
  let sampleID = allIds[0];
  let length = sampleID?.length || defaultLength;
  let notUnique = true;
  let counter = 0;
  let newID = '';
  const UNIQUE_COUNTER_THRESHOLD = 1000;

  while ( notUnique && counter < UNIQUE_COUNTER_THRESHOLD ) {
    newID = randomId({ length });
    notUnique = allIds.includes(newID);
    counter++;
  }

  if ( counter >= UNIQUE_COUNTER_THRESHOLD) {
    console.log('Duplicate IDs found after ' + UNIQUE_COUNTER_THRESHOLD + ' tries')
  }
  return newID;
}

export const correlateData = ({
  sourceRows, targetRows, compositeKeyIndices, delimiters,
}) => {
  let data = [];

  if (sourceRows[0].length === targetRows[0].length) {
    let rowIndex = {};

    targetRows.forEach(row => {
      const compositeKey = compositeKeyIndices.map(index => row[index]).join(':');
      rowIndex[compositeKey] = { target: row };
    });
    sourceRows.forEach(row => {
      const compositeKey = compositeKeyIndices.map(index => row[index]).join(':');
      // rowIndex[compositeKey] = rowIndex[compositeKey] || {};
      rowIndex[compositeKey] = { source: row, ...rowIndex[compositeKey] };
    });

    data = Object.values(rowIndex).map(row => {
      let _row;

      if (row.source) {
        _row = row.source.map((sourceCell, index) =>
          `${sourceCell}${delimiters.cell}${row.target ? 
            row.target[index]
            .replace(/^\u200B+/, '')
            .replace(/\u200B+$/,'') 
            : ''}`,
        );
      } else {
        _row = row.target.map((targetCell, index) =>
          `${delimiters.cell}${targetCell.replace(/^\u200B+/, '').replace(/\u200B+$/,'')}`,
        );
      }
      return _row;
    });
  }
  return data;
};

export const getColumnsFilterOptions = ({
  columnIndices, data, delimiters,
}) => {
  const _columnsFilterOptions = [];

  data.forEach(row => {
    columnIndices.forEach(columnIndex => {
      const values = row[columnIndex].split(delimiters.cell);

      values.forEach(value => {
        if (value) {
          if (!_columnsFilterOptions[columnIndex]) {
            _columnsFilterOptions[columnIndex] = new Set();
          }

          if (!_columnsFilterOptions[columnIndex].has(value)) {
            _columnsFilterOptions[columnIndex].add(value);
          }
        }
      });
    });
  });
  columnIndices.forEach(columnIndex => {
    if (_columnsFilterOptions[columnIndex]) {
      _columnsFilterOptions[columnIndex] = [..._columnsFilterOptions[columnIndex]].sort(sortSKU);// sort chapters and verses
    }
  });
  return _columnsFilterOptions;
};

export const parseDataTable = ({ table, delimiters }) => {
  const rows = parseRows({ table, delimiter: delimiters.row })
    .map(row =>
      parseCells({ row, delimiter: delimiters.cell }),
    );
  const dataTable = {
    columnNames: getColumnNames(rows),
    rows: getRows(rows),
  };
  return dataTable;
};

export const stringify = ({
  columnNames, rows, delimiters,
}) => {
  let string = '';

  if (columnNames && rows) {
    let dataTable = [columnNames, ...rows];
    for (let i=0; i<dataTable.length; i++) {
      let rowstring = '';
      for (let j=0; j<dataTable[i].length; j++) {
        rowstring += dataTable[i][j].replaceAll(/\n/gi,'<br>');
        if ( j < (dataTable[i].length - 1) ) {rowstring += delimiters.cell};
      }
      string += rowstring;

      // Don't add newline if we are at the end of the file.
      if ( i < dataTable.length - 1 ) {
        string += delimiters.row;
      }
    }
    // The below is commented out and replaced with the 2d for loop above.
    // This is needed in order to only apply the outputFilter to make newlines 
    // into <br> elements when no parser is provided to the component. 
    // This makes up for the unconditional removal 
    // from the datatable outputfilter specified in Cell.js
    //string = dataTable.map(cells => cells.join(delimiters.cell)).join(delimiters.row);
  }
  return string;
};

export const getColumnNames = (rows) => rows[0];
export const getRows = (rows) => rows.slice(1);

export const parseRows = ({ table, delimiter }) => table.split(delimiter).filter(row => row !== '');
export const parseCells = ({ row, delimiter }) => row.split(delimiter);

// Private

// ids must begin with a letter
const randomId = ({ length }) => {
  // get the initial letter first
  const letters = ["a", "b", "c", "d", "e", "f", "g",
    "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",
    "r", "s", "t", "u", "v", "w", "x", "y", "z"
  ];
  const random = Math.floor(Math.random() * letters.length);
  const number = Math.random(); // 0.9394456857981651

  // number.toString(36); // '0.xtis06h6'
  if (length > 9) {
    length = 9;
  }

  const id = letters[random] + number.toString(36).substr(2, length-1); // 'xtis06h6'
  return id;
};

const arrayMove = (array, oldIndex, newIndex) => {
  let _array = [...array];
  const tooLow = (newIndex < 0);
  const tooHigh = (newIndex > array.length - 1);

  if (!tooLow && !tooHigh) {
    var element = _array[oldIndex];
    _array.splice(oldIndex, 1);
    _array.splice(newIndex, 0, element);
  }
  return _array;
};

export const getRowElement = (generateRowId, rowData, position) => {
  const id = generateRowId(rowData);
  const currentHeader = document.getElementById(id);
  const previousSiblingHeader = getSiblingByClassName(currentHeader, '.header-row', position);
  return previousSiblingHeader;
};

function getSiblingByClassName(div, className, position) {
  const allInstances = Array.from(document.querySelectorAll(className));
  const indexOfCurrentElement = allInstances.indexOf(div);
  return allInstances[indexOfCurrentElement + position];
}

export function getOffset(element) {
  var rect, win;

  if ( !element ) {
    return;
  }

  // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
  // Support: IE <=11+
  // Running getBoundingClientRect on a
  // disconnected node in IE throws an error
  if ( !element.getClientRects().length ) {
    return { top: 0, left: 0 };
  }

  // Get document-relative position by adding viewport scroll to viewport-relative gBCR
  rect = element.getBoundingClientRect();
  win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}

function sortSKU( a, b ) {
  var aParts = a.split( ':' ),
    bParts = b.split( ':' ),
    partCount = aParts.length,
    i;

  if ( aParts.length !== bParts.length ) {
    return aParts.length - bParts.length;
  }

  for ( i = 0 ; i < partCount ; i++ ) {
    if ( aParts[i] !== bParts[i] ) {
      return +aParts[i] - +bParts[i];
    }
  }
  //Exactly the same
  return 0;
}