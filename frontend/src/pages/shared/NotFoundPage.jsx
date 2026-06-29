import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-extrabold text-brand-500">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-600 max-w-md mx-auto">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button size="lg">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}
