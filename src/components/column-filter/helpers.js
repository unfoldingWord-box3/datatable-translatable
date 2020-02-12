import ColumnFilter from './';

export const filterLogic = ({value, filters, delimiters}) => {
  const [source, target] = value.split(delimiters.cell);
  let include = true;
  if (filters.length) {
    const matchAll = filters.includes('All');
    const matchSource = filters.includes(source);
    const matchTarget = filters.includes(target);
    include = (matchAll || matchSource || matchTarget); 
  }
  return !include;
};

export const filterDisplay = ({
  filterList,
  onChange,
  column,
  offset,
  columnsFilterOptions,
  filterIndex,
}) => {
  const optionValues = columnsFilterOptions[filterIndex - offset] || [];
  return ColumnFilter({
    filterList, onChange, filterIndex, column, optionValues
  });
};