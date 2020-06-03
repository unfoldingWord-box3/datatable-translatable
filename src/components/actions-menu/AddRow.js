import React, { useState } from 'react';
import $ from 'jquery';
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
import { getRowElement } from '../../core/datatable';

function AddRowMenu({
  classes,
  rowData,
  rowIndex,
  columnNames,
  rowGenerate,
  rowAddBelow,
  button,
  generateRowId,
}) {
  const [open, setOpen] = useState(false);
  const [newRow, setNewRow] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRowAdd = () => {
    rowAddBelow({ rowIndex, rowData: newRow });
    handleClose();
    setTimeout(() => {
      const rowBelow = getRowElement(generateRowId, rowData, 1);
      if (rowBelow) {
        $([document.documentElement, document.body]).animate({
          scrollTop: $(rowBelow).offset().top - $(rowBelow).height() - 20
      }, 500);
      }
    }, 200)
  };

  let dialogComponent = <div />;
  if (open) {
    const newRowComponent = columnNames.map((name, i) => {
      let text = '';
      if (!newRow) {
        const _newRow = rowGenerate({ rowIndex });
        setNewRow(_newRow);
        return text;
      } else {
        text = (
          <DialogContentText key={name + i}>
            <strong>{name}:</strong>
            {" " + newRow[i]}
          </DialogContentText>
        );
      }
      return text;
    });
    dialogComponent = (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">
          Add Row
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Columns with 50%+ unique values will not be duplicated.
          </DialogContentText>
          <Divider />
          <br />
          {newRowComponent}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={handleRowAdd} color="secondary">
            Add
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

AddRowMenu.propTypes = {

};

export default AddRowMenu;
