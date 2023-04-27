import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import styles from "./Navbar.module.css";
import { auth } from "./firebase";
import PastOrders from "./PastOrders";

function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__left}>
        <Link to="/">
          <span>iRun</span>
        </Link>
      </div>
      <div className={styles.navbar__right}>
        <Link className={styles.navbar__right__link} to="/products">
          Products
          <div className={styles.hoverCard}>Browse our amazing products</div>
        </Link>
        {loggedIn ? (
          <>
            <Link className={styles.navbar__right__link} to="/past-orders">
              Past Orders
              <div className={styles.hoverCard}>View your past orders</div>
            </Link>
          </>
        ) : null}
        <Link className={`${styles.navbar__right__link} ${styles.shoppingCart}`} to="/cart">
          <FaShoppingCart />
          <div className={styles.hoverCard}>View your shopping cart</div>
        </Link>
        {loggedIn ? (
          <button className={`${styles.navbar__right__link} ${styles.logoutBtn}`} onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <Link className={`${styles.navbar__right__link} ${styles.loginBtn}`} to="/signin">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
