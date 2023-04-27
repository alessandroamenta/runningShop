import React from 'react';

const TestCards = ({ onContinue }) => {
  return (
    <div className="container">
      <h2>Test Cards Information</h2>
      <p>
        To simulate a successful payment, use the following test card
        information:
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>Number</th>
            <th>CVC</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Visa</td>
            <td>4242 4242 4242 4242</td>
            <td>Any 3 digits</td>
            <td>Any future date</td>
          </tr>
          <tr>
            <td>Mastercard</td>
            <td>5555 5555 5555 4444</td>
            <td>Any 3 digits</td>
            <td>Any future date</td>
          </tr>
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={onContinue}>
        Continue to Checkout
      </button>
    </div>
  );
};

export default TestCards;
