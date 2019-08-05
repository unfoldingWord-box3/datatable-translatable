import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { BlockEditable } from 'markdown-translatable';

import ActionsMenu from '../actions-menu/ActionsMenu';

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
  columnNames,
  delimiters,
  rowGenerate,
  rowAdd,
  rowDelete,
  rowMoveAbove,
  rowMoveBelow,
}) => {
  const [original, translation] = value.split('\t');
  
  const handleEdit = (markdown) => {
    let _columnIndex = !rowHeader ? columnIndex : columnIndex -1;
    onEdit({rowIndex, columnIndex: _columnIndex, value: markdown});
  };
  
  let component;
  if (value === 'rowHeader' && rowHeader) {
    const actionsMenu = (
      <ActionsMenu
        rowData={rowData}
        rowIndex={rowIndex}
        columnNames={columnNames}
        delimiters={delimiters}
        rowGenerate={rowGenerate}
        rowAdd={rowAdd}
        rowDelete={rowDelete}
        rowMoveAbove={rowMoveAbove}
        rowMoveBelow={rowMoveBelow}
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
    const value = original || '*empty*';
    const originalComponent = (
      <BlockEditable
        style={blockEditableStyle}
        preview={preview}
        markdown={value}
        editable={false}
        inputFilters={inputFilters}
        outputFilters={outputFilters}
      />
    );
    const translationComponent = (
      <BlockEditable
        style={blockEditableStyle}
        preview={preview}
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
  rowHeader: PropTypes.func,
  /** Set html preview mode, false renders raw markdown */
  preview: PropTypes.bool,
};

const blockStyle = {};

const StyleComponent = withStyles(styles)(Cell);
export default StyleComponent;
