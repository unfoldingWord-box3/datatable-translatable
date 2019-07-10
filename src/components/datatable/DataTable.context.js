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
  }, [targetFile, delimiters]);
  // correlate data by compositeKeyIndices when sourceData or targetData updated
  useEffect(() => {
    if (sourceData && targetData) {
      const _data = helpers.correlateData({sourceData, targetData, compositeKeyIndices});
      setData(_data);
    }
  }, [sourceData, targetData, compositeKeyIndices]);

  const rowMoveAbove = ({rowIndex}) => {
    const _targetData = helpers.rowMoveAbove({targetData, rowIndex});
    setTargetData(_targetData);
  };
  const rowMoveBelow = ({rowIndex}) => {
    const _targetData = helpers.rowMoveBelow({targetData, rowIndex});
    setTargetData(_targetData);
  };
  const rowAddBelow = ({rowIndex, newRow}) => {
    const _targetData = helpers.rowAddBelow({targetData, rowIndex, newRow});
    setTargetData(_targetData);
  };
  const rowDelete = ({rowIndex}) => {
    let _targetData = helpers.rowDelete({targetData, rowIndex});
    setTargetData(_targetData);
  };
  const cellEdit = ({rowIndex, columnIndex, value}) => {
    let _targetData = helpers.cellEdit({targetData, rowIndex, columnIndex, value});
    setTargetData(_targetData);
  };

  const stringify = () => helpers.stringify({columnNames, targetData, delimiters});

  const state = {
    sourceData,
    targetData,
    columnNames,
    data,
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
