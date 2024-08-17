import {stripe} from '../config/stripe.js';


const paymentController = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: req.body.name,
              description: req.body.description,
            },
            unit_amount: req.body.amount * 100
          },
          quantity: req.body.quantity
        }
      ],
      mode: 'payment',
      success_url: 'http://localhost:3500/api/v1/store',
      cancel_url: 'http://localhost:3500/'
    });
    res.json({session});
  } catch (error) {
    console.log(error.message);
    return res.json({message: 'error'})

  }

}

export default paymentController;