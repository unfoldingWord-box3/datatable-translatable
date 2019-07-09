import React, {useContext} from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from '@material-ui/core';
import {
  MoreVert,
  AddCircle,
  RemoveCircle,
  ArrowDropUp,
  ArrowDropDown,
} from '@material-ui/icons';

import AddDialog from './AddDialog';
import DeleteDialog from './DeleteDialog';

import {FileContext} from '../../File.context';

function RowMenu({
  rowIndex,
  row,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {moveRowUp, moveRowDown} = useContext(FileContext);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleMoveUp = () => {
    moveRowUp({rowIndex});
    handleClose();
  };
  const handleMoveDown = () => {
    moveRowDown({rowIndex});
    handleClose();
  };

  return (
    <>
      <IconButton
        style={{padding: 0}}
        aria-label="Actions"
        aria-owns={open ? 'row-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="row-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleMoveUp}>
          <ListItemIcon><ArrowDropUp /></ListItemIcon>
          <Typography>Move Up</Typography>
        </MenuItem>
        <AddDialog
          row={row}
          rowIndex={rowIndex}
          menuClose={handleClose}
          clickableComponent={
            <MenuItem >
              <ListItemIcon><AddCircle /></ListItemIcon>
              <Typography>Add Row</Typography>
            </MenuItem>
          }
        />
        <DeleteDialog
          row={row}
          rowIndex={rowIndex}
          menuClose={handleClose}
          clickableComponent={
            <MenuItem >
              <ListItemIcon><RemoveCircle /></ListItemIcon>
              <Typography>Delete Row</Typography>
            </MenuItem>
          }
        />
        <MenuItem onClick={handleMoveDown}>
          <ListItemIcon><ArrowDropDown /></ListItemIcon>
          <Typography>Move Down</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default RowMenu;
