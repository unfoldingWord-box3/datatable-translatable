import { createMuiTheme } from '@material-ui/core/styles';

export const getMuiTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiTableCell: {
      root: {
        padding: '0',
        textAlign: 'unset',
        display: 'block',
        borderBottom: 'none',
        '&:last-child': {
          paddingRight: 0,
        },
        '&:nth-child(2)': {
          position: 'sticky',
          top: '64px',
          background: 'white',
        }
      },
      body: {
        fontSize: '1em',
      },
    },
    MuiTableRow: {
      root: {
        height: 'unset',
        padding: '0',
        display: 'block',
      }
    },
    MUIDataTable: {
      root: {
      },
      responsiveScroll: {
        maxHeight: 'unset',
        overflowX: 'unset',
        overflowY: 'unset',
      },
      paper: {
        boxShadow: '0px',
      },
    },
    MuiToolbar: {
      root: {
        top: 0,
        position: 'sticky',
        background: 'white',
        zIndex: '100',
      },
    },
    MUIDataTableHeadRow: {
      root: {
        display: 'none',
      },
    },
    MuiTable: {
      root: {
        position: 'sticky',
        bottom: 0,
        background: 'white',
      },
    },
    MuiTableFooter: {
      root: {
        borderTop: '1px solid #ccc',
      },
    },
  }
});