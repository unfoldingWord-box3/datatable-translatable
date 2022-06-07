import React, { useState, useContext } from 'react';
import isEqual from 'lodash.isequal';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from '@material-ui/core';
import {
} from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { MarkdownContext } from 'markdown-translatable';
import { DataTableContext } from '../datatable/DataTable.context';
import { getRowElement, getOffset } from '../../core/datatable';


function AddRowMenu({
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

  const { state } = useContext(DataTableContext);
  // console.log("Datatable Context state:", state);
  const { actions } = useContext(MarkdownContext);


  const classes = useStyles();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewRow();
  };

  const handleRowAdd = () => {
    rowAddBelow({ rowIndex, rowData: newRow });
    handleClose();
    if (actions && actions.setIsChanged) {
      actions.setIsChanged(true);
    }                  

    setTimeout(() => {
      const rowBelow = getRowElement(generateRowId, rowData, 1);

      if (rowBelow) {
        const top = getOffset(rowBelow).top - rowBelow.offsetHeight;
        document.documentElement.scrollTop = top - 20;
        document.body.scrollTop = top - 20;
      }
    }, 200);
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
        // by default...
        text = (
          <TextField
            key={i}
            defaultValue={newRow[i]}
            label={name}
            margin="normal"
            onChange={(event) => {
              newRow[i] = event.target.value;
            }}
            fullWidth
          />
        );

        if ( state.columnsFilterOptions[i] && state.columnsFilterOptions[i].length > 0 ) {
          text = (
            <Autocomplete
              key={i}
              options={state.columnsFilterOptions[i]}
              value={newRow[i]}
              onChange={(event, newValue) => {
                newRow[i] = newValue;
              }}
              onInputChange={(event, newValue) => {
                newRow[i] = newValue;
              }}
              renderInput={(params) => <TextField {...params} label={name} margin="normal" />}
              freeSolo={true}
            />
          );
        }
      }
      return text;
    });

    dialogComponent = (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        classes={{paper: classes.paper}}
      >
        <DialogTitle id="dialog-title">
          Add Row
        </DialogTitle>
        <DialogContent>
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

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: '500px'
  },
}));

AddRowMenu.propTypes = {};

export default React.memo(AddRowMenu, (prevProps, nextProps) =>
  prevProps.rowIndex === nextProps.rowIndex &&
  isEqual(prevProps.rowData, nextProps.rowData) &&
  isEqual(prevProps.columnNames, nextProps.columnNames),
);
