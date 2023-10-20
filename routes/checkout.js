const express = require("express");

const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  // appInfo: {
  //   // For sample support and debugging, not required for production:
  //   name: 'stripe-samples/accept-a-payment/prebuilt-checkout-page',
  //   version: '0.0.1',
  //   url: 'https://github.com/stripe-samples',
  // },
});

router.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

// Fetch the Checkout Session to display the JSON result on the success page
router.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

router.post("/create-checkout-session", async (req, res) => {
  const domainURL = process.env.DOMAIN;

  // Create new Checkout Session for the order
  // Other optional params include:
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price: process.env.PRICE,
        quantity: 1,
      },
    ],
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/canceled.html`,
    // automatic_tax: { enabled: true }
  });

  return res.redirect(303, session.url);
});

// Webhook handler for asynchronous events.
router.post("/webhook", async (req, res) => {
  let event;

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `.env`,
    // retrieve the event data directly from the request body.
    event = req.body;
  }

  if (event.type === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);

    // Note: If you need access to the line items, for instance to
    // automate fullfillment based on the the ID of the Price, you'll
    // need to refetch the Checkout Session here, and expand the line items:
    //
    const session = await stripe.checkout.sessions.retrieve(
      "cs_test_KdjLtDPfAjT1gq374DMZ3rHmZ9OoSlGRhyz8yTypH76KpN4JXkQpD2G0",
      {
        expand: ["line_items"],
      }
    );

    const lineItems = session.line_items;
  }

  res.sendStatus(200);
});

module.exports = router;
