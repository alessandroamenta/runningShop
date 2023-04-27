import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "./store/cartSlice";

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [selectedQuantities, setSelectedQuantities] = useState({});

  //const stringId = id.toString();
  const dispatch = useDispatch();

  const handleIncreaseQuantity = (id) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + 1,
    }));
  };

  const handleDecreaseQuantity = (id) => {
    setSelectedQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (newQuantities[id] && newQuantities[id] > 1) {
        newQuantities[id] -= 1;
      } else {
        delete newQuantities[id];
      }
      return newQuantities;
    });
  };

  const handleAddToCart = (product) => {
    const id = product.id;
    const quantity = selectedQuantities[id] || 1;
    dispatch(addToCart({ ...product, id, quantity }));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://us-central1-ecommerce-d01ec.cloudfunctions.net/getProduct?id=${id}`
        );
        console.log("Product data:", response.data); // add this line
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          Product not found!: {id}
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid"
          />
        </div>
        <div className="col-lg-6">
          <h2 className="mb-4">{product.name}</h2>
          <h3 className="mb-3">${product.price}</h3>
          <p className="mb-3">{product.description}</p>
          
          <div className="d-flex align-items-center mb-3">
            <button className="btn btn-secondary btn-sm" onClick={() => handleDecreaseQuantity(product.id)}>
              -
            </button>
            <span className="mx-3">{selectedQuantities[product.id] || 1}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => handleIncreaseQuantity(product.id)}>
              +
            </button>
          </div>
          
          <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
