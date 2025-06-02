import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IoMenu } from 'react-icons/io5';
import { FaRegCopy } from 'react-icons/fa';
import { LuCalendarDays } from 'react-icons/lu';
import { FaExternalLinkAlt } from 'react-icons/fa';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CardMedia, useTheme, useMediaQuery } from '@mui/material';
import { Trans } from '@lingui/react/macro';

import notification from '../../utils/notification';
import store from '../../../infraestructure/store/store';
import { logout } from '../../../infraestructure/auth/authSlice';

import logoWhite from 'src/assets/images/logo-white.png';
import moneyMask from '../../../common/masks/moneyMask';

const pages = [
  { id: 'nav.calendario', label: 'calendário', path: '/' },
  { id: 'nav.membros', label: 'Membros', path: '/membros' },
  { id: 'nav.salas', label: 'Salas', path: '/salas' },
  { id: 'nav.configuracoes', label: 'configurações', path: '/configuracoes' },
];

function createData(name, statusBoolean, priceNumber, capacityNumber) {
  const price = moneyMask(priceNumber);
  const capacity = `${capacityNumber} ` + (
    <Trans id="table.pessoas">pessoas</Trans>
  );
  const status = statusBoolean ? (
    <Trans id="table.statusAtivo">Ativo</Trans>
  ) : (
    <Trans id="table.statusInativo">Inativo</Trans>
  );
  return { name, status, price, capacity };
}

export const rows = (roomList = []) => {
  return roomList.map((room) =>
    createData(room.name, room.status, room.price, room.capacity)
  );
};

function NavBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [currentPage, setCurrentPage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const { role, businessId } = useSelector((state) => state?.auth?.user) || {};

  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();
  const dispatch = (action) => store.dispatch(action);

  const isMenuOpen = Boolean(anchorEl);
  const menuId = 'primary-search-account-menu';

  const isLocalhost = window.location.href.includes('localhost');
  const primaryColor = theme.palette.primary.main;
  const complementaryColor = `#${(0xffffff ^ parseInt(primaryColor.slice(1), 16))
    .toString(16)
    .padStart(6, '0')}`;

  useEffect(() => {
    setCurrentPage(`/${location.pathname.split('/')[1]}`);
  }, [location.pathname]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageChange = (page) => {
    navigate(page.path);
    setCurrentPage(page.path);
    handleCloseNavMenu();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGoToCalendar = () => {
    window.open(`/calendario?business=${businessId}`, '_blank');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/calendario?business=${businessId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        notification({
          message: <Trans id="nav.linkCopied">Link copiado com sucesso!</Trans>,
          type: 'success',
        });
      })
      .catch(() => {
        notification({
          message: <Trans id="nav.linkCopyError">Erro ao copiar link!</Trans>,
          type: 'error',
        });
      });
  };

  const renderMenu = (
    <Menu anchorEl={anchorEl} id={menuId} keepMounted open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem onClick={handleLogout}>
        <Typography>
          <Trans id="nav.logout">Sair</Trans>
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar component={'nav'} sx={{ boxShadow: theme.shadows[1] }}>
        <Container maxWidth="false">
          <Toolbar disableGutters>
            <CardMedia
              component="img"
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 8, width: 100 }}
              image={logoWhite}
              alt="Logo QHoras"
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
                  margin: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                Local Environment
              </Typography>
            )}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="open navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <IoMenu />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => {
                  if (role !== 'ADMINISTRATOR' && page.id === 'nav.configuracoes') return null;
                  return (
                    <MenuItem key={page.id} onClick={() => handlePageChange(page)}>
                      <Typography textAlign="center" textTransform="uppercase">
                        <Trans id={page.id}>{page.label}</Trans>
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
            <Typography
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
              }}
            >
              <CardMedia
                component="img"
                sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, width: 100 }}
                image={logoWhite}
                alt="Logo QHoras"
              />
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                height: '100%',
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {pages.map((page) => {
                if (role !== 'ADMINISTRATOR' && page.id === 'nav.configuracoes') return null;

                return (
                  <Button
                    key={page.id}
                    onClick={() => handlePageChange(page)}
                    sx={{
                      borderRadius: 0,
                      py: 3,
                      px: 4,
                      color: 'white',
                      display: 'block',
                      textTransform: 'uppercase',
                      fontSize: 13,
                      bgcolor: currentPage === page.path ? 'secondary.main' : 'inherit',
                      '&:hover': {
                        bgcolor: currentPage === page.path ? 'secondary.main' : 'inherit',
                      },
                    }}
                  >
                    <Trans id={page.id}>{page.label}</Trans>
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {!isMobile && (
                  <Tooltip title={<Trans id="tooltip.openCalendar">Abrir calendário</Trans>} arrow>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<LuCalendarDays size={20} />}
                      endIcon={<FaExternalLinkAlt size={12} />}
                      onClick={handleGoToCalendar}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          bgcolor: 'secondary.dark',
                        },
                      }}
                    >
                      <Trans id="nav.calendar">Calendário</Trans>
                    </Button>
                  </Tooltip>
                )}

                <Tooltip title={<Trans id="tooltip.copyCalendarLink">Copiar link para o calendário</Trans>} arrow>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<FaRegCopy size={16} />}
                    onClick={handleCopyLink}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      borderColor: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        borderColor: 'common.white',
                        bgcolor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    {isMobile ? <Trans id="nav.linkShort">Link</Trans> : <Trans id="nav.copyLinkButton">Copiar link</Trans>}
                  </Button>
                </Tooltip>
              </Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar alt="Remy Sharp" />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {renderMenu}
    </>
  );
}

export default NavBar;
