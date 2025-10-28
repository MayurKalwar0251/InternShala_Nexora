/**
 * CartPage Component
 * Displays all cart items with summary and checkout button
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { cartService } from "../api/services";
import CartItem from "../components/CartItem";
import Loading from "../components/Loading";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      if (response.success) {
        setCartItems(response.data);
        setSummary(response.summary);
      }
    } catch (err) {
      setError("Failed to load cart");
      toast.error("Failed to load cart", {
        toastId: "cart-load-error",
      });
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Optimistic quantity update - update UI immediately
  const handleQuantityChange = (itemId, newQty) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            qty: newQty,
            subtotal: item.price * newQty,
          };
        }
        return item;
      });

      // Recalculate summary immediately
      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      setSummary({
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      });

      return updatedItems;
    });
  };

  // Optimistic remove - remove from UI immediately
  const handleRemove = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item._id !== itemId);

      // Recalculate summary
      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      setSummary({
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      });

      return updatedItems;
    });
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    // Optimistic update
    const oldItems = [...cartItems];
    const oldSummary = { ...summary };

    setCartItems([]);
    setSummary({ subtotal: 0, tax: 0, total: 0 });

    try {
      const response = await cartService.clearCart();
      if (response.success) {
        toast.success("Cart cleared", {
          toastId: "cart-cleared",
          autoClose: 1500,
        });

        // Trigger cart update event
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      // Revert on error
      setCartItems(oldItems);
      setSummary(oldSummary);
      toast.error("Failed to clear cart", {
        toastId: "cart-clear-error",
      });
      console.error("Error clearing cart:", error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty", {
        toastId: "empty-cart-warning",
      });
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Cart
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={fetchCart} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <FiShoppingCart size={80} className="mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/products"
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <span>Start Shopping</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            You have {cartItems.length}{" "}
            {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}

            {/* Clear Cart Button */}
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="btn btn-secondary w-full"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ${summary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">
                    ${summary.tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-600">
                      ${summary.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-primary w-full flex items-center justify-center space-x-2 mb-4"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight />
              </button>

              <Link
                to="/products"
                className="btn btn-secondary w-full text-center block"
              >
                Continue Shopping
              </Link>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  ✓ Free shipping on orders over $100
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  ✓ 30-day return policy
                </p>
                <p className="text-sm text-gray-600">✓ Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
