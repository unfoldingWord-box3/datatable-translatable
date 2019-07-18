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
  delimiters,
  config: {
    compositeKeyIndices,
  },
  ...props
}) {
  const [targetFile, setTargetFile] = useState(props.targetFile);
  const [sourceRows, setSourceRows] = useState();
  const [targetRows, targetRowsDispatch] = useReducer(rowsReducer, undefined);
  const setTargetRows = (rows) => targetRowsDispatch({type: 'SET_ROWS', value: {rows}});
  const [changed, setChanged] = useState(false);
  const [data, setData] = useState();
  const [columnNames, setColumnNames] = useState();

  useEffect(() => {
    setChanged(true);
  }, [targetRows]);
  // update targetFile when targetRows is updated
  useEffect(() => {
    if (targetRows) {
      const _targetFile = helpers.stringify({columnNames, rows: targetRows, delimiters});
      if (_targetFile !== targetFile) setTargetFile(_targetFile);
    }
  }, [targetFile, targetRows, columnNames, delimiters]);
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

  const rowMoveAbove = ({rowIndex}) => {
    targetRowsDispatch({type: 'ROW_MOVE_ABOVE', value: {rowIndex}});
  };
  const rowMoveBelow = ({rowIndex}) => {
    targetRowsDispatch({type: 'ROW_MOVE_BELOW', value: {rowIndex}});
  };
  const rowAddBelow = ({rowIndex, rowData}) => {
    targetRowsDispatch({type: 'ROW_ADD_ABOVE', value: {rowIndex, rowData}});
  };
  const rowDelete = ({rowIndex}) => {
    targetRowsDispatch({type: 'ROW_DELETE', value: {rowIndex}});
  };
  const cellEdit = ({rowIndex, columnIndex, value}) => {
    targetRowsDispatch({type: 'CELL_EDIT', value: {rowIndex, columnIndex, value}});
  };

  const rowGenerate = ({rowIndex}) => (
    helpers.rowGenerate({rows: targetRows, columnNames, rowIndex})
  );

  const state = deepFreeze({
    targetFile,
    columnNames,
    data,
    changed,
  });

  const actions = {
    rowMoveAbove,
    rowMoveBelow,
    rowAddBelow,
    rowDelete,
    rowGenerate,
    cellEdit,
  };

  const value = {
    state,
    actions,
  };

  let component = <></>;
  if (columnNames && data) {
    component = (
      <DataTableContext.Provider value={value}>
        {children}
      </DataTableContext.Provider>
    );
  }
  return component;
};
