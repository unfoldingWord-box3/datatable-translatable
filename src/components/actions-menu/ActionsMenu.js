import React from 'react';
import {
  IconButton,
} from '@material-ui/core';
import {
  ArrowDropDownCircleOutlined,
} from '@material-ui/icons';

import AddRow from './AddRow';
import DeleteRow from './DeleteRow';

function RowMenu({
  rowIndex,
  rowData,
  columnNames,
  delimiters,
  rowGenerate,
  rowAdd,
  rowDelete,
  rowMoveAbove,
  rowMoveBelow,
}) {
  const handleMoveAbove = () => rowMoveAbove({rowIndex});
  const handleMoveBelow = () => rowMoveBelow({rowIndex});
  const style = { display: 'flex', justifyContent: 'flex-end' };
  const styleFlipY = { transform: 'scaleY(-1)' };

  const disableMoveAbove = rowIndex === 0;

  return (
    <div style={style}>
      <IconButton style={styleFlipY} disabled={disableMoveAbove} onClick={handleMoveAbove}>
        <ArrowDropDownCircleOutlined />
      </IconButton>
      <AddRow
        rowData={rowData}
        rowIndex={rowIndex}
        columnNames={columnNames}
        rowGenerate={rowGenerate}
        rowAdd={rowAdd}
      />
      <DeleteRow
        rowData={rowData}
        rowIndex={rowIndex}
        columnNames={columnNames}
        rowDelete={rowDelete}
        delimiters={delimiters}
      />
      <IconButton onClick={handleMoveBelow}>
        <ArrowDropDownCircleOutlined />
      </IconButton>
    </div>
  );
}

export default RowMenu;
