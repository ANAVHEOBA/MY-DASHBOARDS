import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faShoppingCart, 
  faTags, 
  faStore,        // For Vendors
  faUserTie,      // For Artisans
  faStar,         // For Fans
  faCog,          // For Settings
  faChartBar,     // For Analytics
  faFileAlt,      // For CMS
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');

  return (
    <div className="w-64 h-screen bg-white p-4 flex flex-col shadow-lg overflow-y-auto rounded-t-lg">
      {/* Tesla Logo */}
      <div className="mb-8">
        <div className="bg-[#CF7D2C] rounded-t-lg px-4 py-2">
          <h1 className="text-white text-2xl font-bold">TESLA</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          <NavItem 
            icon={<FontAwesomeIcon icon={faHome} size="lg" />} 
            text="Dashboard" 
            active={activeItem === 'Dashboard'}
            onClick={() => setActiveItem('Dashboard')} 
          />
          <NavItem 
            icon={<FontAwesomeIcon icon={faShoppingCart} size="lg" />} 
            text="Orders" 
            active={activeItem === 'Orders'}
            onClick={() => setActiveItem('Orders')} 
          />
          <NavItem 
            icon={<FontAwesomeIcon icon={faTags} size="lg" />} 
            text="Brands" 
            active={activeItem === 'Brands'}
            onClick={() => setActiveItem('Brands')} 
          />
          <NavItem 
            icon={<FontAwesomeIcon icon={faStore} size="lg" />} 
            text="Vendors" 
            active={activeItem === 'Vendors'}
            onClick={() => setActiveItem('Vendors')} 
          />
          <NavItem 
            icon={<FontAwesomeIcon icon={faUserTie} size="lg" />} 
            text="Artisans" 
            active={activeItem === 'Artisans'}
            onClick={() => setActiveItem('Artisans')} 
          />
          <NavItem 
            icon={<FontAwesomeIcon icon={faStar} size="lg" />} 
            text="Fans" 
            active={activeItem === 'Fans'}
            onClick={() => setActiveItem('Fans')} 
          />
          <NavItem 
            icon={<FontAwesomeIcon icon={faCog} size="lg" />} 
            text="Settings" 
            active={activeItem === 'Settings'}
            onClick={() => setActiveItem('Settings')} 
          />
          <NavItem 
            icon={<FontAwesomeIcon icon={faChartBar} size="lg" />} 
            text="Analytics" 
            active={activeItem === 'Analytics'}
            onClick={() => setActiveItem('Analytics')} 
          />
          <NavItem 
            icon={<FontAwesomeIcon icon={faFileAlt} size="lg" />} 
            text="CMS" 
            active={activeItem === 'CMS'}
            onClick={() => setActiveItem('CMS')} 
          />
        </ul>
      </nav>

      {/* Customer Support Section */}
      <div className="mt-7 text-center text-gray-600">
        <p>Having issues with something?</p>
        <p className="text-[#CF7D2C] font-semibold cursor-pointer">Customer Support</p>
      </div>

      {/* Logout Button */}
      <button className="mt-4 bg-[#CF7D2C] text-white py-2 px-4 rounded-full w-full flex items-center justify-center">
        <FontAwesomeIcon icon={faSignOutAlt} size="lg" className="mr-2" />
        Logout
      </button>
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ icon, text, active = false, onClick }) => {
  return (
    <li 
      onClick={onClick} 
      className={`flex items-center py-2 px-3 rounded-lg cursor-pointer ${
        active ? 'text-[#CF7D2C]' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className={`w-5 h-5 ${active ? 'text-[#CF7D2C]' : 'text-[#D3D3D3]'}`}>{icon}</span>
      <span className="ml-3">{text}</span>
    </li>
  );
};

export default Sidebar;
