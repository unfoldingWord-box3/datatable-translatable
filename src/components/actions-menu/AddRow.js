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
  DialogContentText,
  TextField,
} from '@material-ui/core';
import {
} from '@material-ui/icons';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { getRowElement, getOffset } from '../../core/datatable';
import { DataTableContext } from '../datatable/DataTable.context';

const filter = createFilterOptions();

function AddRowMenu({
  rowData,
  rowIndex,
  columnNames,
  dropdownColumn = 4,
  rowGenerate,
  rowAddBelow,
  button,
  generateRowId,
}) {
  const [open, setOpen] = useState(false);
  const [newRow, setNewRow] = useState();
  const [value, setValue] = useState('');

  const { state } = useContext(DataTableContext);
  // console.log("Datatable Context state:", state);

  const classes = useStyles();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewRow();
  };

  const handleRowAdd = () => {
    newRow[dropdownColumn] = value.name ? value.name : value;
    rowAddBelow({ rowIndex, rowData: newRow });
    handleClose();
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
          <DialogContentText key={name + i}>
            <strong>{name}:</strong>
            {' ' + newRow[i]}
          </DialogContentText>
        );
        if ( i === dropdownColumn && state.columnsFilterOptions[i] ) {
          if ( state.columnsFilterOptions[i].length > 0 ) {
            const defaultProps = {
              options: state.columnsFilterOptions[i].map(
                (value, index) => {
                  return { id: index, name: value}
                }
              ),
              getOptionLabel: (option) => option.name ? option.name : value,
              getOptionSelected: (option, val) => {
                return option.name === val.name;
              }
            };
            text = (
              <Autocomplete
                {...defaultProps}
                id="spt-ref"
                value={value}
                onChange={(event, newValue) => {
                  // console.log("Autocomplete() onchange() setValue:", newValue)
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} label={state.columnNames[i]} margin="normal" />}
                freeSolo={true}
                onBlur
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  // Suggest the creation of a new value
                  if (params.inputValue !== '') {
                    filtered.push({
                      id: params.id,
                      name: `${params.inputValue}`,
                    });
                  }
          
                  return filtered;
                }}
              />
            );        
          }
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
