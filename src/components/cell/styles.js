const styles = theme => ({
  root: {
  },
  original: {
    background: '#eee4',
    display: 'inline-block',
    width: '50%',
  },
  translation: {
    display: 'inline-block',
    width: '50%',
  },
  subheading: {
    margin: '8px 24px -8px 24px',
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
  }
});

export default styles;