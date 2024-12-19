import React, { useState, useContext, useMemo } from 'react';
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
import { getRowElement, getOffset, generateRandomUID } from '../../core/datatable';


function AddRowMenu({
  rowData,
  rowIndex,
  columnNames,
  rowGenerate,
  rowAddBelow,
  button,
  generateRowId,
  scrollToIndex,
}) {
  const [open, setOpen] = useState(false);
  const [newRow, setNewRow] = useState();
  const { state } = useContext(DataTableContext);
  // console.log('Datatable Context state:', state);
  const { data, newRowDefaultValues } = state;
  const { actions } = useContext(MarkdownContext);


  const classes = useStyles();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewRow();
  };

  let foundIDIndex = useMemo(() => {
    return columnNames.findIndex((row) => row.toUpperCase() === 'ID');
  },[columnNames]);

  const allIDs = useMemo(() => {
    return data?.map((row) =>{
      const [sourceID, targetID] = row[foundIDIndex]?.split('\t');
      return sourceID || targetID;
    });
  },[data, foundIDIndex]);

  const handleRowAdd = () => {
    let newRowData = [...newRow];
    let newID = newRowData[foundIDIndex].replace(/\s/g,'');

    if (foundIDIndex !== -1) {
      newRowData[foundIDIndex] = newID;
    }

    if (newRowData[foundIDIndex] === '') {
      const newID = generateRandomUID(allIDs);
      newRowData[foundIDIndex] = newID;
      rowAddBelow({ rowIndex, rowData: newRowData });
    } else {
      rowAddBelow({ rowIndex, rowData: newRowData });
    }
    handleClose();

    if (actions && actions.setIsChanged) {
      actions.setIsChanged(true);
    }

    scrollToIndex(rowIndex + 1);

    setTimeout(() => {
      const rowBelow = getRowElement(generateRowId, rowData, 1);

      if (rowBelow) {
        console.log('Row added2', rowBelow);
        rowBelow.classList.add('show');
        const parentRow = rowBelow.closest('tr');

        if ( parentRow ) {
          const allRows = parentRow.querySelectorAll('td > div > div > div');

          allRows.forEach((rowCell) => {
            rowCell.classList.add('show');
          });

          const firstEditableContent = parentRow.querySelector('[contenteditable="true"]');

          if ( firstEditableContent ) {
            setTimeout(() => {
              // Use setTimeout because https://stackoverflow.com/a/37162116/545378
              firstEditableContent.focus();
            });
          }
        }

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
            data-test-id={`add-row-input-${name}`}
            fullWidth
          />
        );

        if (state.columnsFilterOptions[i] && state.columnsFilterOptions[i].length > 0) {
          if (typeof newRowDefaultValues?.[name] === 'string') {
            newRow[i] = newRowDefaultValues[name];
          }
          text = (
            <Autocomplete
              key={i}
              options={state.columnsFilterOptions[i]}
              value={newRow[i]}
              onChange={(event, newValue) => {
                newRow[i] = newValue === null ? '' : newValue;
              }}
              onInputChange={(event, newValue) => {
                newRow[i] = newValue;
              }}
              data-test-id={`add-row-autocomplete-${name}`}
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
