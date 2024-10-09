import React, { useState } from 'react';
import { Home, Users, UserCheck, BarChart2, Settings, LogOut, LucideIcon } from 'lucide-react'; // Import necessary icons
import { useNavigate } from 'react-router-dom';

interface NavItemProps {
  Icon: LucideIcon;
  text: string;
  active: boolean;
  onClick: () => void;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const navigate = useNavigate(); // Use useNavigate to programmatically navigate

  const menuItems = [
    { icon: Home, text: 'Dashboard', path: '/' },
    { icon: Users, text: 'Users', path: '/users' },
    { icon: UserCheck, text: 'Listeners', path: '/listeners' },
    { icon: LogOut, text: 'Sessions', path: '/sessions' },
    { icon: BarChart2, text: 'Analytics', path: '/analytics' },
    { icon: Settings, text: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-white flex flex-col shadow-lg">
      <div className="bg-[#007BFF] p-4"> {/* Blue background for the header */}
        <h1 className="text-white text-3xl font-extrabold tracking-wider">
          TESLA
        </h1>
      </div>

      <nav className="flex-grow overflow-y-auto">
        <ul className="space-y-1 p-2">
          {menuItems.map((item) => (
            <NavItem
              key={item.text}
              Icon={item.icon}
              text={item.text}
              active={activeItem === item.text}
              onClick={() => {
                setActiveItem(item.text);
                navigate(item.path); // Navigate to the selected path
              }}
            />
          ))}
        </ul>
      </nav>

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
        active ? 'bg-[#D0E4FF] text-[#007BFF]' : 'text-gray-600 hover:bg-gray-100'
      }`} // Active item styling
    >
      <Icon size={20} className={active ? 'text-[#007BFF]' : 'text-gray-400'} />
      <span className="ml-3">{text}</span>
    </li>
  );
};

export default Sidebar;
