import { FiTrendingUp } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdEventAvailable } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [customer, setCustomer] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [totalCars, setTotalCars] = useState(0);
  const [availableCars, setAvailableCars] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fleet/get-count`,
          {
            withCredentials: true,
          }
        );
        if (response?.data?.success) {
          setTotalCars(response.data.totalCars || 0);
          setAvailableCars(response.data.availableCars || 0);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCounts();
  }, []);

  const handleCustomerSearch = () => {
    console.log("Search customer:", customer);
    navigate("/dashboard/customer");
  };
  
  const handleVehicleSearch = () => {
    console.log("Search vehicle:", vehicle);
    navigate("/dashboard/fleet");
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
              <p className="text-lg font-bold mt-1">{totalCars}</p>
            </div>
            <FaCarSide className="text-purple-600 text-2xl" size={30} />
          </div>
        </div>

        {/* Available Cars */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500">Available Cars</h4>
              <p className="text-lg font-bold mt-1">{availableCars}</p>
            </div>
            <MdEventAvailable className="text-purple-600 text-2xl" size={30} />
          </div>
        </div>
      </div>

      {/* Search Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Search */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 uppercase">Customers</h3>
          <Input
            type="text"
            placeholder="Enter customer name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="border border-gray-300 px-4 py-6 rounded-md w-full mb-3"
          />
          <Button
            onClick={handleCustomerSearch}
            className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-md w-full cursor-pointer"
          >
            Search
          </Button>
        </div>

        {/* Vehicle Search */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 uppercase">Vehicles</h3>
          <Input
            type="text"
            placeholder="Enter vehicle name"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="border border-gray-300 px-4 py-6 rounded-md w-full mb-3"
          />
          <Button
            onClick={handleVehicleSearch}
            className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-md w-full cursor-pointer"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
