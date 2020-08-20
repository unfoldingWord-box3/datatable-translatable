import React, {memo} from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import isEqual from 'lodash.isequal';

import { BlockEditable } from 'markdown-translatable';

import ActionsMenu from '../actions-menu/ActionsMenu';

import useStyles from './styles';

const inputFilters = [[/<br>/gi, '\n']];
const outputFilters = [[/\n/gi, '<br>']];

function Cell(props) {
 const { 
   value,
   tableMeta: {
    columnData,
    columnIndex,
    rowIndex,
    rowData,
  },
    rowHeader,
    preview,
    onEdit,
    delimiters,
    generateRowId = () => {},
  } = props;
  const classes = useStyles();
  const [original, translation] = value.split(delimiters.cell);
  function handleEdit(markdown){
    let _columnIndex = !rowHeader ? columnIndex : columnIndex - 1;
    onEdit({ rowIndex, columnIndex: _columnIndex, value: markdown });
  };

  let component;
  if (value === 'rowHeader' && rowHeader) {
    const actionsMenu = (
      <ActionsMenu
        generateRowId={generateRowId}
        rowData={rowData}
        rowIndex={rowIndex}
        delimiters={delimiters}
      />
    );
    const rowHeaderComponent = rowHeader(rowData.slice(1), actionsMenu);
    component = (
      <div className={classes.rowHeader}>{rowHeaderComponent}</div>
    );
  } else {
    const subheading = (
      <Typography className={classes.subheading} variant='subtitle2' align='left' color='textSecondary'>
        {columnData.name}
      </Typography>
    );
    const originalValue = original || '*empty*';
    const translationValue = translation || '';
    const originalComponent = (
      <BlockEditable
        preview={preview}
        markdown={originalValue}
        editable={false}
        inputFilters={inputFilters}
        outputFilters={outputFilters}
      />
    );
    component = (
      <div className={classes.row}>
        <div className={classes.original}>
          {subheading}
          {originalComponent}
        </div>
        <div className={classes.translation}>
          {subheading}
          <BlockEditable
            preview={preview}
            markdown={translationValue}
            editable={true}
            inputFilters={inputFilters}
            outputFilters={outputFilters}
            onEdit={handleEdit}
          />
        </div>
      </div>
    );
  }
  const containerClassName = value === 'rowHeader' ? 'header-row ' : `cell-${rowIndex}-${columnIndex} `;
  return (
    <div className={containerClassName + classes.root} id={value === 'rowHeader' && rowHeader ? generateRowId(rowData) : null}>
      {component}
    </div>
  );
};

Cell.propTypes = {
  /** Value of the cell */
  value: PropTypes.string.isRequired,
  /** The tableMeta passed from MUIDataTables */
  tableMeta: PropTypes.object.isRequired,
  /** The function to render the rowHeader */
  rowHeader: PropTypes.func,
  /** Set html preview mode, false renders raw markdown */
  preview: PropTypes.bool,
  /** The delimiters for converting the file into rows/columns */
  delimiters: PropTypes.shape({
    /** Delimiters to convert a files into rows "\n" */
    row: PropTypes.string.isRequired,
    /** Delimiters to convert a row into cells "\t" */
    cell: PropTypes.string.isRequired,
  }).isRequired,
};

Cell.defaultProps = {
  delimiters: {
    row: '\n',
    cell: '\t'
  }
};


const shouldReRender = (prevProps, nextProps) => 
isEqual(prevProps.tableMeta, nextProps.tableMeta) && 
isEqual(prevProps.preview, nextProps.preview) && 
isEqual(prevProps.value, nextProps.value) && 
isEqual(prevProps.page, nextProps.page);

export default memo(Cell, shouldReRender);
