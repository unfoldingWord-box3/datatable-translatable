### Basic Example

```js
const value = "Original\tTranslation"
const tableMeta = {
  columnIndex: 0,
  rowIndex: 0,
  columnData: {name: 'Column A'},
  rowData: ['a','b','c','d'],
};

<Cell
  value={value}
  tableMeta={tableMeta}
  preview
/>
```