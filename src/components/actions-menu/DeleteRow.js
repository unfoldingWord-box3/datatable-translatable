import React, { useState, useContext } from 'react';
import isEqual from 'lodash.isequal';
import {
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import {
} from '@material-ui/icons';
import { getRowElement, getOffset } from '../../core/datatable';
import { MarkdownContext } from 'markdown-translatable';

function DeleteRowMenu({
  rowData,
  rowIndex,
  columnNames,
  rowDelete,
  delimiters,
  button,
  generateRowId,
}) {
  const { actions } = useContext(MarkdownContext);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRowDelete = () => {
    let position = -2;

    if (rowIndex === 0) {
      position = -1;
    }

    const rowAbove = getRowElement(generateRowId, rowData, position);
    rowDelete({ rowIndex });
    handleClose();

    if (actions && actions.setIsChanged) {
      actions.setIsChanged(true);
    }

    setTimeout(() => {
      if (rowAbove) {
        const top = getOffset(rowAbove).top;
        document.documentElement.scrollTop = top - 20;
        document.body.scrollTop = top - 20;
      }
    }, 1000);
  };

  const hasRowHeader = rowData[0] === 'rowHeader';
  const offset = hasRowHeader ? 1 : 0;

  let dialogComponent = <div />;

  if (open) {
    const deleteRowComponent = columnNames.map((name, i) => (
      <DialogContentText key={name + i}>
        <strong>{name}:</strong>
        <span>
          {rowData[i + offset].split(delimiters.cell)[1]}
        </span>
      </DialogContentText>
    ));

    dialogComponent = (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete this row?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            There is no undo feature, this is permanent.
          </DialogContentText>
          <Divider />
          <br />
          {deleteRowComponent}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleRowDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      <div onClick={handleOpen}>
        {button}
      </div>
      {dialogComponent}
    </>
  );
}

DeleteRowMenu.propTypes = {};

export default React.memo(DeleteRowMenu, (prevProps, nextProps) =>
  prevProps.rowIndex === nextProps.rowIndex &&
  isEqual(prevProps.rowData, nextProps.rowData) &&
  isEqual(prevProps.columnNames, nextProps.columnNames),
);

