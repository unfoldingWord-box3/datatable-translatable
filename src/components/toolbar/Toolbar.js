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

function Toolbar({
  classes,
  preview,
  onPreview,
  changed,
  onSave,
}) {
  const saveDisabled = !changed;

  return (
    <React.Fragment>
      <Tooltip title="Preview">
        <IconButton className={classes.iconButton} onClick={onPreview}>
          { preview ? <PageviewOutlined /> : <Pageview /> }
        </IconButton>
      </Tooltip>
      <Tooltip title="Save">
        <IconButton disabled={saveDisabled} className={classes.iconButton} onClick={onSave}>
          { changed ? <Save /> : <SaveOutlined /> }
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
}

const styles = {
  iconButton: {}
};

export default withStyles(styles, { name: "Toolbar" })(
  Toolbar
);
