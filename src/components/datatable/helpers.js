

export const parseDataTables = ({original, translation, compositeKeyIndices, delimiters, columnsFilter}) => {
  let data = [];
  const originalDataTable = parseDataTable({table: original, delimiters});
  const translationDataTable = parseDataTable({table: translation, delimiters})
  if (originalDataTable.columnNames.length === translationDataTable.columnNames.length) {
    let rowIndex = {};
    originalDataTable.data.forEach(row => {
      const componsiteKey = compositeKeyIndices.map(index => row[index]).join(':');
      rowIndex[componsiteKey] = { original: row };
    });
    translationDataTable.data.forEach(row => {
      const componsiteKey = compositeKeyIndices.map(index => row[index]).join(':');
      rowIndex[componsiteKey] = { translation: row, ...rowIndex[componsiteKey]};
    });

    data = Object.values(rowIndex).map(row => {
      const _row = row.original.map((originalCell, index) => {
        const translationCell = row.translation[index];
        let value = `${originalCell}\t${translationCell}`;
        return value;
      });
      return _row;
    });
  }
  return {
    columnNames: originalDataTable.columnNames,
    data,
  };
}

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

export const getColumnNames = (rows) => rows[0];
export const getData = (rows) => rows.slice(1);

export const parseRows = ({table, delimiter}) => table.split(delimiter);
export const parseCells = ({row, delimiter}) => row.split(delimiter);