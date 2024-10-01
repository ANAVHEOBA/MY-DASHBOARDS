import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ChartData, 
  ChartOptions 
} from 'chart.js';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data: ChartData<'bar'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Total Order',
      backgroundColor: '#E68A4E',
      data: [1500, 1700, 1400, 1600, 1400, 1200, 1700, 1600, 200, 1000, 1400, 1500],
    },
    {
      label: 'Gross Profit',
      backgroundColor: '#FCD5B5',
      data: [800, 1600, 1500, 1550, 1700, 1400, 1800, 1550, 1500, 1450, 1700, 1650],
    },
  ],
};

const options: ChartOptions<'bar'> = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change }) => (
  <div className="bg-white p-4 shadow rounded-lg">
    <div className="flex items-center mb-2">
      <div className="w-8 h-8 bg-[#FCD5B5] rounded-full flex items-center justify-center mr-2">
        <div className="w-4 h-4 bg-[#E68A4E] rounded-full"></div>
      </div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
    </div>
    <p className="text-2xl font-semibold text-gray-800 mb-1">{value}</p>
    <p className="text-sm text-green-500 flex items-center">
      <ArrowUpIcon className="w-4 h-4 mr-1" />
      {change}% This week
    </p>
  </div>
);

interface ActiveUserItemProps {
  label: string;
  value: string;
  change: number;
}

const ActiveUserItem: React.FC<ActiveUserItemProps> = ({ label, value, change }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-900 font-semibold">{label}</span>
    <div className="text-right">
      <p className="font-bold text-gray-900">{value}</p>
      <p className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <ArrowUpIcon className="inline w-3 h-3 mr-1" /> : <ArrowDownIcon className="inline w-3 h-3 mr-1" />}
        {Math.abs(change)}%
      </p>
    </div>
  </div>
);

interface OrderRowProps {
  id: string;
  date: string;
  product: string;
  quantity: number;
  price: string;
  status: string;
}

