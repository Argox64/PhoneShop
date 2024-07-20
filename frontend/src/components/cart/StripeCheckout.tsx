import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';
import { OrderType } from 'common-types';
import { redirect } from 'react-router-dom';

interface StripeCheckoutProps {
  clientSecret: string;
  redirectUrl: string;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLICKEY);


const options = {
  mode: 'payment' as const,
  amount: 1099,
  currency: 'usd',
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#f6f9fc',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    },
    rules: {
      '.Input': {
        borderColor: '#e0e6eb',
        color: '#30313d',
      },
      '.Label': {
        color: '#6b7c93',
      },
    },
  },
};

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  const { clientSecret, redirectUrl } = props;
  return (
    <div className='flex container mt-8'>
      <Elements stripe={stripePromise} options={options}>
        <StripeCheckoutForm clientSecret={clientSecret} redirectUrl={redirectUrl}/>
      </Elements>
    </div>
  );
};

export default StripeCheckout;
