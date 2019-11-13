import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
  },
  original: {
    background: '#eee4',
    display: 'table-cell',
    width: '50%',
  },
  translation: {
    width: '50%',
    display: 'table-cell',
  },
  subheading: {
    margin: '8px 24px 0 24px',
    fontSize: '0.8em',
    fontStyle: 'italic',
  },
  rowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center",
    borderBottom: '1px solid #ccc',
    borderTop: '1px solid #ccc',
    padding: '0 24px',
    position: 'sticky',
    top: 100,
  },
  row: {
    display: 'table',
    width: '100%',
  },
}));

export default useStyles;