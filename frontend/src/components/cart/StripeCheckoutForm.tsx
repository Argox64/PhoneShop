import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Card, Button, CircularProgress, Typography, Divider, Box } from '@mui/material';

type CheckoutFormProps = {
  clientSecret: string,
  redirectUrl: string
}

const StripeCheckoutForm: React.FC<CheckoutFormProps> = (props) => {
  const { clientSecret, redirectUrl } = props;
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError?.message) {
      // Show error to your customer
      console.log(submitError.message);
      return;
    }

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret,
      confirmParams: {
        return_url: redirectUrl
      },
    });

    if (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  return (
    <Card sx={{ bgcolor: 'background.paper', p: 4, flexGrow: 1 }}>
      <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom textAlign="center">
        Payment Details
      </Typography>
      <Divider />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
        <PaymentElement />
        <Button
            type="submit"
            variant="contained"
            color="primary"
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
            {loading ? <CircularProgress size={24} /> : 'Pay Now'}
          </Button>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              mt: 2,
              width: '100%',
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                width: '50%',
                py: 2,
                fontSize: '1rem',
                transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Pay Now'}
            </Button>
          </Box>
      </form>
    </Card>
  );
};

export default StripeCheckoutForm;
