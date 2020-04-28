import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
} from '@material-ui/core';
import {
  ArrowDropDownCircleOutlined,
  AddCircleOutline,
  RemoveCircleOutline,
} from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';

import AddRow from './AddRow';
import DeleteRow from './DeleteRow';

import { DataTableContext } from '../datatable/DataTable.context';
import { localString } from '../../core/localStrings';

function RowMenu({
  rowIndex,
  rowData,
  delimiters,
}) {
  const classes = useStyles();
  const { state, actions } = useContext(DataTableContext);
  const {
    columnNames,
  } = state;
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
      <IconButton className={classes.flipY} disabled={disableMoveAbove} onClick={handleMoveAbove}>
        <ArrowDropDownCircleOutlined />
      </IconButton>
      </Tooltip>
      <AddRow
        rowData={rowData}
        rowIndex={rowIndex}
        columnNames={columnNames}
        rowGenerate={rowGenerate}
        rowAddBelow={rowAddBelow}
        button={addRowButton}
      />
      <DeleteRow
        rowData={rowData}
        rowIndex={rowIndex}
        columnNames={columnNames}
        rowDelete={rowDelete}
        delimiters={delimiters}
        button={deleteRowButton}
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
    justifyContent: 'flex-end'
  },
  flipY: {
    transform: 'scaleY(-1)',
    padding: '8px',
  },
  button: {
    padding: '8px',
  },
}));

export default RowMenu;
