import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
