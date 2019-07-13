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
import { Typography } from '@material-ui/core';

const value = 'rowHeader';
const cellDelimiter = '\t';
const columnNames=['a','b','c','d'];

const tableMeta = {
  columnIndex: 0,
  rowIndex: 0,
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
  rowHeader: {
    typography: {
      lineHeight: '1.0',
      fontWeight: 'bold',
    },
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: "center",
    },
  },
};

const rowHeader = (rowData, actionsMenu) => (
  <div style={style.rowHeader.root}>
    <Typography variant='h6' style={style.rowHeader.typography}>
      {`${rowData[0].split('\t')[0]}-${rowData[1].split('\t')[0]}`}
    </Typography>
    {actionsMenu}
  </div>
);

const onEdit = (object) => alert(JSON.stringify(object));

<Cell
  value={value}
  tableMeta={tableMeta}
  rowHeader={rowHeader}
  preview
  onEdit={onEdit}
  columnNames={columnNames}
  rowGenerate={()=>{}}
  rowAdd={()=>{}}
  rowDelete={()=>{}}
  rowMoveAbove={()=>{}}
  rowMoveBelow={()=>{}}
/>
```