import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ShopNest. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;