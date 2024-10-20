// frontend/src/components/SubscribeButton.js

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../services/api';

const stripePromise = loadStripe('your_stripe_publishable_key');

const SubscribeButton = () => {
  const handleClick = async (event) => {
    const stripe = await stripePromise;
    const response = await api.post('/stripe/create-checkout-session');
    const session = response.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });
    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <button onClick={handleClick}>
      Upgrade to Premium
    </button>
  );
};

export default SubscribeButton;