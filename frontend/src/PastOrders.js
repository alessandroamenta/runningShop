import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth, db } from "./firebase";
import { collection, doc, query, where, getDocs } from "firebase/firestore";

const PastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const userDocRef = doc(db, "users", userId);
      const ordersCollectionRef = collection(userDocRef, "orders");
      const q = query(ordersCollectionRef);
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(fetchedOrders);
      setLoading(false);
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Past Orders:</h2>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Order ID: {order.id}</h5>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - Qty: {item.quantity} - $
                    {item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p>Total: ${order.total}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PastOrders;
