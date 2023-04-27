const functions = require("firebase-functions");
const { db } = require("./firebaseAdmin");
const stripe = require("stripe")(functions.config().stripe.secret);
const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: "POST",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

exports.handleStripeWebhook = functions
  .runWith({
    allowUnauthenticated: true,
  })
  .https.onRequest((req, res) => {
    cors(corsOptions)(req, res, async () => {
      console.log("Webhook received:", req.body);
      const sig = req.headers["stripe-signature"];
      const endpointSecret = functions.config().stripe.webhooksecret;

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      console.log("Event type:", event.type);

      if (event.type === "checkout.session.completed") {
        console.log("Webhook triggered for checkout.session.completed");

        const session = event.data.object;
        console.log("Checkout session completed:", session);
        const { userId } = session.metadata;
        const cartItems = JSON.parse(session.metadata.cartItems);

        console.log("Parsed cartItems:", cartItems);
        console.log("Parsed userId:", userId);

        // Save order to Firestore
        try {
          const orderData = {
            userId,
            items: cartItems,
            total: session.amount_total,
            createdAt: new Date(),
          };

          console.log("Saving order to Firestore with data:", orderData);

          const userDocRef = db.collection("users").doc(userId);
          const ordersCollectionRef = userDocRef.collection("orders");
          await ordersCollectionRef.add(orderData);

          console.log("Order saved to Firestore");
        } catch (error) {
          console.error("Error saving order to Firestore:", error);
        }

        // Ideally, you would also clear the user's cart here, but it's not possible because Cloud Functions don't have direct access to the user's Redux store.
      }

      res.sendStatus(200);
    });
  });
