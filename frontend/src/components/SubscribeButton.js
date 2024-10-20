// frontend/src/components/SubscribeButton.js

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../services/api';

const stripePromise = loadStripe('pk_test_51QBsLFRXAztidmbWYDUUxCzjJqmnPDwGPsFzmqpXkOv76NmiAoSLOh0SMixZH04rtlEGVnfx4vpc35d2T6VBwUx000dUuMiCTD');

const SubscribeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async (event) => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      const response = await api.post('/stripe/create-checkout-session');
      const { sessionId } = response.data;

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Upgrade to Premium'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default SubscribeButton;