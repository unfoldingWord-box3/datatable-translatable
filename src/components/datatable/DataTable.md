
```js
  import { Typography } from '@material-ui/core';
  import original from './mocks/en_tn_57-TIT';
  import translation from './mocks/tn_57-TIT';
  const rowHeader = (rowData) => {
    const book = rowData[0].split('\t')[0];
    const chapter = rowData[1].split('\t')[0];
    const verse = rowData[2].split('\t')[0];
    const style = {
      lineHeight: '1.0',
      fontWeight: 'bold',
    };
    const component = (
      <Typography variant='h6' style={style}>
        {`${book} ${chapter}:${verse}`}
      </Typography>
    );
    return component;
  };
  const delimiters = { row: '\n', cell: '\t'};
  const config = {
    compositeKeyIndices: [0,1,2,3],
    columnsFilter: [1,2,4],
    columnsShowDefault: [4,5,7,8],
    rowHeader,
  };
  const options = {
    page: 8,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

  <DataTable
    original={original}
    translation={translation}
    delimiters={delimiters}
    config={config}
    options={options}
  />
```