import React, { useState, useReducer, useEffect } from 'react';
import deepFreeze from 'deep-freeze';

import * as helpers from './helpers';

export const DataTableContext = React.createContext();

const rowsReducer = (rows, action) => {
  let _rows;
  const {type, value} = action;
  const {rowIndex, rowData, columnIndex} = value;
  switch (type) {
    case 'SET_ROWS':
      return deepFreeze(value.rows);
    case 'ROW_MOVE_ABOVE':
      _rows = helpers.rowMoveAbove({rows, rowIndex});
      return deepFreeze(_rows);
    case 'ROW_MOVE_BELOW':
      _rows = helpers.rowMoveBelow({rows, rowIndex});
      return deepFreeze(_rows);
    case 'ROW_ADD_BELOW':
      _rows = helpers.rowAddBelow({rows, rowIndex, rowData});
      return deepFreeze(_rows);
    case 'ROW_DELETE':
      _rows = helpers.rowDelete({rows, rowIndex});
      return deepFreeze(_rows);
    case 'CELL_EDIT':
      _rows = helpers.cellEdit({rows, rowIndex, columnIndex, value: value.value});
      return deepFreeze(_rows);
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  };
};

export function DataTableContextProvider({
  children,
  sourceFile,
  targetFile,
  delimiters,
  config: {
    compositeKeyIndices,
  },
}) {
  const [sourceRows, setSourceRows] = useState();
  const [targetRows, targetRowsDispatch] = useReducer(rowsReducer, undefined);
  const setTargetRows = (rows) => targetRowsDispatch({type: 'SET_ROWS', value: {rows}});
  const [changed, setChanged] = useState(false);
  const [data, setData] = useState();
  const [columnNames, setColumnNames] = useState();

  // parse sourceFile when updated
  useEffect(() => {
    const {rows} = helpers.parseDataTable({table: sourceFile, delimiters});
    setSourceRows(rows);
  }, [sourceFile, delimiters]);
  // parse targetFile when updated
  useEffect(() => {
    const {columnNames, rows} = helpers.parseDataTable({table: targetFile, delimiters});
    setColumnNames(columnNames);
    setTargetRows(rows);
    setChanged(false);
  }, [targetFile, delimiters]);
  // correlate data by compositeKeyIndices when sourceRows or targetRows updated
  useEffect(() => {
    if (sourceRows && targetRows) {
      const _data = helpers.correlateData({sourceRows, targetRows, compositeKeyIndices, delimiters});
      setData(_data);
    }
  }, [sourceRows, targetRows, compositeKeyIndices, delimiters]);

  const actions = {
    rowMoveAbove: ({rowIndex}) => {
      targetRowsDispatch({type: 'ROW_MOVE_ABOVE', value: {rowIndex}});
      setChanged(true);
    },
    rowMoveBelow: ({rowIndex}) => {
      targetRowsDispatch({type: 'ROW_MOVE_BELOW', value: {rowIndex}});
      setChanged(true);
    },
    rowAddBelow: ({rowIndex, rowData}) => {
      targetRowsDispatch({type: 'ROW_ADD_ABOVE', value: {rowIndex, rowData}});
      setChanged(true);
    },
    rowDelete: ({rowIndex}) => {
      targetRowsDispatch({type: 'ROW_DELETE', value: {rowIndex}});
      setChanged(true);
    },
    cellEdit: ({rowIndex, columnIndex, value}) => {
      targetRowsDispatch({type: 'CELL_EDIT', value: {rowIndex, columnIndex, value}});
      setChanged(true);
    },
    rowGenerate: ({rowIndex}) => helpers.rowGenerate({rows: targetRows, columnNames, rowIndex}),
    targetFileSave: () => helpers.stringify({columnNames, rows: targetRows, delimiters}),
  };

  const state = deepFreeze({
    columnNames,
    data,
    changed,
  });

  let component = <></>;
  if (columnNames && data) {
    component = (
      <DataTableContext.Provider value={{ state, actions }}>
        {children}
      </DataTableContext.Provider>
    );
  }
  return component;
};
