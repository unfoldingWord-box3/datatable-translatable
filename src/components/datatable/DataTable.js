import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import { getMuiTheme } from './muiTheme';
import { Cell, Toolbar } from '../';

import { DataTableContext, DataTableContextProvider } from './DataTable.context';

function DataTableComponent ({
  options,
  config: {
    columnsFilter,
    columnsShowDefault,
    rowHeader,
  },
  ...props
}) {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [preview, setPreview] = useState(true);
  const {columnNames, data} = useContext(DataTableContext).state;

  const togglePreview = () => setPreview(!preview);
  const onSave = () => {};

  const _options = {
    responsive: 'scroll',
    fixedHeader: false,
    resizableColumns: false,
    selectableRows: 'none',
    rowHover: false,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [25, 50, 100],
    onChangeRowsPerPage: setRowsPerPage,
    download: false,
    print: false,
    customToolbar: () => (
      <Toolbar preview={preview} onPreview={togglePreview} onSave={onSave} />
    ),
    ...options
  };
  
  let columns = [];
  let _data = [...data];
  if (columnNames && data) {
    const customBodyRender = (value, tableMeta, updateValue) => (
      <Cell value={value} rowHeader={rowHeader} tableMeta={tableMeta} preview={preview} />
    );
    columns = columnNames.map((name, index) => ({
      name,
      searchable: true,
      options: {
        display: columnsShowDefault.includes(index),
        filter: columnsFilter.includes(index),
        customBodyRender,
        customFilterListRender: (value) => value.split('\t')[0],
      },
    }));
    if (rowHeader) {
      const headerColumn = {
        name: 'rowHeader',
        options: {
          filter: false,
          customBodyRender,
        },
      };
      columns.unshift(headerColumn);
      _data = data.map(row => ['rowHeader', ...row]);
    }
  }

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <MUIDataTable columns={columns} data={_data} options={_options} {...props} />
    </MuiThemeProvider>
  );
}

function DataTable({ config, options, ...props }) {
  return (
    <DataTableContextProvider config={config} {...props}>
      <DataTableComponent config={config} options={options} />
    </DataTableContextProvider>
  );
}

DataTable.propTypes = {
  /** Original DataTable raw string or file contents */
  sourceFile: PropTypes.string.isRequired,
  /** Translated DataTable raw string or file contents */
  targetFile: PropTypes.string.isRequired,
  /** The delimiters for converting the file into rows/columns */
  delimiters: PropTypes.shape({
    /** Delimiters to convert a files into rows "\n" */
    row: PropTypes.string.isRequired,
    /** Delimiters to convert a row into cells "\t" */
    cell: PropTypes.string.isRequired,
  }).isRequired,
  /** Configuration options */
  config: PropTypes.shape({
    /** Combined Column Indices to correlate original and translated rows  */
    compositeKeyIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
    /** Filterable columns */
    columnsFilter: PropTypes.arrayOf(PropTypes.number).isRequired,
    /** Columns shown */
    columnsShowDefault: PropTypes.arrayOf(PropTypes.number).isRequired,
    /** Function to render the row header.
     * `rowHeader(rowData) => React Component`
    */
    rowHeader: PropTypes.func,
  }).isRequired,
  /** Options to override or pass through to MUIDataTables */
  options: PropTypes.object,
};

DataTable.defaultProps = {
  delimiters: {
    row: '\n',
    cell: '\t'
  }
};

export default DataTable;