import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Badge, Link } from '@mui/material';
import * as React from 'react';
import { SearchBar } from './SearchBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import OrderIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSession } from '../contexts/AuthProvider';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface IAppBarProps { }

const CustomAppBar: React.FC<IAppBarProps> = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useSession();
  //const { cart } = useCart();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { onAddToCart } = useEvent();
  const controls = useAnimation();

  useEffect(() => {
    const handleAddToCart = () => {
      controls.start({
        scale: [1, 1.5, 1],
        transition: { duration: 0.5 }
      });
    }

    onAddToCart(handleAddToCart);
  }, [controls, onAddToCart]);

  let timer: NodeJS.Timeout;

  // Gérer l'ouverture du menu
  const handleAccountMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (!isAuthenticated) return;
    clearTimeout(timer);
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  // Gérer la fermeture du menu avec un délai
  const handleAccountMouseLeave = () => {
    timer = setTimeout(() => {
      setAnchorEl(null);
      setIsMenuOpen(false);
    }, 200); // Délai pour éviter la fermeture immédiate
  };

  const MenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleNavigateToAccount = () => {
    if (isAuthenticated) navigate('/account/profil');
    else navigate('/auth');
  };

  const handleLogout = () => {
    logout();
    MenuClose();
    navigate('/');
  }

  const handleNavigateToCart = () => {
    navigate('/cart');
  }

  const handleNavigateToOrders = () => {
    navigate('/account/orders');
  }

  return (
    <>
      <AppBar position="fixed" sx={{ height: 64 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link component={RouterLink} to={'/'} underline='none' color='secondary.main'>E-Store</Link>
          </Typography>

          {/* Barre de recherche */}
          <SearchBar />

          {/* Icône du panier */}
          <IconButton id='cart-icon' color='inherit' onClick={handleNavigateToCart}>
            <Badge badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)} color="error">
              <motion.div animate={controls}>
                <ShoppingCartIcon />
              </motion.div>
            </Badge>
          </IconButton>

          {/* Icône du compte avec menu déroulant */}
          <div
            onMouseEnter={handleAccountMouseEnter}
            onMouseLeave={handleAccountMouseLeave}
          >
            <IconButton
              color="inherit"
              onClick={handleNavigateToAccount}>
              <AccountCircleIcon />
            </IconButton>

            {/* Menu déroulant pour l'icône du compte */}
            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleAccountMouseLeave}
              slotProps={{
                paper: {
                  onMouseEnter: () => clearTimeout(timer),
                  onMouseLeave: handleAccountMouseLeave,
                  style: {
                    width: 250,
                  },
                },
              }}
            >
              <MenuItem onClick={handleNavigateToAccount}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText>Mon compte</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleNavigateToOrders}>
                <ListItemIcon>
                  <OrderIcon />
                </ListItemIcon>
                <ListItemText>Mes Commandes</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>Déconnexion</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default CustomAppBar;