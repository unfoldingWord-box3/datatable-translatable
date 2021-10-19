import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton , Tooltip } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import {
  ArrowDropDownCircleOutlined,
  AddCircleOutline,
  RemoveCircleOutline,
} from '@material-ui/icons';


import { DataTableContext } from '../datatable/DataTable.context';
import { localString } from '../../core/localStrings';
import AddRow from './AddRow';
import DeleteRow from './DeleteRow';


function RowMenu({
  rowIndex,
  rowData,
  delimiters,
  generateRowId,
}) {
  const classes = useStyles();
  const { state, actions } = useContext(DataTableContext);
  const { columnNames } = state;
  const {
    rowGenerate,
    rowAddBelow,
    rowDelete,
    rowMoveAbove,
    rowMoveBelow,
  } = actions;
  const handleMoveAbove = () => rowMoveAbove({ rowIndex });
  const handleMoveBelow = () => rowMoveBelow({ rowIndex });

  const disableMoveAbove = rowIndex === 0;

  // rowData is the combined array of source and target
  // if target rows have been deleted, then source will contain more
  // rows that the target. For deleted rows, the combined array will 
  // have for each cell just the source data ending in a tab character.
  // Normally the target value for each cell follows the tab character.
  // If that target value is missing, then we are on a deleted row 
  // and we cannot add a row at this location.

  // From the console log, here is a sample:
  // 0: "rowHeader"
  // 1: "JUD\t"
  // 2: "1\t"
  // 3: "2\t"
  // 4: "q2qo\t"
  // 5: "figs-metaphor\t"
  // 6: "ὑμῖν…πληθυνθείη\t"
  // 7: "1\t"
  // 8: "May…be multiplied to you\t"
  // 9: "These ideas are spoken of as if ...

  // Note that there is the constant value "rowHeader" in slot zero.
  // Let's test by splitting index 1; in the sample above there should
  // be two elements, both being the string "JUD" if the row is not
  // deleted.
  // If a row is deleted (as opposed to being a new add/insert), then
  // source side will *not* be empty, but the target side will be empty.
  let cellvals = []
  cellvals = rowData[1].split('\t')
  // is this a deleted row?
  if ( cellvals[0] !== "" && cellvals[1] === "" ) {
    return (
      <>
      </>
    )
  }

  const addRowButton = (
    <Tooltip title={localString('AddRow')} arrow>
      <IconButton className={classes.button}>
        <AddCircleOutline />
      </IconButton>
    </Tooltip>
  );
  const deleteRowButton = (
    <Tooltip title={localString('DeleteRow')} arrow>
      <IconButton className={classes.button}>
        <RemoveCircleOutline />
      </IconButton>
    </Tooltip>
  );

  return (
    <div className={classes.root}>
      <Tooltip title={localString('MoveRowUp')} arrow>
        <div>
          <IconButton className={classes.flipY} disabled={disableMoveAbove} onClick={handleMoveAbove}>
            <ArrowDropDownCircleOutlined />
          </IconButton>
        </div>
      </Tooltip>
      <AddRow
        rowData={rowData}
        rowIndex={rowIndex}
        columnNames={columnNames}
        rowGenerate={rowGenerate}
        rowAddBelow={rowAddBelow}
        button={addRowButton}
        generateRowId={generateRowId}
      />
      <DeleteRow
        rowData={rowData}
        rowIndex={rowIndex}
        columnNames={columnNames}
        rowDelete={rowDelete}
        delimiters={delimiters}
        button={deleteRowButton}
        generateRowId={generateRowId}
      />
      <Tooltip title={localString('MoveRowDown')} arrow>
        <IconButton className={classes.button} onClick={handleMoveBelow}>
          <ArrowDropDownCircleOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  flipY: {
    transform: 'scaleY(-1)',
    padding: '8px',
  },
  button: { padding: '8px' },
}));

export default React.memo(RowMenu, (prevProps, nextProps) => prevProps.rowIndex === nextProps.rowIndex &&
  isEqual(prevProps.rowData, nextProps.rowData) &&
  isEqual(prevProps.delimiters, nextProps.delimiters),
);