import React from "react";
import { Card, Typography, Divider, Box } from "@mui/material";
import { useCart } from '@/components/contexts/CartContext';

const Summary: React.FC = () => {
  const { cart } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const discount = 28.00; 
  const shipping = 8.00; 
  const total = (parseFloat(subtotal)).toFixed(2);

  return (
    <Card sx={{ bgcolor: 'background.paper', p: 4, flexGrow: 1 }}>
      <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
        Summary
      </Typography>
      <Divider />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" color="text.primary">
            Subtotal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ${subtotal}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" color="text.primary">
            Discount <span style={{ backgroundColor: '#E0E0E0', padding: '0 8px', borderRadius: 2 }}>STUDENT</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            -${discount.toFixed(2)} (50%)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" color="text.primary">
            Shipping
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ${shipping.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 4 }}>
        <Typography variant="body1" fontWeight="bold" color="text.primary">
          Total
        </Typography>
        <Typography variant="body1" fontWeight="bold" color="text.secondary">
          ${total}
        </Typography>
      </Box>
    </Card>
  );
};

export default Summary;
