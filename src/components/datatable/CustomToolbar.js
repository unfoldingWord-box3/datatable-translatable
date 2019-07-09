import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
} from '@material-ui/core';
import {
  Pageview,
  PageviewOutlined,
  Save,
  SaveOutlined,
} from '@material-ui/icons';

function CustomToolbar({
  classes,
  preview,
  onPreview,
  canSave,
  onSave,
}) {

  return (
    <React.Fragment>
      <Tooltip title="Preview">
        <IconButton className={classes.iconButton} onClick={onPreview}>
          { preview ? <PageviewOutlined /> : <Pageview /> }
        </IconButton>
      </Tooltip>
      <Tooltip title="Save">
        <IconButton className={classes.iconButton} onClick={onSave}>
          { canSave ? <Save /> : <SaveOutlined /> }
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

const styles = {
  iconButton: {}
};

export default withStyles(styles, { name: "CustomToolbar" })(
  CustomToolbar
);
