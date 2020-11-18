import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
} from '@material-ui/core';
import {
  Pageview,
  PageviewOutlined,
  Save,
  SaveOutlined,
  PlaylistAddCheck,
} from '@material-ui/icons';

function Toolbar({
  preview,
  onPreview,
  changed,
  onSave,
  onValidate,
}) {
  const classes = useStyles();
  const saveDisabled = !changed;

  return (
    <>
      {
        onValidate &&
        <Tooltip title="Validate">
        <IconButton className={classes.iconButton} onClick={onValidate}>
          <PlaylistAddCheck />
        </IconButton>
      </Tooltip>
      }
      <Tooltip title="Preview">
        <IconButton className={classes.iconButton} onClick={onPreview} aria-label="Preview" >
          {preview ? <PageviewOutlined /> : <Pageview />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Save">
        <div className={classes.inlineDiv}>
          <IconButton disabled={saveDisabled} className={classes.iconButton} onClick={onSave} aria-label="Save">
            {changed ? <Save /> : <SaveOutlined />}
          </IconButton>
        </div>
      </Tooltip>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  iconButton: {},
  inlineDiv: { display: 'inline-block' },
}));

Toolbar.propTypes = {
  /** Current state of preview toggle */
  preview: PropTypes.bool,
  /** Handle click of Preview Button  */
  onPreview: PropTypes.func.isRequired,
  /** Has the file changed for Save to be enabled */
  changed: PropTypes.bool,
  /** Handle click of Save Button */
  onSave: PropTypes.func.isRequired,
};

export default Toolbar;
