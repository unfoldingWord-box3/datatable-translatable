import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  TextField,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

function ColumnFilter({
  filterList,
  onChange,
  filterIndex,
  column,
  optionValues,
}) {
  const handleChange = (event) => {
    const value = event.target.value;
    if (value) onChange(value, filterIndex, column.name);
  };

  return (
    <>
    {/* // <FormControl key={filterIndex} fullWidth > */}
      <Autocomplete
      value={optionValues}
      disablePortal
      // id="combo-box-demo"
      freeSolo
      options={optionValues}
      onChange={(event) => {
        if (event) {
          handleChange(event);

          // if (actions && actions.setIsChanged) {
          //   actions.setIsChanged(true);
          // }
        }
      }}
      handleHomeEndKeys
      blurOnSelect
      // sx={{ width: 300 }
      renderInput={(params) => <TextField {...params} label={column.name}
       onBlur={(event) => {
        if ( event ) {
          handleChange(event);
        }
      } } 
      />}
    />
      {/* <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
      <Select
        data-test-id={column.name}
        fullWidth
        value={filterList[filterIndex].length ? filterList[filterIndex].toString() : 'All'}
        name={column.name}
        onChange={handleChange}
        input={<Input name={column.name} id={column.name} />}
      >
        <MenuItem value={'All'} key={0}>
          {'All'}
        </MenuItem>
        {optionValues.map((filterValue, _filterIndex) => (
          <MenuItem value={filterValue} key={_filterIndex + 1} >
            {filterValue != null ? filterValue.toString() : ''}
          </MenuItem>
        ))}
      </Select> */}
    {/* // </FormControl> */}
    </>
  );
};

export default ColumnFilter;