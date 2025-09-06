import HomeRentalHistory from "./HomeRentalHistory";
import { MdEventAvailable } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { FiTrendingUp } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { FaCarSide } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import axios from "axios";
import SearchRentalDateFilter from "./SearchRentalDateFilter";

const Home = () => {
  const [customer, setCustomer] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [totalCars, setTotalCars] = useState(0);
  const [availableCars, setAvailableCars] = useState(0);
  const [sales, setSales] = useState(0);

  // Filter states for HomeRentalHistory
  const [customerFilter, setCustomerFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

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
          setSales(response.data.totalSales || 0);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCounts();
  }, []);

  // Handle customer search and filter
  const handleCustomerSearch = () => {
    if (customer.trim()) {
      setCustomerFilter(customer.trim());
      setVehicleFilter(""); // Clear vehicle filter when searching for customer
    }
  };

  // Handle vehicle search and filter
  const handleVehicleSearch = () => {
    if (vehicle.trim()) {
      setVehicleFilter(vehicle.trim());
      setCustomerFilter(""); // Clear customer filter when searching for vehicle
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setCustomer("");
    setVehicle("");
    setCustomerFilter("");
    setVehicleFilter("");
  };

  // Handle Enter key press
  const handleKeyPress = (e, searchType) => {
    if (e.key === "Enter") {
      if (searchType === "customer") {
        handleCustomerSearch();
      } else {
        handleVehicleSearch();
      }
    }
  };

  // Check if any filters are active
  const hasActiveFilters = customerFilter || vehicleFilter;

  return (
    <div className="space-y-8 lg:pl-10">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sales Card */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm text-gray-500">Sales</h4>
              <p className="text-lg font-bold mt-1">$ {sales}</p>
              <p className="text-xs text-gray-400 mt-1">Total Sales</p>
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
          <h3 className="text-lg font-semibold uppercase mb-4">Customers</h3>

          <div className="relative mb-3">
            <Input
              type="text"
              placeholder="Enter customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, "customer")}
              className="border border-gray-300 px-4 py-6 pr-12 rounded-md w-full"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-600"
              size={20}
              onClick={handleCustomerSearch}
            />
          </div>

          <Button
            onClick={handleCustomerSearch}
            className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-md w-full cursor-pointer"
          >
            Search Customer
          </Button>
        </div>

        {/* Vehicle Search */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold uppercase mb-4">Vehicles</h3>
          <div className="relative mb-3">
            <Input
              type="text"
              placeholder="Enter vehicle name"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, "vehicle")}
              className="border border-gray-300 px-4 py-6 pr-12 rounded-md w-full"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-purple-600"
              size={20}
              onClick={handleVehicleSearch}
            />
          </div>

          <Button
            onClick={handleVehicleSearch}
            className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-md w-full cursor-pointer"
          >
            Search Vehicle
          </Button>
        </div>
      </div>

      {/* Active Filters & Reset Button */}
      {hasActiveFilters && (
        <div className="bg-white shadow-md rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Active Filter:
              </span>
              {customerFilter && (
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Customer: {customerFilter}
                </div>
              )}
              {vehicleFilter && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Vehicle: {vehicleFilter}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 cursor-pointer"
            >
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Rental History with Filters */}
      <HomeRentalHistory
        customerFilter={customerFilter}
        vehicleFilter={vehicleFilter}
        onResetFilters={handleResetFilters}
      />
      <SearchRentalDateFilter />
    </div>
  );
};

export default Home;
