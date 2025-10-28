/**
 * ReceiptModal Component
 * Displays order receipt after successful checkout
 */

import { FiX, FiCheckCircle, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ReceiptModal = ({ receipt, onClose }) => {
  const navigate = useNavigate();

  if (!receipt) return null;

  const handleContinueShopping = () => {
    onClose();
    navigate("/products");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FiCheckCircle size={32} />
              <h2 className="text-2xl font-bold">Order Successful!</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-green-50">
            Thank you for your order. Your receipt has been generated.
          </p>
        </div>

        {/* Receipt Details */}
        <div className="p-6">
          {/* Receipt Header */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Receipt Details
                </h3>
                <p className="text-sm text-gray-500">
                  Receipt #{receipt.receiptNumber}
                </p>
              </div>
              <button className="btn btn-secondary flex items-center space-x-2 text-sm">
                <FiDownload />
                <span>Download</span>
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {formatDate(receipt.timestamp)}
            </p>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              Customer Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {receipt.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {receipt.email}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-3">
              {receipt.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} × {item.qty}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${receipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (10%)</span>
                <span>${receipt.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">
                  ${receipt.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleContinueShopping}
              className="flex-1 btn btn-primary"
            >
              Continue Shopping
            </button>
            <button onClick={onClose} className="flex-1 btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
