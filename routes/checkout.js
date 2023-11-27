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

// Fetch the Checkout Session to display the JSON result on the success page
router.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

router.post("/create-checkout-session", async (req, res) => {
  const domainURL = process.env.DOMAIN;

  const { price, action, id, plan } = req.body;

  let successRoute = "success.html";

  if (
    process.env.PRICE_BASIC === price ||
    process.env.PRICE_STANDARD === price ||
    process.env.PRICE_PREMIUM === price
  ) {
    successRoute = "success-registration";
  } else if (
    process.env.PRICE_EXECUTIVE_COMPENSATION === price ||
    process.env.PRICE_SHORT === price ||
    process.env.PRICE_LONG === price ||
    process.env.PRICE_EXECUTIVE_COMPENSATION_AND_SHORT === price ||
    process.env.PRICE_EXECUTIVE_COMPENSATION_AND_LONG === price ||
    process.env.PRICE_LONG_AND_SHORT === price ||
    process.env.PRICE_EXECUTIVE_COMPENSATION_AND_SHORT_AND_LONG === price
  ) {
    successRoute = "success-training";
  }

  let product = "";
  switch (price) {
    case process.env.PRICE_100:
      product = "CEO_pay_NSE100.pdf";
      break;
    case process.env.PRICE_250:
      product = "CEO_pay_MALL_CAP_250.pdf";
      break;
    case process.env.PRICE_500:
      product = "CEO_pay_TOP_500_FINAL.pdf";
      break;
    case process.env.PRICE_EXECUTIVE_COMPENSATION:
      product = "Executive";
      break;

    default:
      product = "none";
  }

  // Create new Checkout Session for the order
  // Other optional params include:
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${domainURL}/${successRoute}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/canceled.html`,
    metadata: {
      report_product: product,
      plan: plan,
      action: action,
      // Add additional key-value pairs as needed
    },

    // automatic_tax: { enabled: true }
  });

  return res.status(200).json({ url: session.url, action: action });
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
