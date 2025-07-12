import React, { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PuffLoader } from "react-spinners";
import { FaUser } from "react-icons/fa";
import { Label } from "@/components/ui/label";

const CustomerWithLicense = ({ onCustomerSelect }) => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!licenseNumber.trim()) {
      setError("Please enter a license number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/customer/license/${licenseNumber}`,
        { withCredentials: true }
      );
      if (response?.data?.customer) {
        setCustomer(response.data.customer);
        onCustomerSelect(response.data.customer);
        setError("");
      } else {
        setError("Customer not found");
        setCustomer(null);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching customer data");
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white p-6 rounded-xl shadow-md w-full">
      <div className="flex flex-col items-center mb-4">
        <FaUser className="text-purple-600 text-5xl mb-2" />
        <h2 className="text-xl font-bold text-purple-700 mt-5 uppercase">Customer Details</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-semibold mb-1 text-gray-700 -mt-6">
            Driver's License Number
          </Label>
          <div className="flex gap-2">
            <Input
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Enter license number"
              className="border border-purple-300 focus:border-purple-500"
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition"
            >
              {loading ? <PuffLoader size={20} color="#ffffff" /> : "Search"}
            </Button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {customer && (
          <div className="border-t pt-4 mt-2">
            <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <FaUser className="text-purple-500" /> Customer Found
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700 text-sm">
              <div>
                <span className="font-medium">Name:</span> {customer.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {customer.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {customer.phone}
              </div>
              <div>
                <span className="font-medium">License No:</span> {customer.licenseNo}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CustomerWithLicense;
