/**
 * NotFoundPage Component
 * 404 error page
 */

import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>
        <Link
          to="/"
          className="btn btn-primary inline-flex items-center space-x-2"
        >
          <FiHome />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
