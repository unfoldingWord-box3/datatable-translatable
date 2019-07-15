import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  IconButton,
} from '@material-ui/core';
import {
  ArrowDropDownCircleOutlined,
  AddCircleOutline,
  RemoveCircleOutline,
} from '@material-ui/icons';

import AddRow from './AddRow';
import DeleteRow from './DeleteRow';

function RowMenu({
  classes,
  rowIndex,
  rowData,
  columnNames,
  delimiters,
  rowGenerate,
  rowAdd,
  rowDelete,
  rowMoveAbove,
  rowMoveBelow,
}) {
  const handleMoveAbove = () => rowMoveAbove({rowIndex});
  const handleMoveBelow = () => rowMoveBelow({rowIndex});

  const disableMoveAbove = rowIndex === 0;
  
  const addRowButton = (
    <IconButton className={classes.button}>
      <AddCircleOutline />
    </IconButton>
  );
  const deleteRowButton = (
    <IconButton className={classes.button}>
      <RemoveCircleOutline />
    </IconButton>
  );

  return (
    <div className={classes.root}>
      <IconButton className={classes.flipY} disabled={disableMoveAbove} onClick={handleMoveAbove}>
        <ArrowDropDownCircleOutlined />
      </IconButton>
      <AddRow
        rowData={rowData}
        rowIndex={rowIndex}
        columnNames={columnNames}
        rowGenerate={rowGenerate}
        rowAdd={rowAdd}
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
      <IconButton className={classes.button} onClick={handleMoveBelow}>
        <ArrowDropDownCircleOutlined />
      </IconButton>
    </div>
  );
}

const styles = theme => ({
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
});

const StyleComponent = withStyles(styles)(RowMenu);
export default StyleComponent;
