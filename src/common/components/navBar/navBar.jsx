import { IoMenu } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { CardMedia, useTheme } from "@mui/material";

import store from "../../../infraestructure/store/store";
import { logout } from "../../../infraestructure/auth/authSlice";

import logoWhite from "src/assets/images/logo-white.png";

const pages = [
  {
    label: "calendário",
    path: "/",
  },
  {
    label: "Membros",
    path: "/membros",
  },
  {
    label: "Salas",
    path: "/salas",
  },
  // {
  //     label: 'financeiro',
  //     path: '/financeiro'
  // },
  {
    label: "configurações",
    path: "/configuracoes",
  },
];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [currentPage, setCurrentPage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = (action) => store.dispatch(action);

  const isMenuOpen = Boolean(anchorEl);
  const menuId = "primary-search-account-menu";

  const isLocalhost = window.location.href.includes("localhost");
  const primaryColor = theme.palette.primary.main;
  const complementaryColor = `#${(0xffffff ^ parseInt(primaryColor.slice(1), 16)).toString(16).padStart(6, "0")}`;

  useEffect(() => {
    setCurrentPage(`/${location.pathname.split("/")[1]}`);
  }, []);

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
    navigate("/login");
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Sair</MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar component={"nav"} sx={{ boxShadow: theme.shadows[1] }}>
        <Container maxWidth="false">
          <Toolbar disableGutters>
            <CardMedia
              component="img"
              sx={{ display: { xs: "none", md: "flex" }, mr: 8, width: 100 }}
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
                  fontSize: "1rem",
                  zIndex: 1000,
                  transformOrigin: "right bottom",
                  cursor: "wait",
                  margin: "20px",
                }}
              >
                Local Environment
              </Typography>
            )}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
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
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => handlePageChange(page)}
                  >
                    <Typography textAlign="center" textTransform={"uppercase"}>
                      {page.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
              }}
            >
              <CardMedia
                component="img"
                sx={{ mr: 2, display: { xs: "flex", md: "none" }, width: 100 }}
                image={logoWhite}
                alt="Logo QHoras"
              />
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                height: "100%",
                display: { xs: "none", md: "flex" },
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.label}
                  onClick={() => handlePageChange(page)}
                  sx={{
                    borderRadius: 0,
                    py: 3,
                    px: 4,
                    color: "white",
                    display: "block",
                    textTransform: "uppercase",
                    fontSize: 13,
                    bgcolor:
                      currentPage === page.path ? "secondary.main" : "inherit",
                    "&:hover": {
                      bgcolor:
                        currentPage === page.path
                          ? "secondary.main"
                          : "inherit",
                    },
                  }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
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
