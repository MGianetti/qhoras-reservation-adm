import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import App from './App';
import './main.css';
import { qHorasTheme } from './theme/theme';
import store from './infraestructure/store/store';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={qHorasTheme}>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <App />
            </SnackbarProvider>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
