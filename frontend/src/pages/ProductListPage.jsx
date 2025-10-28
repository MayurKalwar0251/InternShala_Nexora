/**
 * ProductListPage Component
 * Displays grid of all products from Fake Store API
 */

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { productService } from "../api/services";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { FiPackage } from "react-icons/fi";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []); // Remove refreshKey dependency

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts(10, "asc");
      if (response.success) {
        setProducts(response.data);
      }
    } catch (err) {
      setError("Failed to load products. Please try again.");
      toast.error("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove handleProductAdded - no need to refresh

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <FiPackage size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary">
            Try Again
          </button>
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
            All Products
          </h1>
          <p className="text-gray-600">
            Discover our collection of {products.length} amazing products
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-600">Check back later for new products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                // Remove onAddToCart prop - not needed
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
