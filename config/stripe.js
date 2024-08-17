
import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {apiVersion: '2024-06-20'});

export {stripe}
