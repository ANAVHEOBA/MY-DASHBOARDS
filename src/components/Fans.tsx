import React from 'react';
import { Users } from 'lucide-react';

const Fans = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8"> {/* Responsive padding */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 flex items-center text-gray-900">
        <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2" /> {/* Responsive icon size */}
        Fans
      </h1>
      <p className="text-sm sm:text-base text-gray-800">
        This is the Fans page. Add your content here.
      </p>
    </div>
  );
};

export default Fans;