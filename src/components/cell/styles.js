import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {},
  original: {
    padding: '0 8px',
    background: '#eee4',
    display: 'table-cell',
    width: '50%',
  },
  translation: {
    padding: '0 15px',
    background: '#eee4',
    display: 'table-cell',
    width: '50%',
  },
  subheading: {
    fontSize: '0.8em',
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
  gridOriginal: {
    marginTop:'-15px',
    marginLeft:'2px',
    padding: '15px 10px 0px 28px'
  },
  divRow: {
    display: 'table-row',
    width: '100%',
    '& .editableWrapper': {
      marginTop:'-1em',
      marginLeft:'2px',
      display: 'table-cell',
      width:'100%'
    }
  },
  divSubheading: {
    display: 'table-cell', 
    minWidth: '7em'
  },
  divOccurrence: {
    marginTop: '1em',
    '& .editableWrapper': {
      // marginTop: '1em'
    }
  },
  divTranslation: {
    marginTop: '1em'
  }
}));

export default useStyles;