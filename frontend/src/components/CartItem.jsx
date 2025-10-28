/**
 * CartItem Component
 * Displays individual cart item with quantity controls
 */

import { useState } from "react";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { toast } from "react-toastify";
import { cartService } from "../api/services";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [localQty, setLocalQty] = useState(item.qty);

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1 || isUpdating) return;

    // Optimistic update - change UI immediately
    const oldQty = localQty;
    setLocalQty(newQty);
    setIsUpdating(true);

    // Update parent state immediately for instant calculation
    if (onQuantityChange) {
      onQuantityChange(item._id, newQty);
    }

    try {
      const response = await cartService.updateCartItem(item._id, newQty);

      if (response.success) {
        // No toast spam - silent success
        // Trigger cart update event for navbar
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      // Revert on error
      setLocalQty(oldQty);
      if (onQuantityChange) {
        onQuantityChange(item._id, oldQty);
      }
      toast.error("Failed to update quantity", {
        toastId: `update-error-${item._id}`,
      });
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;

    setIsRemoving(true);

    // Optimistic update - remove from UI immediately
    if (onRemove) {
      onRemove(item._id);
    }

    try {
      const response = await cartService.deleteCartItem(item._id);

      if (response.success) {
        toast.success("Item removed", {
          toastId: `remove-${item._id}`,
          autoClose: 1500,
        });

        // Trigger cart update event
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      toast.error("Failed to remove item", {
        toastId: `remove-error-${item._id}`,
      });
      console.error("Error removing item:", error);

      // On error, trigger full refresh
      window.location.reload();
    } finally {
      setIsRemoving(false);
    }
  };

  // Calculate subtotal locally for instant update
  const subtotal = item.price * localQty;

  return (
    <div className="card flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 animate-fadeIn">
      {/* Product Image */}
      <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="max-h-full max-w-full object-contain p-2"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 w-full">
        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
        <p className="text-sm text-gray-500 mb-2 capitalize">{item.category}</p>
        <p className="text-lg font-bold text-primary-600">
          ${item.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
          <button
            onClick={() => handleQuantityChange(localQty - 1)}
            disabled={isUpdating || localQty <= 1}
            className="p-2 hover:bg-gray-200 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <FiMinus />
          </button>
          <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
            {localQty}
          </span>
          <button
            onClick={() => handleQuantityChange(localQty + 1)}
            disabled={isUpdating}
            className="p-2 hover:bg-gray-200 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <FiPlus />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[5rem]">
          <p className="text-sm text-gray-500">Subtotal</p>
          <p className="text-lg font-bold text-gray-900">
            ${subtotal.toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove item"
          aria-label="Remove item from cart"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
