const functions = require('firebase-functions');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const cors = require('cors');
const stripe = require("stripe")(functions.config().stripe.secret);
const { v4: uuidv4 } = require('uuid');
const { handleStripeWebhook } = require("./stripeWebhooks");
const { db } = require("./firebaseAdmin"); // Import 'db' from firebaseAdmin.js

const corsOptions = {
  origin: ['http://localhost:3002', 'https://your-app-domain.com'], // Add your app's domain(s) here
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
const corsMiddleware = cors(corsOptions);

//function that retrieves all products
exports.getAllProducts = functions.https.onRequest(async (req, res) => {
    corsMiddleware(req, res, async () => { // use corsMiddleware here
        try {
          const productsRef = db.collection('products');
          const productsSnapshot = await productsRef.get();
          const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          res.json(products);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error retrieving products data');
        }
    });
});

//function that retrieves a product based on id
exports.getProduct = functions.https.onRequest(async (req, res) => {
    corsMiddleware(req, res, async () => { // use corsMiddleware here
      try {
        const productId = req.query.id.toString();
        const productRef = db.collection('products').doc(productId);
        const productDoc = await productRef.get();
        if (!productDoc.exists) {
          res.status(404).send('Product not found');
        } else {
          res.json(productDoc.data());
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving product data');
      }
    });
  });

exports.handleStripeWebhook = handleStripeWebhook;

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
    corsMiddleware(req, res, async () => {
      try {
        let { cartItems } = req.body;
  
        // Check if cartItems exists
        if (!cartItems) {
          throw new functions.https.HttpsError("invalid-argument", "No cart items found");
        }
  
        // Ensure that cartItems is an array
        if (!Array.isArray(cartItems)) {
          // Try parsing it as JSON in case it's a string
          try {
            cartItems = JSON.parse(cartItems);
          } catch (error) {
            throw new functions.https.HttpsError("invalid-argument", "Cart items is not an array");
          }
  
          if (!Array.isArray(cartItems)) {
            throw new functions.https.HttpsError("invalid-argument", "Cart items is not an array");
          }
        }
  
        // Check if cartItems is empty
        if (cartItems.length === 0) {
          throw new functions.https.HttpsError("invalid-argument", "Cart items is empty");
        }
  
        const lineItems = cartItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              description: item.description,
              metadata: {
                productId: item.id,
              },
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        }));
  
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `http://localhost:3002/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: "http://localhost:3002/canceled",
          metadata: {
            cartItems: JSON.stringify(cartItems),
            userId: req.body.userId,
          },
        });
  
        res.status(200).json({ sessionId: session.id });
      } catch (error) {
        console.error('Error details:', error.message, error.stack);
        res.status(500).json({ message: 'Error creating checkout session', details: error.message });
      }
    });
  });