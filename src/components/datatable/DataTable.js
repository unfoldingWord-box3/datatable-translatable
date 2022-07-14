import { Toolbar } from '../..';
import { getMuiTheme } from './muiTheme';
import { DataTableContext, DataTableContextProvider } from './DataTable.context';
import { getColumns, getData } from './helpers';

import React, {
  useState, useContext, useRef, useCallback, useMemo, useEffect,
} from 'react';
import isEqual from 'lodash.isequal';
import useDeepEffect from 'use-deep-compare-effect';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { MarkdownContext, MarkdownContextProvider } from 'markdown-translatable';

const fixedHeaderOptions = { xAxis: false, yAxis: false };
const rowsPerPageOptions = [25, 50, 100];

export default function DataTableWrapper(props) {
  return (
    <MarkdownContextProvider>
      <DataTableContextProvider {...props}>
        <DataTable {...props} />
      </DataTableContextProvider>
    </MarkdownContextProvider>
  );
}

// eslint-disable-next-line react/display-name
const DatatableMemo = React.memo(function ({
  columns, options, data, dataTableElement,
}) {
  return (<MUIDataTable ref={dataTableElement} columns={columns} options={options} data={data} />);
}, (prevProps, nextProps) => {
  const equal = isEqual(prevProps.data, nextProps.data) &&
    isEqual(prevProps.columns, nextProps.columns) &&
    isEqual(prevProps.options, nextProps.options);
  return equal;
});

