/**
 * Footer Component
 * Bottom footer with links and copyright
 */

import { FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold text-white">
                Vibe Commerce
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Your ultimate shopping destination. Find the best products at the
              best prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition">
                <FiGithub size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-primary-500 transition">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-primary-500 transition"
                >
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-primary-500 transition">
                  Cart
                </a>
              </li>
              <li>
                <a
                  href="/checkout"
                  className="hover:text-primary-500 transition"
                >
                  Checkout
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-500 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} Vibe Commerce. All rights reserved. Built with
            ❤️ for internship assignment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
