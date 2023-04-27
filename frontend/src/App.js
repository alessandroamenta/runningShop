import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import SignIn from "./SignIn";
import HomePage from "./HomePage";
import ProductListingPage from "./ProductListingPage";
import ProductDetailPage from "./ProductDetailPage";
import Cart from "./CartPage";
import Navbar from "./Navbar";
import "intersection-observer";
import Success from "./Success";
import Canceled from "./Canceled";
import PastOrders from "./PastOrders";

function App() {



  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/success" element={<Success />} />
          <Route path="/canceled" element={<Canceled />} />
          <Route path="/past-orders" element={<PastOrders />} />
        </Routes>
      </div>
      
    </Router>
  );
}

export default App;
