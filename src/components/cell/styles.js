import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {},
  original: {
    background: '#dadde3',
    display: 'table-cell',
    width: '50%',
  },
  translation: {
    width: '50%',
    display: 'table-cell',
  },
  subheading: {
    color:'#570553',
    margin: '2px 0 0 8px',
    fontSize: '0.9em',
    fontStyle: 'italic',
  },
  
  rowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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