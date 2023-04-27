import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./ProductCard.module.css";
import CoolImage from "./CoolImage";


const ProductCard = ({ product }) => {
  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} />
        <h5>{product.name}</h5>
        <div className="price">Price: ${product.price}</div>
        <div className="description">Description: {product.description}</div>
      </Link>
    </div>
  );
};


const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://us-central1-ecommerce-d01ec.cloudfunctions.net/getAllProducts');
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <CoolImage />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
