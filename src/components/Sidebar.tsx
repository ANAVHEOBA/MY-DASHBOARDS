import React from 'react';
import { HomeIcon, ShoppingCartIcon, TagIcon, UsersIcon, UserIcon, Cog6ToothIcon, ChartBarIcon, NewspaperIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-white p-4 flex flex-col shadow-lg overflow-y-auto rounded-t-lg">
      {/* Tesla Logo */}
      <div className="mb-8">
      <div className="bg-[#E68A4E] rounded-t-lg px-4 py-2"> {/* Rounded top corners */}
          <h1 className="text-white text-2xl font-bold">TESLA</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          <NavItem icon={<HomeIcon className="w-5 h-5" />} text="Dashboard" active />
          <NavItem icon={<ShoppingCartIcon className="w-5 h-5" />} text="Orders" />
          <NavItem icon={<TagIcon className="w-5 h-5" />} text="Brands" />
          <NavItem icon={<UsersIcon className="w-5 h-5" />} text="Vendors" />
          <NavItem icon={<UserIcon className="w-5 h-5" />} text="Artisans" />
          <NavItem icon={<UserIcon className="w-5 h-5" />} text="Fans" />
          <NavItem icon={<Cog6ToothIcon className="w-5 h-5" />} text="Settings" />
          <NavItem icon={<ChartBarIcon className="w-5 h-5" />} text="Analytics" />
          <NavItem icon={<NewspaperIcon className="w-5 h-5" />} text="CMS" />
        </ul>
      </nav>

      {/* Customer Support Section */}
      
      <div className="mt-7 text-center text-gray-600">
        
        <p>Having issues with something?</p>
        <p className="text-[#E68A4E] font-semibold cursor-pointer">Customer Support</p>
      </div>

      {/* Logout Button */}
      <button className="mt-4 bg-[#E68A4E] text-white py-2 px-4 rounded-full w-full flex items-center justify-center">
        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
        Logout
      </button>
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ icon, text, active = false }) => {
  return (
    <li className={`flex items-center text-gray-600 py-2 px-3 rounded-lg ${active ? 'bg-[#FFF1E7] text-[#E68A4E]' : 'hover:bg-gray-100'}`}>
      {icon}
      <span className="ml-3">{text}</span>
    </li>
  );
};

export default Sidebar;