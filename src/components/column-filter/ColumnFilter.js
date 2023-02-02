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
  const handleChange = (event, newValue) => {
    onChange(newValue, filterIndex, column.name);

    if ( ! newValue ) {
      // I don't know why but this must be done twice to properly clear the filter.
      onChange(newValue, filterIndex, column.name);
    }
  };

  return (
    <>
      <Autocomplete
        value={filterList[filterIndex].length ? filterList[filterIndex].toString() : null}
        disablePortal
        style={{ overflow: 'visible' }}
        options={optionValues}
        onChange={handleChange}
        handleHomeEndKeys
        renderInput={(params) => <TextField
          {...params}
          label={column.name}
          placeholder="All"
          InputLabelProps={{ shrink: true }}
        />}
      />
    </>
  );
}

export default ColumnFilter;