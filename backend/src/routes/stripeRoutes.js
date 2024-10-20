// backend/src/routes/stripeRoutes.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');
const auth = require('../middleware/auth');

// Create a product and price (run this once or when you need to update the price)
const createProductAndPrice = async () => {
  const product = await stripe.products.create({
    name: 'Premium Subscription',
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2900, // $29.00
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
  });

  return price.id;
};

// You might want to store this price ID in your database or environment variable
let PRICE_ID;

router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    if (!PRICE_ID) {
      PRICE_ID = await createProductAndPrice();
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard`,
      client_reference_id: req.user._id.toString(),
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/verify-subscription', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      await User.findByIdAndUpdate(req.user._id, { isPremium: true });
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await handleSubscriptionChange(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

async function handleSubscriptionChange(subscription) {
  const userId = subscription.client_reference_id;
  const status = subscription.status;

  await User.findByIdAndUpdate(userId, {
    isPremium: status === 'active',
    stripeSubscriptionId: subscription.id,
    stripePlanId: subscription.plan.id
  });
}

module.exports = router;