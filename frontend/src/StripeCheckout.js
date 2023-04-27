import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeCheckout = ({ amount }) => {
  const [error, setError] = useState(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const fetchPaymentIntentClientSecret = async (amount) => {
    const response = await fetch('https://us-central1-ecommerce-d01ec.cloudfunctions.net/createPaymentIntent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (response.ok) {
      const clientSecret = await response.text();
      return clientSecret;
    } else {
      throw new Error('Failed to create payment intent');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
    } else {
      const clientSecret = await fetchPaymentIntentClientSecret(amount);
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message);
      } else {
        setPaymentSucceeded(true);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      {error && <div>{error}</div>}
      {paymentSucceeded && <div>Payment successful!</div>}
    </form>
  );
};

export default StripeCheckout;
