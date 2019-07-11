import React from 'react';
import PropTypes from 'prop-types';
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
        <div className={classes.inlineDiv}>
          <IconButton disabled={saveDisabled} className={classes.iconButton} onClick={onSave}>
            { changed ? <Save /> : <SaveOutlined /> }
          </IconButton>
        </div>
      </Tooltip>
    </React.Fragment>
  );
}

const styles = {
  iconButton: {},
  inlineDiv: {
    display: 'inline-block',
  },
};

Toolbar.propTypes = {
  /** @ignore */
  classes: PropTypes.object.isRequired,
  /** Current state of preview toggle */
  preview: PropTypes.bool,
  /** Handle click of Preview Button  */
  onPreview: PropTypes.func.isRequired,
  /** Has the file changed for Save to be enabled */
  changed: PropTypes.bool,
  /** Handle click of Save Button */
  onSave: PropTypes.func.isRequired,
}

export default withStyles(styles, { name: "Toolbar" })(
  Toolbar
);
