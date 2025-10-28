/**
 * Navbar Component
 * Top navigation bar with cart icon and badge
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiHome, FiPackage } from "react-icons/fi";
import { cartService } from "../api/services";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setCartCount(response.count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Also fetch when navigating to cart page
  useEffect(() => {
    if (location.pathname === "/cart") {
      fetchCartCount();
    }
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path
      ? "text-primary-600 font-semibold"
      : "text-gray-700";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Vibe Commerce
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 hover:text-primary-600 transition ${isActive(
                "/"
              )}`}
            >
              <FiHome />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className={`flex items-center space-x-1 hover:text-primary-600 transition ${isActive(
                "/products"
              )}`}
            >
              <FiPackage />
              <span>Products</span>
            </Link>
            <Link
              to="/cart"
              className={`flex items-center space-x-1 hover:text-primary-600 transition relative ${isActive(
                "/cart"
              )}`}
            >
              <FiShoppingCart className="text-xl" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600 transition"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fadeIn">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-2 py-2 hover:text-primary-600 transition ${isActive(
                "/"
              )}`}
            >
              <FiHome />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-2 py-2 hover:text-primary-600 transition ${isActive(
                "/products"
              )}`}
            >
              <FiPackage />
              <span>Products</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-2 py-2 hover:text-primary-600 transition relative ${isActive(
                "/cart"
              )}`}
            >
              <FiShoppingCart />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold ml-2">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
