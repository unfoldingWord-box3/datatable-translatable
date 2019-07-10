
export const rowMoveAbove = ({data, rowIndex}) => arrayMove(data, rowIndex, rowIndex - 1);
export const rowMoveBelow = ({data, rowIndex}) => arrayMove(data, rowIndex, rowIndex + 1);
export const rowAddAbove = ({data, rowIndex, newRow}) => [...data].splice(rowIndex - 1, 0, newRow);
export const rowAddBelow = ({data, rowIndex, newRow}) => [...data].splice(rowIndex + 1, 0, newRow);
export const rowDelete = ({data, rowIndex}) => [...data].splice(rowIndex, 1);
export const cellEdit = ({data, rowIndex, columnIndex, value}) => {
  let _data = [...data];
  _data[rowIndex][columnIndex] = value;
  return _data;
};

export const generateNewRow = ({data, columns, row}) => {
  let dataIndex = {};
  let lengthIndex = {};
  data.forEach(_row => {
    _row.forEach((value, index) => {
      const column = columns[index];
      if (!dataIndex[column]) dataIndex[column] = {};
      if (!dataIndex[column][value]) dataIndex[column][value] = 0;
      dataIndex[column][value] ++;
      const valueLength = value.length;
      if (!lengthIndex[column]) lengthIndex[column] = {};
      if (!lengthIndex[column][valueLength]) lengthIndex[column][valueLength] = 0;
      lengthIndex[column][valueLength] ++;
    });
  });
  const rowCount = data.length;
  let newRow = row.map((value, index) => {
    const column = columns[index];
    const values = Object.keys(dataIndex[column]).length;
    const valuesRatio = values / rowCount;
    const duplicateValue = (valuesRatio < 0.5);

    const valuesLengths = Object.keys(lengthIndex[column]);
    const valuesLengthsLength = valuesLengths.length;
    const needRandomId = (valuesRatio > 0.99 && valuesLengthsLength <= 2);

    let newValue = '';
    if (duplicateValue) {
      newValue = value;
    } else if (needRandomId) {
      const {length} = value;
      newValue = randomId({length});
    }
    return newValue;
  });
  return newRow;
};

export const correlateData = ({sourceData, targetData, compositeKeyIndices}) => {
  let data = [];
  if (sourceData[0].length === targetData[0].length) {
    let rowIndex = {};
    targetData.forEach(row => {
      const compositeKey = compositeKeyIndices.map(index => row[index]).join(':');
      rowIndex[compositeKey] = { translation: row };
    });
    sourceData.forEach(row => {
      const compositeKey = compositeKeyIndices.map(index => row[index]).join(':');
      // rowIndex[compositeKey] = rowIndex[compositeKey] || {};
      rowIndex[compositeKey] = { original: row, ...rowIndex[compositeKey] };
    });

    data = Object.values(rowIndex).map(row =>
      row.original.map((originalCell, index) =>
        `${originalCell}\t${row.translation[index]}`
      )
    );
  }
  return data;
};

export const parseDataTable = ({table, delimiters}) => {
  const rows = parseRows({table, delimiter: delimiters.row})
  .map(row =>
    parseCells({row, delimiter: delimiters.cell})
  );
  const dataTable = {
    columnNames: getColumnNames(rows),
    data: getData(rows),
  }
  return dataTable;
};

export const stringify = ({columnNames, data, delimiters}) => {
  let string = "";
  if (columnNames && data) {
    let rows = [columnNames, ...data];
    string = rows.map(cells => cells.join(delimiters.cell))
    .join(delimiters.row);
  }
  return string;
};

export const getColumnNames = (rows) => rows[0];
export const getData = (rows) => rows.slice(1);

export const parseRows = ({table, delimiter}) => table.split(delimiter).filter(row => row !== "");
export const parseCells = ({row, delimiter}) => row.split(delimiter);

// Private

const randomId = ({length}) => {
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