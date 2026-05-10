import React from 'react';
import { Table, Button } from 'react-bootstrap';

 export const OrdersTable = ({ orders }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Total Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={index}>
            <td>{order.date}</td>
            <td>${order.totalPrice.toFixed(2)}</td>
            <td>
              <Button variant="dark">View</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    
  ); 
} 

export const ShoppingCartTable = ({ items }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.productName}</td>
            <td>{item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
              <Button variant="dark">View</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const ProfileTable = ({ userInfo }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>User Info</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{userInfo.username}</td>
          <td>
            <Button variant="light">View</Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export default function Tables() {
  // Example data for each table
  const ordersData = [
    { date: '2022-03-01', totalPrice: 25.99 },
    { date: '2022-03-02', totalPrice: 19.99 },
    // Add more order objects as needed
  ];

  const shoppingCartData = [
    { productName: 'Product A', quantity: 2, price: 15.99 },
    { productName: 'Product B', quantity: 1, price: 9.99 },
    // Add more item objects as needed
  ];

  const profileData = {
    username: 'john_doe',
    // Add more user info properties as needed
  };

  return (
    <main>
      {/* Orders Table */}
      <article>
        <h2>Orders</h2>
        <OrdersTable orders={ordersData} />
      </article>

      {/* Shopping Cart Table */}
      <article>
        <h2>Shopping Cart</h2>
        <ShoppingCartTable items={shoppingCartData} />
      </article>

      {/* Profile Table */}
      <article>
        <h2>Profile</h2>
        <ProfileTable userInfo={profileData} />
      </article>
    </main>
  );
}
