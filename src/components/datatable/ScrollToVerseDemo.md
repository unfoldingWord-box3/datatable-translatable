### Scroll to Verse Demo

This is a rough demo of using the Javascript function "scrollIntoView()". 
Documentation [here](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView).

In this demo, the verse to scroll to is chapter 3, verse 5, where the id is "3:5".
While this is hardcoded, it is easy to change in the source.

*Note:* the reference is added as the id of the component named `component`.

Here are the steps:
- When demo is first shown, pagination is turned on.
- Click the "validate" button.
- An alert is shown because it cannot find the element with id "3:5".
- After the OK on the alert is clicked pagination is turned off.
- Click the button again. 
- Now the verse will scroll to the top of the page.

*Note:* there are two rows referencing chapter 3 verse 5. It will find the first one.

**Problems:** 
1. Unable to programmatically move to a page.
2. Given all references, we could save the references to an array which could be used
to move to page, then the reference (if we could move to the page, see preceding).

```js
import { Typography } from "@material-ui/core";
import _sourceFile from "./mocks/TIT_tq_source";
import targetFile from "./mocks/TIT_tq_target";
import DataTableWrapper from "./DataTable";

function Component() {
  const [sourceFile, setSourceFile] = React.useState(_sourceFile);
  const [savedFile, setSavedFile] = React.useState(targetFile);
  const [pagination, setPagination] = React.useState(true);

  //Uncomment this to test a page change from a new source file
  // setTimeout(() => {
  //   setSourceFile(targetFile);
  // }, 5000)

  const delimiters = { row: "\n", cell: "\t" };

/*
  const options = {
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  };
*/
  const options = { 
    pagination: pagination,
    rowsPerPage: 5, 
  }
  const rowHeader = (rowData, actionsMenu) => {
    const reference = rowData[0].split(delimiters.cell)[0];
    const refid = reference //.replace(':','-');
    const bookId = "ABC";
    const styles = {
      typography: {
        lineHeight: "1.0",
        fontWeight: "bold",
      },
    };
    const component = (
      <>
        <Typography variant="h6" style={styles.typography} id={refid}>
          {`${bookId} ${reference}`}
        </Typography>
        {actionsMenu}
      </>
    );
    return component;
  };
  // Column headers for 7 column format:
  // Reference, ID, Tags, SupportReference, Quote, Occurrence, and Annotation.
  const config = {
    compositeKeyIndices: [0, 1],
    columnsFilter: ["Reference", "ID", "Tags"],
    columnsShowDefault: [
      "SupportReference",
      "Quote",
      "Occurrence",
      "Annotation",
    ],
    rowHeader,
  };

  const onSave = (_savedFile) => {
    setSavedFile(_savedFile);
    alert(_savedFile);
  };

  const onScroll = () => {
    //alert("Validate!")
    const testRefId = '3:5';
    const element = document.getElementById(testRefId);
    if ( element ) {
      element.scrollIntoView();
    } else {
      alert(`Element id not found: ${testRefId}.\nTurning off pagination.\nTry again.`);
      setPagination(false);
    }
  }
  const generateRowId = (rowData) => {
    const reference = rowData[1].split(delimiters.cell)[0];
    const [chapter, verse] = reference.split(":");
    const [uid] = rowData[2].split(delimiters.cell)[1];
    let rowId = `header-${chapter}-${verse}-${uid}`;
    return rowId;
  };

  return (
    <DataTableWrapper
      sourceFile={sourceFile}
      targetFile={savedFile}
      onSave={onSave}
      onValidate={onScroll}
      delimiters={delimiters}
      config={config}
      options={options}
      generateRowId={generateRowId}
    />
  );
}
<Component />;
```
