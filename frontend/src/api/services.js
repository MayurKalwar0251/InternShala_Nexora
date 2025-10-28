/**
 * API Services
 * All API calls for the application
 */

import api from "./config";
import { getSessionId } from "../utils/sessionManager";

// Product Services
export const productService = {
  // Get all products
  getProducts: async (limit = 10, sort = "asc") => {
    const response = await api.get(`/products?limit=${limit}&sort=${sort}`);
    return response.data;
  },

  // Get single product
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get("/products/categories/all");
    return response.data;
  },
};

// Cart Services
export const cartService = {
  // Get cart items
  getCart: async () => {
    const sessionId = getSessionId();
    const response = await api.get(`/cart/${sessionId}`);
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, qty = 1) => {
    const sessionId = getSessionId();
    const response = await api.post("/cart", { productId, qty, sessionId });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (id, qty) => {
    const sessionId = getSessionId();
    const response = await api.put(`/cart/${id}`, { qty, sessionId });
    return response.data;
  },

  // Remove item from cart
  deleteCartItem: async (id) => {
    const sessionId = getSessionId();
    const response = await api.delete(`/cart/${id}`, { data: { sessionId } });
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const sessionId = getSessionId();
    const response = await api.delete(`/cart/clear/${sessionId}`);
    return response.data;
  },
};

// Checkout Services
export const checkoutService = {
  // Process checkout
  processCheckout: async (cartItems, name, email) => {
    const response = await api.post("/checkout", {
      cartItems,
      name,
      email,
    });
    return response.data;
  },

  // Get all receipts
  getReceipts: async (email = null, limit = 10) => {
    let url = `/checkout/receipts?limit=${limit}`;
    if (email) {
      url += `&email=${email}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get receipt by number
  getReceiptByNumber: async (receiptNumber) => {
    const response = await api.get(`/checkout/receipt/${receiptNumber}`);
    return response.data;
  },

  // Get receipts by email
  getReceiptsByEmail: async (email) => {
    const response = await api.get(`/checkout/receipts/email/${email}`);
    return response.data;
  },
};
