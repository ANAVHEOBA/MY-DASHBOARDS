import React from 'react';
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
      <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      <p className="text-sm text-green-500">
        <ArrowUpIcon className="inline w-4 h-4 mr-1" />
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
      <span className="text-gray-900 font-semibold">{label}</span> {/* Darker color and bold for label */}
      <div className="text-right">
        <p className="font-bold text-gray-900">{value}</p> {/* Darker color and bold for value */}
        
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
        <p className="font-semibold text-gray-900">{name}</p> {/* Dark color for product name */}
        <p className="text-sm text-gray-800">{brand}</p> {/* Darker color for brand */}
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

const Dashboard: React.FC = () => {
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
      
      {/* Flex container for Orders, Users, and Pending Tasks */}
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-500 font-bold">Orders</p> {/* Make Orders bold */}
        <a href="/users" className="text-sm text-gray-500 hover:text-gray-800">
          Users
        </a>
        <a href="/pending-tasks" className="text-sm text-gray-500 hover:text-gray-800">
          Pending Tasks
        </a>
      </div>
    </div>
            
            <div className="flex items-center">
              <select className="mr-2 p-2 border rounded">
                <option>Year</option>
              </select>
              <button className="bg-[#E68A4E] text-white px-4 py-2 rounded">Download Report</button>
            </div>
          </div>
          <Bar data={data} options={options} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Active users</h3>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Number of active users</h3>
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
    // Adjust heights for each day to vary distinctly
    const heights = [50, 80, 90, 100, 120, 70, 60]; // Sample heights in pixels
    const heightPercentage = heights[index];
    const percentage = ((heightPercentage / 120) * 100).toFixed(0); // Convert height to percentage based on max height (120px in this case)

    return (
      <div key={day} className="text-center">
        <div 
          className={`w-6 ${index === 4 ? 'bg-[#E68A4E]' : 'bg-[#FCD5B5]'}`} 
          style={{ height: `${heightPercentage}px` }} // Height based on the values in the heights array
        />
        <p className="text-xs mt-1 text-gray-900">{day}</p> {/* Day label below the bar */}
        <p className="text-xs text-gray-900">{percentage}%</p> {/* Percentage text below the day label */}
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
  <h3 className="text-lg font-semibold mb-4 text-gray-900">Most popular products</h3> {/* Darker color for heading */}
  <div className="space-y-4">
    <PopularProduct name="Hoodies" brand="Chubbies x Blackbones" change={7} />
    <PopularProduct name="Snapbacks" brand="Chubbies x Blackbones" change={7} />
    <PopularProduct name="Stickers" brand="Chubbies x Blackbones" change={7} />
  </div>
  <div className="mt-6">
    <h4 className="text-sm font-semibold mb-2 text-gray-900">Notifications</h4> {/* Darker color for subheading */}
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