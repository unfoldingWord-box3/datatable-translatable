import React, { useState, useEffect } from 'react';

import * as helpers from './helpers';

export const DataTableContext = React.createContext();

export function DataTableContextProvider({
  children,
  sourceFile,
  targetFile,
  delimiters,
  config: {
    compositeKeyIndices,
  }
}) {
  const [sourceData, setSourceData] = useState();
  const [targetData, setTargetData] = useState();
  const [changed, setChanged] = useState(false);
  const [data, setData] = useState();
  const [columnNames, setColumnNames] = useState();

  // parse sourceFile when updated
  useEffect(() => {
    const dataTable = helpers.parseDataTable({table: sourceFile, delimiters});
    setSourceData(dataTable.data);
  }, [sourceFile, delimiters]);
  // parse targetFile when updated
  useEffect(() => {
    const dataTable = helpers.parseDataTable({table: targetFile, delimiters});
    setColumnNames(dataTable.columnNames);
    setTargetData(dataTable.data);
    setChanged(false);
  }, [targetFile, delimiters]);
  // correlate data by compositeKeyIndices when sourceData or targetData updated
  useEffect(() => {
    if (sourceData && targetData) {
      const _data = helpers.correlateData({sourceData, targetData, compositeKeyIndices});
      setData(_data);
    }
  }, [sourceData, targetData, compositeKeyIndices]);

  const rowMoveAbove = ({rowIndex}) => {
    const _targetData = helpers.rowMoveAbove({data: targetData, rowIndex});
    setTargetData(_targetData);
    setChanged(true);
  };
  const rowMoveBelow = ({rowIndex}) => {
    const _targetData = helpers.rowMoveBelow({data: targetData, rowIndex});
    setTargetData(_targetData);
    setChanged(true);
  };
  const rowAddBelow = ({rowIndex, newRow}) => {
    const _targetData = helpers.rowAddBelow({data: targetData, rowIndex, newRow});
    setTargetData(_targetData);
    setChanged(true);
  };
  const rowDelete = ({rowIndex}) => {
    let _targetData = helpers.rowDelete({data: targetData, rowIndex});
    setTargetData(_targetData);
    setChanged(true);
  };
  const cellEdit = ({rowIndex, columnIndex, value}) => {
    let _targetData = helpers.cellEdit({data: targetData, rowIndex, columnIndex, value});
    setTargetData(_targetData);
    setChanged(true);
  };

  const stringify = () => helpers.stringify({columnNames, data: targetData, delimiters});

  const state = {
    sourceData,
    targetData,
    columnNames,
    data,
    changed,
  };

  const actions = {
    rowMoveAbove,
    rowMoveBelow,
    rowAddBelow,
    rowDelete,
    cellEdit,
    stringify,
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
