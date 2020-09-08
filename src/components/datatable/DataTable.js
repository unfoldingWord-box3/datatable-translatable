import React, {
  useState, useContext, useRef, useCallback,
} from 'react';
import useEffect from 'use-deep-compare-effect';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Cell, Toolbar } from '../..';
import { getMuiTheme } from './muiTheme';
import { DataTableContext, DataTableContextProvider } from './DataTable.context';
import { getColumns, getData } from './helpers';

function DataTableComponent({
  options = {},
  delimiters,
  config: {
    columnsFilter,
    columnsShowDefault,
    rowHeader:_rowHeader,
  },
  onSave,
  sourceFile,
  generateRowId: _generateRowId,
  ...props
}) {
  const dataTableElement = useRef();
  const [rowsPerPage, setRowsPerPage] = useState(options.rowsPerPage || 25);
  const [preview, setPreview] = useState(true);
  const [columnsShow, setColumnsShow] = useState(columnsShowDefault);
  const { state, actions } = useContext(DataTableContext);
  const {
    columnNames, data, changed, columnsFilterOptions,
  } = state;
  const { cellEdit:_cellEdit } = actions;

  const rowHeader = useCallback(_rowHeader, []);

  const generateRowId = useCallback(_generateRowId, []);

  const cellEdit = useCallback(_cellEdit, []);

  const changePage = useCallback(function (page) {
    dataTableElement.current.changePage(page);
  }, [dataTableElement]);

  useEffect(() => {
    changePage(0);
  }, [changePage, sourceFile]);

  const togglePreview = () => setPreview(!preview);

  const _onSave = () => {
    const savedFile = actions.targetFileSave();
    onSave(savedFile);
  };

  const onColumnViewChange = useCallback((changedColumn, action) => {
    let _columnsShow = [...columnsShow];

    if (action === 'add') {
      _columnsShow.push(changedColumn);
    } else if (action === 'remove') {
      _columnsShow = _columnsShow.filter(col => col !== changedColumn);
    }
    setColumnsShow(_columnsShow);
  }, [columnsShow]);

  const scrollToTop = useCallback(() => {
    if (dataTableElement && dataTableElement.current) {
      window.scrollTo(0, dataTableElement.current.tableRef.offsetParent.offsetTop);
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
    onChangePage: () => scrollToTop(),
    download: false,
    print: false,
    customToolbar: () => (
      <Toolbar preview={preview} onPreview={togglePreview} changed={changed} onSave={_onSave} />
    ),
    ...options,
  };

  const _data = getData({
    data, columnNames, rowHeader,
  });

  const columns = getColumns({
    columnNames, columnsFilter, columnsFilterOptions,
    columnsShow, delimiters, rowHeader,
    generateRowId, cellEdit, preview,
  });

  console.log('data', _data);

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <MUIDataTable ref={dataTableElement} columns={columns} data={_data} options={_options} {...props} />
    </MuiThemeProvider>
  );
}

function DataTable({
  config, options, ...props
}) {
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
    cell: '\t',
  },
};

export default DataTable;