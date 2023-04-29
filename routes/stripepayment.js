import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();
router.post("/create-checkout-session", async (req, res) => {
  const line_items = await req.body.cartItems.map(item => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.description,
          metadata: {
            productId: item.id,
            userId: req.body.userId
          }
        },
        unit_amount: item.price
      },
      quantity: item.quantity
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    phone_number_collection: {
      enabled: true
    },
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`
  });

  res.send({ url: session.url });
});

//stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_7f67dbec03b6cce087f16f269090ef96fd256f386c322f263c2ea62e85be282c";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;
    let data;
    let eventType;
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        endpointSecret
      );
      console.log("event verified");
      data = event.data.object;
      eventType = event.type;
    } catch (err) {
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      console.log("Payment was successful.");
      stripe.customers.retrieve(data, (err, customer) => {
        if (err) {
          console.log(err);
        } else {
          console.log("checkout last", customer);
        }
      });
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
  }
);

export { router as paymentRouter };
