import React from 'react';
import { Users } from 'lucide-react';

const Fans = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center text-gray-900"> {/* Use a darker text color */}
        <Users className="mr-2" /> Fans
      </h1>
      <p className="text-gray-800"> {/* Use a darker text color */}
        This is the Fans page. Add your content here.
      </p>
    </div>
  );
};

export default Fans;
