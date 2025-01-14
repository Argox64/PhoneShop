import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/system';
import { CartItem } from "@/types/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { removeItemFromCart, updateItemQuantity } from '@/store/slice/cartSlice';
import { RootState } from "@/store/store";

// Style personnalisé pour masquer les spinners
const NoSpinnerTextField = styled(TextField)({
  '& input[type=number]': {
    mozAppearance: 'textfield',
    '&::-webkit-outer-spin-button': {
      webkitAppearance: 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      webkitAppearance: 'none',
      margin: 0,
    },
    textAlign: 'center',
  },
});

const CartItems: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: string }>({});

  const handleQuantityChange = (item: CartItem, value: string) => {
    if (/^\d*$/.test(value)) {
      const quantity = parseInt(value, 10);
      if (quantity > 0) {
        dispatch(updateItemQuantity({ id: item.id, quantity }));
      }
    }
  };

  const handleQuantityBlur = (item: CartItem) => {
    const value = quantityInputs[item.id];
    const quantity = parseInt(value, 10);
    if (quantity > 0) {
      dispatch(updateItemQuantity({ id: item.id, quantity }));
    }
  };

  const handleUpdateQuantity = (item: CartItem, quantity: number) => {
    quantity = item.quantity + quantity;
    dispatch(updateItemQuantity({ id: item.id, quantity }));
  };

  const handleRemoveItem = (item: CartItem) => {
    dispatch(removeItemFromCart(item.id));
  }

  return (
    <>
      <Card sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 } }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'grey.500' }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse our products and add items to your cart.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cartItems.map((item, index) => (
              <Box key={item.id}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <CardMedia
                      component="img"
                      image={item.imageUrl}
                      alt={item.name}
                      sx={{
                        maxHeight: { xs: 150, sm: 200 },
                        maxWidth: { xs: 150, sm: 200 },
                        height: 'auto',
                        width: 'auto',
                        objectFit: 'contain',
                        margin: 'auto'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="text.primary">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <span>Style: </span>Italic Minimal Design
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <span>Size: </span>Small
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <span>Color: </span>Light Blue
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <Typography variant="body1" color="text.primary" sx={{ mb: { xs: 1, sm: 0 } }}>
                        ${item.price.toFixed(2)} <span style={{ textDecoration: 'line-through', color: '#E57373' }}>${item.price.toFixed(2)}</span>
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button size="small" onClick={() => handleUpdateQuantity(item, -1)} disabled={item.quantity <= 1}>-</Button>
                        <NoSpinnerTextField
                          type="number"
                          value={quantityInputs[item.id] || item.quantity.toString()}
                          onChange={(e) => handleQuantityChange(item, e.target.value)}
                          onBlur={() => handleQuantityBlur(item)} // Valider lors de la perte de focus
                          inputProps={{ min: 0 }}
                          sx={{ width: 50 }}
                        />
                        <Button size="small" onClick={() => handleUpdateQuantity(item, 1)}>+</Button>
                      </Box>
                      <Typography variant="body1" fontWeight="bold" color="text.primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveItem(item)}
                        sx={{
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.2)' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Grid>
                </Grid>
                {index < cartItems.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Box>
        )}
      </Card>

      {/*<Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this item from your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>*/}
    </>
  );
};

export default CartItems;
