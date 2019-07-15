import React, { useState } from 'react';
// import PropTypes from 'prop-types';
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

function DeleteRowMenu({
  rowData,
  rowIndex,
  columnNames,
  rowDelete,
  delimiters,
  button,
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRowDelete = () => {
    rowDelete({rowIndex});
    handleClose();
  };

  const hasRowHeader = rowData[0] === "rowHeader";
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
    ))
    dialogComponent = (
      <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete this row?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          There is no undo feature, this is permanent.
        </DialogContentText>
        <Divider />
        <br/>
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

DeleteRowMenu.propTypes = {
  
};

export default DeleteRowMenu;
