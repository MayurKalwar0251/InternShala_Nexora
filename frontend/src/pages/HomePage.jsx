/**
 * HomePage Component
 * Landing page with hero section and featured products
 */

import { Link } from "react-router-dom";
import { FiShoppingBag, FiTruck, FiShield, FiAward } from "react-icons/fi";

const HomePage = () => {
  const features = [
    {
      icon: <FiShoppingBag size={32} />,
      title: "Wide Selection",
      description: "Browse through thousands of quality products",
    },
    {
      icon: <FiTruck size={32} />,
      title: "Fast Delivery",
      description: "Get your orders delivered quickly and safely",
    },
    {
      icon: <FiShield size={32} />,
      title: "Secure Payment",
      description: "Shop with confidence using secure payment methods",
    },
    {
      icon: <FiAward size={32} />,
      title: "Best Quality",
      description: "Only the highest quality products for our customers",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="bg-white text-center py-20 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
              Welcome to Vibe Commerce
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 animate-fadeIn">
              Your ultimate destination for quality products at unbeatable
              prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
              <Link
                to="/products"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 shadow-md"
              >
                Shop Now
              </Link>
              <Link
                to="/cart"
                className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition transform hover:scale-105"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-black rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl mb-8 text-gray-700">
              Explore our collection and find exactly what you need
            </p>
            <Link
              to="/products"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 shadow-md"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-black mb-2">10K+</p>
              <p className="text-gray-600">Products</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-black mb-2">50K+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-black mb-2">99%</p>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-black mb-2">24/7</p>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
