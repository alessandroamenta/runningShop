import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container>
      <Row className="my-5">
        <Col xs={12} className="text-center">
          <h1>Welcome to the official fakeStore App!</h1>
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, magna eget
            sollicitudin molestie, libero lacus commodo quam, sit amet commodo nibh nibh ac nunc.
            Morbi lacinia justo vel neque molestie, non dignissim lectus feugiat. Curabitur ac
            sapien quis neque rhoncus tristique eu quis elit. Aenean porttitor sagittis tellus vel
            varius. Suspendisse potenti. Nulla in magna lectus.
          </p>
          <Link to="/products">
            <Button variant="primary" size="lg" className="mt-3">
              See Products
            </Button>
          </Link>
        </Col>
      </Row>
      <Row className="my-5">
        <Col xs={12} md={4} className="text-center">
          <i className="fas fa-truck fa-5x mb-3"></i>
          <h3>Free Shipping</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, magna eget
            sollicitudin molestie, libero lacus commodo quam, sit amet commodo nibh nibh ac nunc.
            Morbi lacinia justo vel neque molestie.
          </p>
        </Col>
        <Col xs={12} md={4} className="text-center">
          <i className="fas fa-headphones-alt fa-5x mb-3"></i>
          <h3>24/7 Customer Support</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, magna eget
            sollicitudin molestie, libero lacus commodo quam, sit amet commodo nibh nibh ac nunc.
            Morbi lacinia justo vel neque molestie.
          </p>
        </Col>
        <Col xs={12} md={4} className="text-center">
          <i className="fas fa-lock fa-5x mb-3"></i>
          <h3>Secure Payments</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod, magna eget
            sollicitudin molestie, libero lacus commodo quam, sit amet commodo nibh nibh ac nunc.
            Morbi lacinia justo vel neque molestie.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;


