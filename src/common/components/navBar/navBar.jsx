import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMenu } from 'react-icons/io5';
import { FaRegCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { LuCalendarDays } from 'react-icons/lu';

import { AppBar, Avatar, Box, Button, CardMedia, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { i18n } from '@lingui/core';
import { defineMessage } from '@lingui/core/macro';

import logoWhite from 'src/assets/images/logo-white.png';
import notification from '../../utils/notification';
import store from '../../../infraestructure/store/store';
import { logout } from '../../../infraestructure/auth/authSlice';

const PAGES = [
    defineMessage({ id: 'nav.calendario', message: 'Calendário', context: 'main nav' }),
    defineMessage({ id: 'nav.membros', message: 'Membros', context: 'main nav' }),
    defineMessage({ id: 'nav.salas', message: 'Salas', context: 'main nav' }),
    defineMessage({ id: 'nav.configuracoes', message: 'Configurações', context: 'main nav' })
];

function NavBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentPage, setCurrentPage] = useState('');

    const { role, businessId } = useSelector((s) => s?.auth?.user) || {};
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const dispatch = (a) => store.dispatch(a);

    useEffect(() => {
        setCurrentPage(`/${location.pathname.split('/')[1]}`);
    }, [location.pathname]);

    const handlePageChange = (path) => {
        navigate(path);
        setCurrentPage(path);
        setAnchorElNav(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        setAnchorEl(null);
        navigate('/login');
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/calendario?business=${businessId}`;
        navigator.clipboard
            .writeText(url)
            .then(() =>
                notification({
                    message: i18n._(defineMessage({ id: 'nav.linkCopied', message: 'Link copied successfully!' })),
                    type: 'success'
                })
            )
            .catch(() =>
                notification({
                    message: i18n._(defineMessage({ id: 'nav.linkCopyError', message: 'Error copying link!' })),
                    type: 'error'
                })
            );
    };

    const LOCAL = window.location.href.includes('localhost');
    const complementaryColor = `#${(0xffffff ^ parseInt(theme.palette.primary.main.slice(1), 16)).toString(16).padStart(6, '0')}`;

    return (
        <>
            <AppBar component="nav" sx={{ boxShadow: theme.shadows[1] }}>
                <Container maxWidth={false}>
                    <Toolbar disableGutters>
                        {/* ------------- logo (desktop) */}
                        <CardMedia component="img" sx={{ display: { xs: 'none', md: 'flex' }, mr: 8, width: 100 }} image={logoWhite} alt="QHoras logo" />

                        {/* ------------- mobile menu button */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="large" aria-label="open navigation menu" onClick={(e) => setAnchorElNav(e.currentTarget)} color="inherit">
                                <IoMenu />
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                open={Boolean(anchorElNav)}
                                onClose={() => setAnchorElNav(null)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                {PAGES.map((desc, idx) => {
                                    if (role !== 'ADMINISTRATOR' && desc.id === 'nav.configuracoes') return null;
                                    const path = idx === 0 ? '/' : `/${i18n._(desc).toLowerCase()}`;
                                    return (
                                        <MenuItem key={desc.id} onClick={() => handlePageChange(path)}>
                                            <Typography textTransform="uppercase">{i18n._(desc)}</Typography>
                                        </MenuItem>
                                    );
                                })}
                            </Menu>
                        </Box>

                        {/* ------------- logo (mobile) */}
                        <CardMedia component="img" sx={{ display: { xs: 'flex', md: 'none' }, width: 100, mr: 2 }} image={logoWhite} alt="QHoras logo" />

                        {/* ------------- desktop nav buttons */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {PAGES.map((desc, idx) => {
                                if (role !== 'ADMINISTRATOR' && desc.id === 'nav.configuracoes') return null;
                                const path = idx === 0 ? '/' : `/${i18n._(desc).toLowerCase()}`;
                                return (
                                    <Button
                                        key={desc.id}
                                        onClick={() => handlePageChange(path)}
                                        sx={{
                                            borderRadius: 0,
                                            px: 4,
                                            py: 3,
                                            fontSize: 13,
                                            textTransform: 'uppercase',
                                            color: 'white',
                                            bgcolor: currentPage === path ? 'secondary.main' : 'inherit',
                                            '&:hover': { bgcolor: currentPage === path ? 'secondary.main' : 'inherit' }
                                        }}
                                    >
                                        {i18n._(desc)}
                                    </Button>
                                );
                            })}
                        </Box>

                        {/* ------------- right-side actions */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {!isMobile && (
                                <Tooltip title={i18n._(defineMessage({ id: 'tooltip.openCalendar', message: 'Open calendar' }))} arrow>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<LuCalendarDays size={20} />}
                                        endIcon={<FaExternalLinkAlt size={12} />}
                                        onClick={() => window.open(`/calendario?business=${businessId}`, '_blank')}
                                        sx={{ textTransform: 'none', borderRadius: 2, px: 2, py: 1 }}
                                    >
                                        {i18n._(defineMessage({ id: 'nav.calendar', message: 'Calendário' }))}
                                    </Button>
                                </Tooltip>
                            )}

                            <Tooltip title={i18n._(defineMessage({ id: 'tooltip.copyCalendarLink', message: 'Copy link to calendar' }))} arrow>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<FaRegCopy size={16} />}
                                    onClick={handleCopyLink}
                                    sx={{ textTransform: 'none', borderRadius: 2, px: 2, py: 1 }}
                                >
                                    {isMobile
                                        ? i18n._(defineMessage({ id: 'nav.linkShort', message: 'Link' }))
                                        : i18n._(defineMessage({ id: 'nav.copyLinkButton', message: 'Copy link' }))}
                                </Button>
                            </Tooltip>

                            <IconButton size="large" edge="end" aria-label="profile menu" onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
                                <Avatar alt="avatar" />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* ------------- profile dropdown */}
            <Menu anchorEl={anchorEl} id="profile-menu" open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={handleLogout}>{i18n._(defineMessage({ id: 'nav.logout', message: 'Logout' }))}</MenuItem>
            </Menu>
        </>
    );
}

export default NavBar;
