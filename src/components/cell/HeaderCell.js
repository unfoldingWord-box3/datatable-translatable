import React, { memo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import ActionsMenu from '../actions-menu/ActionsMenu';

import useStyles from './styles';

function HeaderCell(props) {
  const {
    tableMeta: {
      rowIndex,
      rowData,
    },
    rowHeader,
    delimiters,
    generateRowId = () => {},
    scrollToIndex,
  } = props;
  const classes = useStyles();
  const rowHeaderComponent = rowHeader(rowData.slice(1), <ActionsMenu
    generateRowId={generateRowId}
    rowData={rowData}
    rowIndex={rowIndex}
    delimiters={delimiters}
    scrollToIndex={scrollToIndex}
  />);
  return (
    <div className={'header-row ' + classes.root} id={generateRowId(rowData)}>
      <div className={classes.rowHeader}>{rowHeaderComponent}</div>
    </div>
  );
};

HeaderCell.propTypes = {
  /** The tableMeta passed from MUIDataTables */
  tableMeta: PropTypes.object.isRequired,
  /** The function to render the rowHeader */
  rowHeader: PropTypes.func,
  /** Set html preview mode, false renders raw markdown */
  generateRowId: PropTypes.func,
  /** Create the row Id for scrolling */
  delimiters: PropTypes.shape({
    /** Delimiters to convert a files into rows "\n" */
    row: PropTypes.string.isRequired,
    /** Delimiters to convert a row into cells "\t" */
    cell: PropTypes.string.isRequired,
  }).isRequired,
  /** Callback to scroll to a row when a new row is added beyond current page. */
  scrollToIndex: PropTypes.func,
};

HeaderCell.defaultProps = {
  delimiters: {
    row: '\n',
    cell: '\t',
  },
};


const shouldReRender = (prevProps, nextProps) => isEqual(prevProps.tableMeta, nextProps.tableMeta);

export default memo(HeaderCell, shouldReRender);
