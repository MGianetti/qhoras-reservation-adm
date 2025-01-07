import { Container } from '@mui/material';
import { useTheme } from '@mui/styles';

import NavBar from '../../components/navBar/navBar';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import authService from '../../../infraestructure/auth/authService';

const LoggedLayout = ({ children }) => {
    const theme = useTheme();

    const { email } = useSelector((state) => state?.auth.user) || { email: undefined };

    useEffect(() => {
        if (!email) {
            authService.getUser();
        }

        return;
    }, [email]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <NavBar />
            <Container maxWidth="false" sx={{ pt: 10, pb: 2 }}>
                {children}
            </Container>
        </div>
    );
};

export default LoggedLayout;