const OrderRow: React.FC<OrderRowProps> = ({ id, date, product, quantity, price, status }) => (
  <tr className="border-b">
    <td className="pb-2 text-gray-700">{id}</td>
    <td className="pb-2 text-gray-700">{date}</td>
    <td className="pb-2 text-gray-700">{product}</td>
    <td className="pb-2 text-gray-700">{quantity}</td>
    <td className="pb-2 text-gray-700">{price}</td>
    <td className="py-2">
      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
        status === 'Delivered' ? 'bg-green-800' :
        status === 'Returned' ? 'bg-red-800' :
        'bg-yellow-800'
      }`}>
        {status}
      </span>
    </td>
  </tr>
);

interface PopularProductProps {
  name: string;
  brand: string;
  change: number;
}

const PopularProduct: React.FC<PopularProductProps> = ({ name, brand, change }) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="font-semibold text-gray-900">{name}</p>
      <p className="text-sm text-gray-800">{brand}</p>
    </div>
    <p className="text-sm text-green-500">
      <ArrowUpIcon className="inline w-3 h-3 mr-1" />
      {change}%
    </p>
  </div>
);

interface NotificationProps {
  text: string;
  time: string;
}

const Notification: React.FC<NotificationProps> = ({ text, time }) => (
  <div className="flex justify-between items-center text-sm">
    <p>{text}</p>
    <p className="text-gray-500">{time}</p>
  </div>
);

interface TabSelectorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['Orders', 'Users', 'Pending Tasks'];
  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-[#E68A4E] text-[#E68A4E]' : 'text-gray-500'}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

interface ChartLabelProps {
  color: string;
  label: string;
}

const ChartLabel: React.FC<ChartLabelProps> = ({ color, label }) => (
  <div className="flex items-center">
    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: color }}></div>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);


const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Orders');
  const [selectedYear, setSelectedYear] = useState('Year');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const years = ['2021', '2022', '2023', '2024'];

  return (
    <div className="p-6 bg-[#FFF8F3]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Total No of Fans" value="500,000" change={6} />
        <MetricCard title="Total No of Artisans" value="128,540" change={6} />
        <MetricCard title="Total No of Brands" value="58,540" change={6} />
        <MetricCard title="Total Revenue" value="₦ 2,843,632" change={6} />
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Report & Analytics</h2>
              <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur.</p>
            </div>
            <div className="flex items-center">
      <div className="relative mr-2">
        <button 
          className="bg-[#E68A4E] border rounded p-2 pr-8 cursor-pointer flex items-center"
          onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
        >
          <span className="mr-2 font-bold text-white">{selectedYear}</span> {/* Display selected year in bold and white */}
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </button>
        
        {isYearDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded shadow-lg z-10">
            {years.map(year => (
              <div 
                key={year} 
                className="p-2 hover:bg-gray-200 cursor-pointer font-bold text-[#E68A4E]" // Year options in bold and a contrasting color
                onClick={() => {
                  setSelectedYear(year); // Set the selected year
                  setIsYearDropdownOpen(false); // Close the dropdown
                }}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="bg-[#E68A4E] text-white px-4 py-2 rounded">Download Report</button>
    </div>



          </div>
          <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
          <Bar data={data} options={options} />
          <div className="mt-4 flex justify-center space-x-8">
            <ChartLabel color="#E68A4E" label="Total Order" />
            <ChartLabel color="#FCD5B5" label="Gross Profit" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Active users</h3>
          <h4 className="text-md font-semibold text-gray-700 mb-4">Number of active users</h4>
          <div className="space-y-4">
            <ActiveUserItem label="Vendors" value="500,000" change={20} />
            <ActiveUserItem label="Artisans" value="300,000" change={0.5} />
            <ActiveUserItem label="Brands" value="50" change={6} />
            <ActiveUserItem label="Fans" value="2,000,000" change={-9} />
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Website visit</h4>
            <div className="flex justify-between">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const heights = [50, 80, 90, 100, 120, 70, 60];
                const heightPercentage = heights[index];
                const percentage = ((heightPercentage / 120) * 100).toFixed(0);

                return (
                  <div key={day} className="text-center">
                    <div 
                      className={`w-6 ${index === 4 ? 'bg-[#E68A4E]' : 'bg-[#FCD5B5]'}`} 
                      style={{ height: `${heightPercentage}px` }}
                    />
                    <p className="text-xs mt-1 text-gray-900">{day}</p>
                    <p className="text-xs text-gray-900">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Order</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-900">
                <th className="pb-2">ID</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Product</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow id="29..." date="Jan 24, 2020" product="Blend fabric sweater" quantity={17} price="$3,549" status="On transit" />
              <OrderRow id="2977" date="Jan 24, 2020" product="Full zip sweater" quantity={7} price="$3,549" status="On transit" />
              <OrderRow id="2971" date="Jan 19, 2020" product="Donegal sweater" quantity={45} price="$3,549" status="Delivered" />
              <OrderRow id="2975" date="Jan 24, 2020" product="Tennis sweater" quantity={9} price="$3,549" status="Returned" />
              <OrderRow id="29..." date="Jan 20, 2020" product="Cowl neck sweater" quantity={24} price="$3,549" status="On transit" />
            </tbody>
          </table>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Most popular products</h3>
          <div className="space-y-4">
            <PopularProduct name="Hoodies" brand="Chubbies x Blackbones" change={7} />
            <PopularProduct name="Snapbacks" brand="Chubbies x Blackbones" change={7} />
            <PopularProduct name="Stickers" brand="Chubbies x Blackbones" change={7} />
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2 text-gray-900">Notifications</h4>
            <div className="space-y-2">
              <Notification text="New order received" time="3 hours ago" />
              <Notification text="Customer canceled order #1234" time="5 hours ago" />
              <Notification text="New user registered" time="1 day ago" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;