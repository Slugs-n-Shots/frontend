import React from "react";
import { useUser } from "contexts/UserContext";

export default function OrderItems() {
  const { user } = useUser();

console.log(user);
  return (
    <div>
      <h1>Order Items</h1>
    </div>
  );
}
