import React, { useState } from 'react';
import { Home, Users, Tag, UserCheck, Store, Award, FileText, DollarSign, BarChart2, Bell, LogOut, LucideIcon } from 'lucide-react';

interface NavItemProps {
  Icon: LucideIcon;
  text: string;
  active: boolean;
  onClick: () => void;
}

interface MenuItem {
  icon: LucideIcon;
  text: string;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');

  const menuItems: MenuItem[] = [
    { icon: Home, text: 'Dashboard' },
    { icon: Users, text: 'Fans' },
    { icon: Tag, text: 'Brands' },
    { icon: UserCheck, text: 'Artisan' },
    { icon: Store, text: 'Vendor' },
    { icon: Award, text: 'Challenges' },
    { icon: FileText, text: 'Comics' },
    { icon: DollarSign, text: 'Payment' },
    { icon: BarChart2, text: 'Reports and Analytics' },
    { icon: Bell, text: 'Inbox & Notifications' },
  ];

  return (
    <div className="w-64 h-screen bg-white flex flex-col shadow-lg">
      {/* tella Logo */}
      <div className="bg-[#CF7D2C] p-4">
        <h1 className="text-white text-3xl font-extrabold tracking-wider" style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontFamily: '"Arial Black", Gadget, sans-serif',
          letterSpacing: '0.1em',
        }}>
          TESLA
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1 p-2">
          {menuItems.map((item) => (
            <NavItem
              key={item.text}
              Icon={item.icon}
              text={item.text}
              active={activeItem === item.text}
              onClick={() => setActiveItem(item.text)}
            />
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <button className="flex items-center p-4 hover:bg-gray-100">
        <LogOut size={20} className="text-gray-600 mr-3" />
        <span className="text-gray-600">Logout</span>
      </button>
    </div>
  );
};

const NavItem: React.FC<NavItemProps> = ({ Icon, text, active, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex items-center py-2 px-3 rounded-lg cursor-pointer ${
        active ? 'bg-[#FFF5ED] text-[#CF7D2C]' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} className={active ? 'text-[#CF7D2C]' : 'text-gray-400'} />
      <span className="ml-3">{text}</span>
    </li>
  );
};

export default Sidebar;