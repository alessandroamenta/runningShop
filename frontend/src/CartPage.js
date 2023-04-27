import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, increaseQuantity } from "./store/cartSlice";
import { auth, db, functions } from "./firebase";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import TestCards from "./TestCards";
import { Link } from "react-router-dom";
import "./CartPage.css";

import {
  getDoc,
  updateDoc,
  arrayUnion,
  doc,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

const createCheckoutSessionFunc = async (data) => {
  const response = await fetch(
    "https://us-central1-ecommerce-d01ec.cloudfunctions.net/createCheckoutSession",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    throw new Error(`Unexpected content type: ${contentType}`);
  }
};

const stripePromise = loadStripe(
  "pk_test_51MpragGo3Flm0AubQwLkL2FTEaX1EpkKm4lYXm5NfEUyygmxj6vKCzntdDENp7A6pgNnIr3jz3nrcRuqRiAFIz5N00MXx4PJHY"
);

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTestCards, setShowTestCards] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    setShowTestCards(true);
  };

  const handleContinueToCheckout = async () => {
    // Log the current user's ID
    console.log("User ID:", auth.currentUser.uid);

    const createOrder = async (cartItems, userId) => {
      const orderData = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
        })),
        total: cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        createdAt: new Date(),
      };

      console.log("Order data:", orderData);

      try {
        const userDocRef = doc(db, "users", userId);
        const ordersCollectionRef = collection(userDocRef, "orders");
        const orderDocRef = await addDoc(ordersCollectionRef, orderData);
        console.log("Order document created with ID:", orderDocRef.id);
      } catch (error) {
        console.error("Error creating order document:", error);
      }
    };

    await createOrder(cartItems, auth.currentUser.uid);

    const stripe = await stripePromise;

    // Create a new checkout session.
    try {
      const session = await createCheckoutSessionFunc({
        cartItems: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
        })),
        userId: auth.currentUser.uid,
      });

      // Check if the session contains an error.
      if (session.error) {
        console.error(
          "Error while creating checkout session:",
          session.error.message,
          "Details:",
          session.error.details
        );
        return;
      }

      console.log("Session data:", session);

      // Redirect the user to the checkout form.
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        console.error("Error during redirect:", result.error.message);
      } else {
        // Clear the cart contents after the user has successfully completed the checkout process.
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Error in handleContinueToCheckout:", error.message);
    }
  };

  return (
    <div className="container">
      {showTestCards ? (
        <TestCards onContinue={handleContinueToCheckout} />
      ) : (
        <>
          <h2>Cart Items:</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty. Go pick some cool stuff to buy!</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.name} className="card mb-3">
                  <div className="row no-gutters">
                    <div className="col-4 col-md-3">
                      <Link to={`/products/${item.id}`}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="card-img"
                        />
                      </Link>
                    </div>
                    <div className="col-8 col-md-9">
                      <div className="card-body">
                        <Link
                          to={`/products/${item.id}`}
                          className="card-title-link"
                        >
                          <h5 className="card-title">{item.title}</h5>
                        </Link>
                        <p className="card-text">Qty: {item.quantity}</p>
                        <p className="card-text">
                          ${item.price * item.quantity}
                        </p>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          Remove
                        </button>
                        <button
                          className="btn btn-primary btn-sm ml-2"
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-right">
                <p>
                  Total: $
                  {cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )}
                </p>
                {isLoggedIn ? (
                  <button className="btn btn-primary" onClick={handleCheckout}>
                    Checkout Order
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      window.location.href = "/signin";
                    }}
                  >
                    Log in to complete order
                  </button>
                )}
                <button
                  className="btn btn-danger mt-3"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