function DataTable({
  options = {},
  delimiters,
  config,
  onSave,
  onEdit,
  onValidate,
  onContentIsDirty,
  sourceFile,
  generateRowId: _generateRowId,
  ...props
}) {
  const {
    columnsFilter,
    columnsShowDefault,
    rowHeader,
  } = config;
  const dataTableElement = useRef();
  const [page, setPage] = useState(0);
  const [savePage, setSavePage] = useState(0);
  const [clickedPage, setClickedPage] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(options.rowsPerPage || 25);
  const [preview, setPreview] = useState(false);
  const [columnsShow, setColumnsShow] = useState(columnsShowDefault);
  const [isAutoSaveChanged, setIsAutoSaveChanged] = useState(false);
  const [saveRowId, setSaveRowId] = React.useState('');
  const [pagination, setPagination] = React.useState(true);
  const [searchClose, setSearchClose] = React.useState(false);

  const { state, actions } = useContext(DataTableContext);
  const {
    columnNames, data, columnsFilterOptions,
  } = state;
  const { cellEdit: _cellEdit } = actions;

  const { state: markdownState, actions: markdownActions } = useContext(MarkdownContext) || {};

  const generateRowId = useCallback(_generateRowId, []);

  const cellEdit = useCallback(parms => {
    _cellEdit(parms);
    setIsAutoSaveChanged(true);
  }, [_cellEdit, setIsAutoSaveChanged]);

  // const changePage = useCallback(function (page) {
  //   dataTableElement.current.changePage(page);
  // }, [dataTableElement]);

  // useDeepEffect(() => {
  //   changePage(0);
  // }, [changePage]);
  
  // Push "isChanged," so app knows when SAVE button is enabled.
  // See also Translatable in markdown-translatable.
  useEffect(() => {
    if (onContentIsDirty) {
      onContentIsDirty(markdownState.isChanged);
    }
  }, [markdownState.isChanged, onContentIsDirty]);

  const togglePreview = useCallback(() => setPreview(!preview), [preview]);

  // _onSave is called by Toolbar; cellEdit is called by DataTable.
  // State (contents) are different at these two times. (cellEdit lags)
  const _onSave = useCallback(() => {
    const savedFile = actions.targetFileSave();
    onSave(savedFile);

    if (markdownActions && markdownActions.setIsChanged) {
      markdownActions.setIsChanged(false);
    }
  }, [actions, onSave, markdownActions]);

  useDeepEffect(() => {
    console.log("useDeepEffect for isAutoSaveChanged");
    if (onEdit && isAutoSaveChanged)
    {
      const savedFile = actions.targetFileSave();
      onEdit(savedFile);
      
      setIsAutoSaveChanged(false);
      // if (markdownActions && markdownActions.setIsAutoSaveChanged) {
      //   markdownActions.setIsAutoSaveChanged(false);
      // }
    }
  }, [isAutoSaveChanged, onEdit, markdownActions, actions]);
  
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
    console.log("scrollToTop()")
    window.scrollTo(0, 0);
    if (dataTableElement && dataTableElement.current) {
      window.scrollTo(0, dataTableElement.current.tableRef.offsetParent.offsetTop);
    }
  }, []);

  const onChangeRowsPerPage = useCallback(() => (rows) => {
    setRowsPerPage(rows);
    scrollToTop();
  }, [scrollToTop]);

  const _onValidate = useCallback(() => {
    // Note 1: the content on-screen, in-memory does NOT include
    // the headers. Since this component has no awareness of 
    // specific resource requirements, the header must be added
    // as first row by the app itself.

    // Note 2: the content on-screen, in-memory contains both
    // source and target data. The target data must be teased
    // out. A new array of rows (target rows) will be created 
    // and this is the data that will be passed to the validation
    // closure passed to this component.
    let targetRows = [];
    if (state && state.data) {
      let rows = state.data;
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let targetRow = [];
        // now each cell has both source and target values, delimited by tab
        for (let j = 0; j < row.length; j++) {
          let values = row[j].split("\t");
          let targetValue = values[1];
          targetValue = targetValue.replaceAll('\\[', '[').replaceAll('\\]', ']');
          targetRow.push(targetValue);
        }
        targetRows.push(targetRow);
      }
    }
    onValidate && onValidate(targetRows);
  }, [onValidate, state]);

  const customToolbar = useCallback(() =>
    <Toolbar preview={preview} onPreview={togglePreview} changed={markdownState.isChanged} onSave={_onSave} onValidate={onValidate ? _onValidate : undefined} />,
    [_onSave, markdownState.isChanged, preview, togglePreview, _onValidate, onValidate]
  );

  useEffect(() => {
    console.log("searchClose, pagination, saveRowId=", 
      searchClose, pagination, saveRowId 
    );

    if( searchClose ) {
      if ( saveRowId ) {
        console.log("Setting pagination to true!");
        setPagination(true);
        console.log("returning to page:", savePage);
        dataTableElement.current.changePage(savePage);
        console.log("Next, in 1s scroll to ", saveRowId);
        setTimeout( 
          () => {
            const element = document.getElementById(saveRowId);
            element.scrollIntoView()
            console.log("Scrolling done.")
          },
          1000
        );
      } else {
        // go ahead and set pagination back on
        setPagination(true);
      }
      setSearchClose(false);
    }
  }, [searchClose, saveRowId]);

  // useEffect(()=>{
  //   console.log("pagination, page", pagination, page)
  // }), [pagination, page]

  const _options = {
    pagination: pagination,
    responsive: 'scrollFullHeight',
    fixedHeaderOptions,
    resizableColumns: false,
    selectableRows: 'none',
    rowHover: false,
    display: 'excluded',
    rowsPerPage,
    rowsPerPageOptions,
    page: page,
    onChangeRowsPerPage,
    onColumnViewChange,
    // onChangePage: scrollToTop,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      scrollToTop();
      console.log("onChangePage() currentPage=", currentPage)
    },
    onSearchOpen:() =>{
      setPagination(false)
    },
    onSearchClose: () =>{
      setSearchClose(true) 
    },

    onRowClick: (rowData) => {
      if ( !pagination ) {
        // do not update rowId when user is doing a search
        // we know a search is being used if pagination is off
        return
      }
      const getRowData = rowData[1].props.tableMeta.rowData
      const [chapter] = getRowData[2].split(delimiters.cell);
      const [verse] = getRowData[3].split(delimiters.cell);
      const [uid] = getRowData[4].split(delimiters.cell);
      const rowId = `header-${chapter}-${verse}-${uid}`;
      setSaveRowId(rowId);
      setSavePage(page);
      // setClickedPage(page);
      // scrollToTop(page);
      console.log("onRowClick()", rowId)
    },
    download: false,
    print: false,
    customToolbar,
    ...options,
  } //), [pagination, customToolbar, onChangeRowsPerPage, onColumnViewChange, options, rowsPerPage, scrollToTop]);

  const _data = useMemo(() => getData({
    data, columnNames, rowHeader,
  }), [columnNames, data, rowHeader]);

  const columns = useMemo(() => getColumns({
    columnNames, columnsFilter, columnsFilterOptions,
    columnsShow, delimiters, rowHeader,
    generateRowId, cellEdit, preview,
  }), [cellEdit, columnNames, columnsFilter, columnsFilterOptions, columnsShow, delimiters, generateRowId, preview, rowHeader]);

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      <DatatableMemo dataTableElement={dataTableElement} columns={columns} data={_data} options={_options} {...props} />
    </MuiThemeProvider>
  );
}

DataTable.propTypes = {
  /** Original DataTable raw string or file contents */
  sourceFile: PropTypes.string.isRequired,
  /** Translated DataTable raw string or file contents */
  targetFile: PropTypes.string.isRequired,
  /** The callback to save the edited targetFile */
  onSave: PropTypes.func.isRequired,
  /** The callback to validate the edited targetFile */
  onValidate: PropTypes.func,
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


/* code graveyard

    if( searchClose ) {
      if (saveRowId){
        const element = document.getElementById(saveRowId);
        if( element ){
          console.log("before scrollIntoView() with element=",element);
          element.scrollIntoView();
          console.log("after scrollIntoView()");
        } else{
          console.log("element not found", saveRowId);
        }
      }
      // console.log()
      setSearchClose(false);
      const spTimeout = 10000;
      setTimeout(
        () => {
          console.log(`Setting pagination to true in ${spTimeout}ms ...`)
          setPagination(true);
          console.log("Pagination now set to true!")
          console.log("returning to page:", savePage);
          dataTableElement.current.changePage(savePage);
          const element = document.getElementById(saveRowId);
          element.scrollIntoView();
        },
        spTimeout
      );
    }

*/
