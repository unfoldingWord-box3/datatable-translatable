import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { BlockEditable } from 'markdown-translatable';

import styles from './styles';

const inputFilters = [[/<br>/gi, '\n']];
const outputFilters = [[/\n/gi, '<br>']];
const blockEditableStyle = {marginBottom: '-8px'};

const Cell = ({
  classes,
  value,
  tableMeta,
  tableMeta: {
    columnData,
    columnIndex,
    rowIndex,
    rowData,
  },
  rowHeader,
  preview,
  onEdit,
}) => {
  const [original, translation] = value.split('\t');
  
  const handleEdit = (markdown) => {
    let _columnIndex = !rowHeader ?  columnIndex : columnIndex -1;
    onEdit({rowIndex, columnIndex: _columnIndex, value: markdown});
  }
  
  let component;
  if (value === 'rowHeader' && rowHeader) {
    const rowHeaderComponent = rowHeader(rowData.slice(1));
    component = (
      <div className={classes.rowHeader}>{rowHeaderComponent}</div>
    );
  } else {
    const subheading = (
      <Typography className={classes.subheading} variant='subtitle2' align='left' color='textSecondary'>
        {columnData.name}
      </Typography>
    )
    const originalComponent = (
      <BlockEditable
        style={blockEditableStyle}
        raw={!preview}
        markdown={original || '*empty*'}
        editable={false}
        inputFilters={inputFilters}
        outputFilters={outputFilters}
      />
    );
    const translationComponent = (
      <BlockEditable
        style={blockEditableStyle}
        raw={!preview}
        markdown={translation}
        editable={true}
        inputFilters={inputFilters}
        outputFilters={outputFilters}
        onEdit={handleEdit}
      />
    );
    component = (
      <>
        <div className={classes.original} style={blockStyle}>
          {subheading}
          {originalComponent}
        </div>
        <div className={classes.translation} style={blockStyle}>
          {translationComponent}
        </div>
      </>
    );
  }

  return (
    <div className={classes.root}>
      {component}
    </div>
  );
};

Cell.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** Value of the cell */
  value: PropTypes.string.isRequired,
  /** The tableMeta passed from MUIDataTables */
  tableMeta: PropTypes.object.isRequired,
  /** The function to render the rowHeader */
  rowHeader: PropTypes.func.isRequired,
  /** Set html preview mode, false renders raw markdown */
  preview: PropTypes.bool,
};

const blockStyle = {};

const StyleComponent = withStyles(styles)(Cell);
export default StyleComponent;
