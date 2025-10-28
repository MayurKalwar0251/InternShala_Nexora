/**
 * CheckoutPage Component
 * Checkout form with order summary and receipt generation
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCreditCard, FiLock } from "react-icons/fi";
import { cartService, checkoutService } from "../api/services";
import Loading from "../components/Loading";
import ReceiptModal from "../components/ReceiptModal";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        if (response.data.length === 0) {
          toast.warning("Your cart is empty", {
            toastId: "empty-cart-checkout",
          });
          navigate("/cart");
          return;
        }
        setCartItems(response.data);
        setSummary(response.summary);
      }
    } catch (error) {
      toast.error("Failed to load cart", {
        toastId: "checkout-cart-error",
      });
      console.error("Error fetching cart:", error);
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name", {
        toastId: "name-required",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email", {
        toastId: "email-required",
      });
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        toastId: "email-invalid",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (processing) return; // Prevent double submission

    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty", {
        toastId: "empty-cart-submit",
      });
      navigate("/cart");
      return;
    }

    setProcessing(true);

    try {
      const response = await checkoutService.processCheckout(
        cartItems,
        formData.name,
        formData.email
      );

      if (response.success) {
        toast.success("Order placed successfully!", {
          toastId: "checkout-success",
          autoClose: 2000,
        });

        setReceipt(response.receipt);
        setShowReceipt(true);
        setFormData({ name: "", email: "" });

        // Trigger cart update
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Checkout failed. Please try again.";
      toast.error(errorMessage, {
        toastId: "checkout-error",
      });
      console.error("Checkout error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    navigate("/products");
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiCreditCard className="mr-2" />
                Customer Information
              </h2>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                    disabled={processing}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="john@example.com"
                    required
                    disabled={processing}
                  />
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <FiLock className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Secure Checkout
                    </p>
                    <p className="text-sm text-green-700">
                      Your information is encrypted and secure
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className={`btn btn-primary w-full text-lg py-3 ${
                    processing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </span>
                  ) : (
                    `Place Order - $${summary.total.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-start text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold text-gray-900 ml-4">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Totals */}
              <div className="border-t pt-4 space-y-3">
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
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-600">
                      ${summary.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />
      )}
    </div>
  );
};

export default CheckoutPage;
