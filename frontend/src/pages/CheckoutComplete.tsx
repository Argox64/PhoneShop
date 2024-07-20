import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Card, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import OrdersService from '@/services/OrdersService';
import { useSession } from '@/components/contexts/AuthProvider';
import { useLoader } from '@/components/contexts/LoaderProvider';
import { OrderType } from 'common-types';

interface OrderSummary extends OrderType {

}

const CheckoutComplete: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSession();
  const { loading, setLoading } = useLoader();
  const [searchParams] = useSearchParams();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const orderId = parseFloat(searchParams.get('orderId') as string);

  useEffect(() => {
    setLoading(true);
    if (orderId) {
      OrdersService.getOrder(token.token, orderId)
      .then((result) => {
        setLoading(false);
        if(result.status === 200) {
          const order : OrderType = result.data;
          setOrderSummary(order);
        }
      });
    }
  }, [orderId]);

  const handleBackToShop = () => {
    navigate('/');
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ bgcolor: 'background.paper', p: 4, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Payment Confirmed!
        </Typography>
        {orderSummary ? (
          <>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Thank you for your purchase. A confirmation email has been sent to <strong>{orderSummary.email}</strong>.
            </Typography>
            <Box sx={{ my: 4 }}>
              <Typography variant="h6" fontWeight="bold">
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box>
                {orderSummary.orderDetails.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">{item.name} x{item.quantity}</Typography>
                    <Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${orderSummary.subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Discount</Typography>
                <Typography variant="body1">-${orderSummary.discount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">${orderSummary.shipping.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', mb: 1 }}>
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1">${orderSummary.total.toFixed(2)}</Typography>
              </Box>
            </Box>
            <Button variant="contained" color="primary" onClick={handleBackToShop} sx={{ mt: 4 }}>
              Back to Shop
            </Button>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Unable to fetch order details.
          </Typography>
        )}
      </Card>
    </Container>
  );
};

export default CheckoutComplete;
