/**
 * ProductCard Component
 * Displays individual product with add to cart functionality
 */

import { useState } from "react";
import { FiShoppingCart, FiStar, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import { cartService } from "../api/services";

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return;

    setIsAdding(true);

    try {
      const response = await cartService.addToCart(product.id, 1);

      if (response.success) {
        setIsAdded(true);

        toast.success(`${product.title.substring(0, 25)}... added!`, {
          toastId: `cart-${product.id}`,
          autoClose: 2000,
        });

        setTimeout(() => setIsAdded(false), 2000);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      toast.error("Failed to add item", {
        toastId: `error-${product.id}`,
      });
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 animate-fadeIn p-4">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100 h-64 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 bg-black text-white text-xs px-3 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-1 mb-2">
            <FiStar className="text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {product.rating.rate}
            </span>
            <span className="text-sm text-gray-500">
              ({product.rating.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || isAdded}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border
            ${
              isAdded
                ? "bg-green-600 text-white border-green-600 cursor-default"
                : isAdding
                ? "bg-gray-300 text-gray-700 border-gray-300 cursor-not-allowed"
                : "bg-black text-white border-black hover:bg-gray-800"
            }`}
        >
          {isAdded ? (
            <>
              <FiCheck />
              <span>Added!</span>
            </>
          ) : (
            <>
              <FiShoppingCart />
              <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
