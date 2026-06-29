import React from 'react';

export default function Badge({ children, variant = 'gray', className = '' }) {
  const variants = {
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    brand: 'bg-brand-100 text-brand-800 border-brand-200',
  };

  const selectedVariant = variants[variant] || variants.gray;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${selectedVariant} ${className}`}>
      {children}
    </span>
  );
}
