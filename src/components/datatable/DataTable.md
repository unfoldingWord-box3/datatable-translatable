
```js
import { Typography } from '@material-ui/core';
import sourceFile from './mocks/en_tn_57-TIT';
import targetFile from './mocks/tn_57-TIT';

function Component() {
  const [savedFile, setSavedFile] = React.useState(targetFile);

  const delimiters = { row: '\n', cell: '\t'};

  const options = {
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  };

  const rowHeader = (rowData, actionsMenu) => {
    const book = rowData[0].split(delimiters.cell).find((value) => value);
    const chapter = rowData[1].split(delimiters.cell).find((value) => value);
    const verse = rowData[2].split(delimiters.cell).find((value) => value);
    const styles = {
      typography: {
        lineHeight: '1.0',
        fontWeight: 'bold',
      },
    };
    const component = (
      <>
        <Typography variant='h6' style={styles.typography}>
          {`${book} ${chapter}:${verse}`}
        </Typography>
        {actionsMenu}
      </>
    );
    return component;
  };

  const config = {
    compositeKeyIndices: [0,1,2,3],
    columnsFilter: ['Chapter','SupportReference'],
    columnsShowDefault: ['SupportReference','OrigQuote','Occurrence','OccurrenceNote'],
    rowHeader,
  };

  const onSave = (_savedFile) => {
    setSavedFile(_savedFile);
    alert(_savedFile);
  };

  return (
    <DataTable
      sourceFile={sourceFile}
      targetFile={savedFile}
      onSave={onSave}
      delimiters={delimiters}
      config={config}
      options={options}
    />
  );
}
<Component />
```