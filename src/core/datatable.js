
export const rowMoveAbove = ({ rows, rowIndex }) => arrayMove(rows, rowIndex, rowIndex - 1);
export const rowMoveBelow = ({ rows, rowIndex }) => arrayMove(rows, rowIndex, rowIndex + 1);
export const rowAddAbove = ({ rows, rowIndex, rowData }) => {
  let _rows = [...rows];
  _rows.splice(rowIndex - 1, 0, rowData);
  return _rows;
};
export const rowAddBelow = ({ rows, rowIndex, rowData }) => {
  let _rows = [...rows];
  _rows.splice(rowIndex + 1, 0, rowData);
  return _rows;
};
export const rowDelete = ({ rows, rowIndex }) => {
  let _rows = [...rows];
  _rows.splice(rowIndex, 1);
  return _rows;
};
export const cellEdit = ({ rows, rowIndex, columnIndex, value }) => {
  let _rows = rows.map(cells => [...cells]);
  _rows[rowIndex][columnIndex] = value;
  return _rows;
};

export const rowGenerate = ({ rows, columnNames, rowIndex }) => {
  let rowsIndex = {};
  let lengthIndex = {};
  const rowData = rows[rowIndex];
  rows.forEach(_row => {
    _row.forEach((value, index) => {
      const column = columnNames[index];
      if (!rowsIndex[column]) rowsIndex[column] = {};
      if (!rowsIndex[column][value]) rowsIndex[column][value] = 0;
      rowsIndex[column][value]++;
      const valueLength = value.length;
      if (!lengthIndex[column]) lengthIndex[column] = {};
      if (!lengthIndex[column][valueLength]) lengthIndex[column][valueLength] = 0;
      lengthIndex[column][valueLength]++;
    });
  });
  const rowCount = rows.length;
  let newRow = rowData.map((value, index) => {
    const column = columnNames[index];
    const values = Object.keys(rowsIndex[column]).length;
    const valuesRatio = values / rowCount;
    const duplicateValue = (valuesRatio < 0.5);

    const valuesLengths = Object.keys(lengthIndex[column]);
    const valuesLengthsLength = valuesLengths.length;
    const needRandomId = (valuesRatio > 0.99 && valuesLengthsLength <= 2);

    let newValue = '';
    if (duplicateValue) {
      newValue = value;
    } else if (needRandomId) {
      const { length } = value;
      newValue = randomId({ length });
    }
    return newValue;
  });
  return newRow;
};

export const correlateData = ({ sourceRows, targetRows, compositeKeyIndices, delimiters }) => {
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
          `${sourceCell}${delimiters.cell}${row.target ? row.target[index] : ''}`
        );
      } else {
        _row = row.target.map((targetCell, index) =>
          `${delimiters.cell}${targetCell}`
        );
      }
      return _row;
    });
  }
  return data;
};

export const parseDataTable = ({ table, delimiters }) => {
  const rows = parseRows({ table, delimiter: delimiters.row })
    .map(row =>
      parseCells({ row, delimiter: delimiters.cell })
    );
  const dataTable = {
    columnNames: getColumnNames(rows),
    rows: getRows(rows),
  }
  return dataTable;
};

export const stringify = ({ columnNames, rows, delimiters }) => {
  let string = "";
  if (columnNames && rows) {
    let dataTable = [columnNames, ...rows];
    string = dataTable.map(cells => cells.join(delimiters.cell))
      .join(delimiters.row);
  }
  return string;
};

export const getColumnNames = (rows) => rows[0];
export const getRows = (rows) => rows.slice(1);

export const parseRows = ({ table, delimiter }) => table.split(delimiter).filter(row => row !== "");
export const parseCells = ({ row, delimiter }) => row.split(delimiter);

// Private

const randomId = ({ length }) => {
  const number = Math.random() // 0.9394456857981651
  // number.toString(36); // '0.xtis06h6'
  if (length > 9) length = 9;
  const id = number.toString(36).substr(2, length); // 'xtis06h6'
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