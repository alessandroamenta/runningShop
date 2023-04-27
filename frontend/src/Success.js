import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from './store/cartSlice';

const Success = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Your order has been placed.</p>
    </div>
  );
};

export default Success;
