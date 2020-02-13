import React, { useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from '@material-ui/core/styles';
import { getMuiTheme } from './muiTheme';
import { Cell, Toolbar } from '../../';
import { filterLogic, filterDisplay } from '../column-filter/helpers';

import { DataTableContext, DataTableContextProvider } from './DataTable.context';

function DataTableComponent({
  options,
  delimiters,
  config: {
    columnsFilter,
    columnsShowDefault,
    rowHeader,
  },
  onSave,
  ...props
}) {
  const [dataTableElement, setDataTableElement] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [preview, setPreview] = useState(true);
  const [columns, setColumns] = useState([]);
  const [columnsShow, setColumnsShow] = useState(columnsShowDefault);
  const { state, actions } = useContext(DataTableContext);
  const { columnNames, data, changed, columnsFilterOptions } = state;
  const { cellEdit } = actions;

  const togglePreview = () => setPreview(!preview);
  const _onSave = () => {
    const savedFile = actions.targetFileSave();
    onSave(savedFile);
  };

  const onColumnViewChange = useCallback((changedColumn, action) => {
    let _columnsShow = [...columnsShow];
    if (action === 'add') _columnsShow.push(changedColumn);
    else if (action === 'remove') _columnsShow = _columnsShow.filter(col => col !== changedColumn);
    setColumnsShow(_columnsShow);
  }, [columnsShow]);

  const scrollToTop = useCallback(() => {
    if (dataTableElement && dataTableElement.tableRef) {
      window.scrollTo(0, dataTableElement.tableRef.offsetParent.offsetTop);
    }
  }, [dataTableElement]);

  const _options = {
    responsive: 'scrollFullHeight',
    fixedHeaderOptions: { xAxis: false, yAxis: false },
    resizableColumns: false,
    selectableRows: 'none',
    rowHover: false,
    rowsPerPage,
    rowsPerPageOptions: [25, 50, 100],
    onChangeRowsPerPage: (rows) => {
      setRowsPerPage(rows);
      scrollToTop();
    },
    onColumnViewChange,
    onChangePage: () => {
      scrollToTop()
    },
    download: false,
    print: false,
    customToolbar: () => (
      <Toolbar preview={preview} onPreview={togglePreview} changed={changed} onSave={_onSave} />
    ),
    ...options
  };

  useEffect(() => {
    const { columnNames } = state;
    const customBodyRender = (value, tableMeta, updateValue) => {
      const cellProps = { value, rowHeader, tableMeta, preview, onEdit: cellEdit, delimiters };
      return (<Cell {...cellProps} />);
    };

    let _columns = columnNames.map((name, index) => {
      const offset = rowHeader ? 1 : 0;
      let filterOptions;
      if (columnsFilter.includes(name)) {
        filterOptions = {
          logic: (value, filters) => filterLogic({value, filters, delimiters}),
          display: (filterList, onChange, filterIndex, column) => (
            filterDisplay({
              filterList, onChange, column, offset, columnsFilterOptions, filterIndex,
            })
          ),
        };
      };
      return {
        name,
        searchable: true,
        options: {
          display: columnsShow.includes(name),
          filter: columnsFilter.includes(name),
          filterType: columnsFilter.includes(name) ? 'custom' : undefined,
          filterOptions,
          customBodyRender,
          customFilterListOptions: {
            render: (value) => (`${name} - ${value}`),
          }
        },
      };
    });
    if (rowHeader) {
      const headerColumn = {
        name: 'rowHeader',
        options: {
          filter: false,
          customBodyRender,
        },
      };
      _columns.unshift(headerColumn);
    }
    setColumns(_columns);
    return () => {
      setColumns();
    };
  }, [state, cellEdit, delimiters, preview, rowHeader, columnsFilter, columnsShow, columnsFilterOptions]);

  let _data = [...data];
  if (columnNames && data && rowHeader) {
    _data = data.map(row => ['rowHeader', ...row]);
  }

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <MUIDataTable ref={setDataTableElement} columns={columns} data={_data} options={_options} {...props} />
    </MuiThemeProvider>
  );
}

function DataTable({ config, options, ...props }) {
  return (
    <DataTableContextProvider config={config} {...props}>
      <DataTableComponent config={config} options={options} {...props} />
    </DataTableContextProvider>
  );
}

DataTable.propTypes = {
  /** Original DataTable raw string or file contents */
  sourceFile: PropTypes.string.isRequired,
  /** Translated DataTable raw string or file contents */
  targetFile: PropTypes.string.isRequired,
  /** The callback to save the edited targetFile */
  onSave: PropTypes.func.isRequired,
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
    columnsFilter: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** Columns shown */
    columnsShowDefault: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** Function to render the row header.
     * `rowHeader(rowData) => React Component`
    */
    rowHeader: PropTypes.func,
  }).isRequired,
  /** Options to override or pass through to MUIDataTables.
   *  https://github.com/gregnb/mui-datatables
   */
  options: PropTypes.object,
};

DataTable.defaultProps = {
  delimiters: {
    row: '\n',
    cell: '\t'
  }
};

export default DataTable;