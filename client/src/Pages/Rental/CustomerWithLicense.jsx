import React, { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PuffLoader } from "react-spinners";
import { FaUser } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { AlertCircle, RefreshCw } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

const CustomerWithLicense = ({ onCustomerSelect }) => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Please enter a name or license number");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/customer/customer-search?query=${encodeURIComponent(
          search.trim()
        )}`,
        { withCredentials: true }
      );

      if (response?.data?.customers && response.data.customers.length > 0) {
        setCustomers(response.data.customers);
        setError("");
      } else {
        setCustomers([]);
        setError("No customers found matching your search");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Error searching customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    if (selectedCustomer?._id === customer._id) {
      setSelectedCustomer(null);
      onCustomerSelect(null);
    } else {
      setSelectedCustomer(customer);
      onCustomerSelect(customer);
    }
  };

  const handleRetry = () => {
    if (search.trim()) {
      handleSearch();
    }
  };

  // Filter customers by name or license number in real-time
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.licenseNo?.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="bg-white p-6 rounded-xl shadow-md w-full">
      <div className="flex flex-col items-center mb-4">
        <FaUser className="text-purple-600 text-5xl mb-2" />
        <h2 className="text-xl font-bold text-purple-700 mt-5 uppercase">
          Customer Details
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-semibold mb-1 text-gray-700 -mt-6">
            Search Customer
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="text"
              placeholder="Search by customer name or license number"
              className="flex-1 border border-purple-300 focus:border-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button
              onClick={handleSearch}
              disabled={loading || !search.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition whitespace-nowrap"
            >
              {loading ? <PuffLoader size={20} color="#ffffff" /> : "Search"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <PuffLoader size={30} color="#9333ea" />
          </div>
        ) : error ? (
          <div className="py-4">
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <AlertCircle className="text-red-500" size={40} />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
              {hasSearched && (
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="mt-2 text-purple-600 border-purple-300 hover:bg-purple-50 cursor-pointer"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="max-h-48 overflow-y-auto">
            <ul className="space-y-2">
              {filteredCustomers.map((customer) => {
                const isSelected = selectedCustomer?._id === customer._id;
                const isDisabled = selectedCustomer && !isSelected;

                return (
                  <li
                    key={customer._id}
                    className={`p-2 rounded flex items-center justify-between transition-all duration-200
                      ${
                        isSelected
                          ? "bg-purple-100 font-semibold"
                          : "hover:bg-gray-100"
                      }
                      ${
                        isDisabled
                          ? "opacity-50 pointer-events-none"
                          : "cursor-pointer"
                      }
                    `}
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-purple-700">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        License: {customer.licenseNo} • Phone: {customer.phone}
                      </div>
                    </div>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, rotate: -90, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0, rotate: 90, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          className="ml-2"
                        >
                          <FaRegCircleCheck
                            className="text-green-500"
                            size={22}
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : hasSearched && search ? (
          <div className="text-sm text-gray-500 py-2 text-center">
            No customers found matching "{search}".
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default CustomerWithLicense;
