import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { BlockEditable } from 'markdown-translatable';

const inputFilters = [[/<br>/gi, '\n']];
const outputFilters = [[/\n/gi, '<br>']];

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
}) => {
  const [original, translation] = value.split('\t');
  let component;

  const blockEditableStyle = {
    marginBottom: '-8px',
  };

  const onEdit = (markdown) => {
    debugger
    // editCell({rowIndex, columnIndex, value: markdown});
  };

  if (value === 'rowHeader' && rowHeader) {
    const rowHeaderComponent = rowHeader(rowData.slice(1));
    component = (
      <div className={classes.rowHeader}>
        {rowHeaderComponent}
      </div>
    );
  } else {
    const subheading = (
      <Typography
        className={classes.subheading}
        variant='subtitle2'
        align='left'
        color='textSecondary'
      >
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
        onEdit={onEdit}
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
  value: PropTypes.string.isRequired,
  tableMeta: PropTypes.object.isRequired,
  rowHeader: PropTypes.func.isRequired,
  preview: PropTypes.bool,
};

const blockStyle = {};

const styles = theme => ({
  root: {
  },
  original: {
    background: '#eee4',
    display: 'inline-block',
    width: '50%',
  },
  translation: {
    display: 'inline-block',
    width: '50%',
  },
  subheading: {
    margin: '8px 24px -8px 24px',
    fontSize: '0.8em',
    fontStyle: 'italic',
  },
  rowHeader: {
    borderBottom: '1px solid #ccc',
    borderTop: '1px solid #ccc',
    padding: '20px 24px 16px 24px',
    position: 'sticky',
    top: 100,
  }
});

const StyleComponent = withStyles(styles)(Cell);
export default StyleComponent;
