import React from 'react';
import { TextField } from '@material-ui/core';
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
      <Autocomplete
      value={filterList[filterIndex].length ? filterList[filterIndex].toString() : 'All'}
      disablePortal
      style={{overflow: 'visible'}}
      options={optionValues}
      onChange={(event,newValue) => {
        onChange(newValue, filterIndex, column.name);
      }}
      handleHomeEndKeys
      renderInput={(params) => <TextField {...params} label={column.name}
      />}
    />
    </>
  );
};

export default ColumnFilter;