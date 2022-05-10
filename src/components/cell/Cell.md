### Basic Example

Note: Due to the internal's correlation of source and target datatables, all cells must have both values joined by the cell delimiter.

```js
const value = "Original\tTranslation"
const cellDelimiter = '\t';

const tableMeta = {
  columnIndex: 0,
  rowIndex: 0,
  columnData: {name: 'Column A'},
  rowData: [
    value,
    ['a','a'].join(cellDelimiter),
    ['b','b'].join(cellDelimiter),
    ['c','c'].join(cellDelimiter),
    ['d','d'].join(cellDelimiter),
  ],
};

const onEdit = (object) => alert(JSON.stringify(object));

<Cell
  value={value}
  tableMeta={tableMeta}
  preview
  onEdit={onEdit}
/>
```

### Row Header Example

Note: Due to the internal's correlation of source and target datatables, all cells will have both values joined by the cell delimiter.

```js
import { Typography } from '@mui/material';
import { DataTableContextProvider } from '../datatable/DataTable.context';

function Component() {
  const [rowIndex, setRowIndex] = React.useState(0);

  const value = 'rowHeader';
  const cellDelimiter = '\t';
  const columnNames=['a','b','c','d'];

  const tableMeta = {
    columnIndex: 0,
    rowIndex,
    columnData: {name: 'rowHeader'},
    rowData: [
      value,
      ['a','a'].join(cellDelimiter),
      ['b','b'].join(cellDelimiter),
      ['c','c'].join(cellDelimiter),
      ['d','d'].join(cellDelimiter),
    ],
  };

  const style = {
    typography: {
      lineHeight: '1.0',
      fontWeight: 'bold',
    },
  };

  const rowHeader = (rowData, actionsMenu) => (
    <>
      <Typography variant='h6' style={style.typography}>
        {`${rowData[0].split('\t')[0]}-${rowData[1].split('\t')[0]}`}
      </Typography>
      {actionsMenu}
    </>
  );

  const onEdit = (object) => alert(JSON.stringify(object));

  return (
    <Cell
      value={value}
      tableMeta={tableMeta}
      rowHeader={rowHeader}
      preview
      onEdit={onEdit}
      columnNames={columnNames}
    />
  );
};
// TODO: finish example to make Cell render
<DataTableContextProvider config={{}}>
  <Component />
</DataTableContextProvider>
```
