import React from "react";
import { Navigate } from "react-router-dom";
import { useCart } from "./CartContext";

const AdminRoute = ({ children }) => {
  const { user } = useCart();
  
  // REPLACE THIS WITH YOUR EXACT ADMIN EMAIL
  const ADMIN_EMAIL = "diamondfragrance8@gmail.com";

  // 1. Loading check (optional, but good if user is being fetched)
  // If you have a loading state in context, check it here.

  // 2. Check Permissions
  if (!user || user.email !== ADMIN_EMAIL) {
    // If not logged in OR not the admin, redirect to home
    return <Navigate to="/" replace />;
  }

  // 3. If Admin, render the dashboard
  return children;
};

export default AdminRoute;