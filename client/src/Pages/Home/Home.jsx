import { FiTrendingUp } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import { useState } from "react";

const Home = () => {
  const [customer, setCustomer] = useState("");
  const [vehicle, setVehicle] = useState("");

  const handleCustomerSearch = () => {
    console.log("Search customer:", customer);
  };

  const handleVehicleSearch = () => {
    console.log("Search vehicle:", vehicle);
  };

  return (
    <div className="space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Card */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500">Sales</h4>
              <p className="text-lg font-bold mt-1">$500.20</p>
              <p className="text-xs text-gray-400 mt-1">Total Sales Today</p>
            </div>
            <FiTrendingUp className="text-purple-600 text-2xl" />
          </div>
        </div>

        {/* Total Cars */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500">Total Cars</h4>
              <p className="text-lg font-bold mt-1">[vehicles Count]</p>
            </div>
            <FaCarSide className="text-purple-600 text-2xl" />
          </div>
        </div>

        {/* Available Cars */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500">Available Cars</h4>
              <p className="text-lg font-bold mt-1">[vehicles Count]</p>
            </div>
            <FaCarSide className="text-purple-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Search Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Search */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Customers</h3>
          <input
            type="text"
            placeholder="Enter customer name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full mb-3"
          />
          <button
            onClick={handleCustomerSearch}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md w-full"
          >
            Search
          </button>
        </div>

        {/* Vehicle Search */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Vehicles</h3>
          <input
            type="text"
            placeholder="Enter vehicle name"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full mb-3"
          />
          <button
            onClick={handleVehicleSearch}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md w-full"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
