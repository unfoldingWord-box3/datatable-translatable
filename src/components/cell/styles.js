import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  'root': {
    '&.show': { animation: `$myEffect 2000ms ${theme.transitions.easing.easeInOut}` },
  },
  '@keyframes myEffect': {
    '0%': { background: 'transparent' },
    '25%': { background: theme.palette.background.pulsing },
    '50%': { background: 'transparent' },
    '75%': { background: theme.palette.background.pulsing },
    '100%': { background: 'transparent' },
  },
  'original': props => ({
    padding: '0 8px',
    background: '#eee4',
    display: 'table-cell',
    width: '50%',
    fontFamily: props.originalFontFamily || 'inherit',
  }),
  'translation': props => ({
    padding: '0 15px',
    background: '#eee4',
    display: 'table-cell',
    width: '50%',
    fontFamily: props.translationFontFamily || 'inherit',
  }),
  'subheading': {
    fontSize: '0.8em',
    fontStyle: 'italic',
  },
  'rowHeader': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    borderTop: '1px solid #ccc',
    padding: '0 24px',
    position: 'sticky',
    top: 100,
  },
  'row': {
    display: 'table',
    width: '100%',
    '&.show': { animation: `$myEffect 2000ms ${theme.transitions.easing.easeInOut}` },
  },
  'gridOriginal': {
    marginTop:'-15px',
    marginLeft:'2px',
    padding: '15px 10px 0px 28px',
  },
  'divRow': {
    'display': 'table-row',
    'width': '100%',
    '& .editableWrapper': {
      marginTop:'-1em',
      marginLeft:'2px',
      display: 'table-cell',
      width:'100%',
    },
  },
  'divSubheading': {
    display: 'table-cell',
    minWidth: '7em',
  },
  'divOccurrence': {
    'marginTop': '1em',
    '& .editableWrapper': {
      // marginTop: '1em'
    },
  },
  'divTranslation': { 'marginTop': '1em' },
}));

export default useStyles;
