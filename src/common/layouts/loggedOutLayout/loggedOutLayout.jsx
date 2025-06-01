import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { CardMedia, useTheme } from '@mui/material';

import logoWhite from 'src/assets/images/logo-white.png';
import { useSelector } from 'react-redux';
import { Trans } from '@lingui/react/macro';

const loggedOutLayout = ({ children }) => {
    const theme = useTheme();

    const isLocalhost = window.location.href.includes('localhost');
    const primaryColor = theme.palette.primary.main;
    const complementaryColor = `#${(0xffffff ^ parseInt(primaryColor.slice(1), 16)).toString(16).padStart(6, '0')}`;

    const business = useSelector((state) => state?.auth);

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default
            }}
        >
            <AppBar component={'nav'} sx={{ boxShadow: theme.shadows[1] }}>
                <Container maxWidth="false">
                    <Toolbar disableGutters>
                        <CardMedia
                            component="img"
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                mr: 8,
                                width: 100,
                                cursor: 'pointer'
                            }}
                            image={logoWhite}
                            alt={Trans`Logo QHoras`}
                            onClick={() => {
                                window.open('https://www.qhoras.com/', '_blank');
                            }}
                        />
                        {isLocalhost && (
                            <Typography
                                sx={{
                                    bottom: 0,
                                    right: 0,
                                    color: complementaryColor,
                                    fontWeight: 900,
                                    fontSize: '1rem',
                                    zIndex: 1000,
                                    transformOrigin: 'right bottom',
                                    cursor: 'wait',
                                    margin: '20px'
                                }}
                            >
                                Local Environment
                            </Typography>
                        )}
                        <Typography
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, width: 100 }}
                                image={logoWhite}
                                alt={Trans`Logo QHoras`}
                                onClick={() => {
                                    window.open('https://www.qhoras.com/', '_blank');
                                }}
                            />
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="false" sx={{ pt: 10, pb: 2 }}>
                {children}
            </Container>
        </div>
    );
};

export default loggedOutLayout;
