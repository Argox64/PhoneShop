import React, { useState } from 'react';
import { Container, Grid, Box, Button, Typography, Stepper, Step, StepLabel } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import Summary from '@/components/cart/Summary';
import CartItems from '@/components/cart/CartItems';
import CustomerDetails from '@/components/cart/CustomerDetails';
import ShippingDetails from '@/components/cart/ShippingDetails';
import StripeCheckout from '@/components/cart/StripeCheckout';
//import { useCart } from '@/components/contexts/CartContext';
import { useSession } from '@/components/contexts/AuthProvider';
import OrdersService from '@/services/OrdersService';
import { NewOrderDetail } from 'common-types';
import { PaymentsService } from '@/services/PaymentsService';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '@/store/slice/cartSlice';
import { RootState } from '@/store/store';

const CartPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(0);
  //const { cart, reset: resetCart } = useCart();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { token } = useSession();

  const subtotal: number = parseFloat(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2));
  const totalPrice: number = parseFloat(subtotal.toFixed(2));

  const handleNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleToPayment = async () => {
    try {
      const orderDetails: NewOrderDetail[] = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));
      const orderResult = await OrdersService.addOrder(token.token, orderDetails, totalPrice);
      if(orderResult.status !== 201) 
        throw new Error("Failed to create order.")
      const order = orderResult.data;
      setOrderId(order.id);

      dispatch(clearCart());

      const paymentResult = await PaymentsService.createPaymentIntent(token.token, order.totalPrice, "usd", order.id);
      if(paymentResult.status !== 201) 
        throw new Error("Failed to create payment.")
      setClientSecret(paymentResult.data.stripePaymentIntent.client_secret);

      handleNextStep();
    } catch (error) {
      console.error('Failed to create order & payment', error);
    }
  };

  const steps = ['Cart', 'Checkout', 'Payment'];

  return (
    <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, md: 4, xl: 8 } }}>
      <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              height: 64,
            }}
          > {step === 2 && (
            <>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBack}
            >
              <ArrowBackIcon /> Back to Cart
            </Button>
          </>
          )} 
          </Box>
      {step === 1 && (
        <>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            Your Shopping Cart <ShoppingCartIcon />
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} xl={8}>
              <CartItems />
            </Grid>
            <Grid item xs={12} xl={4}>
              <Summary />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextStep}
            disabled={cartItems.length === 0}
            sx={{
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              width: '80%',
              maxWidth: '400px',
              display: { xs: 'block', md: 'none' },
              transition: 'background-color 0.3s, transform 0.3s',
              '&:hover': {
                backgroundColor: 'primary.dark'
              },
            }}
          >
            Proceed to Checkout <ArrowForwardIcon />
          </Button>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              mt: 4,
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              disabled={cartItems.length === 0}
              sx={{
                width: '50%',
                maxWidth: '300px',
                py: 2,
                fontSize: '1.2rem',
                transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Proceed to Checkout <ArrowForwardIcon />
            </Button>
          </Box>
        </>
      )}
      {step === 2 && (
        <>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            Checkout <PaymentIcon />
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} xl={8}>
              <Box sx={{ mb: 4 }}>
                <ShippingDetails />
              </Box>
              <Box sx={{ mb: 4 }}>
                <CustomerDetails />
              </Box>
            </Grid>
            <Grid item xs={12} xl={4}>
              <Summary />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleToPayment}
            sx={{
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              width: '80%',
              maxWidth: '400px',
              display: { xs: 'block', md: 'none' },
              transition: 'background-color 0.3s, transform 0.3s',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Continue to Payment <ArrowForwardIcon />
          </Button>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              mt: 4,
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              sx={{
                width: '50%',
                maxWidth: '300px',
                py: 2,
                fontSize: '1.2rem',
                transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Continue to Payment <ArrowForwardIcon />
            </Button>
          </Box>
        </>
      )}
      {step === 3 && (
        <>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            Payment <PaymentIcon />
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} xl={8}>
              <StripeCheckout clientSecret={clientSecret} redirectUrl={`http://localhost:3000/checkout/complete?orderId=${orderId}`}/>
            </Grid>
            <Grid item xs={12} xl={4}>
              <Summary />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default CartPage;
