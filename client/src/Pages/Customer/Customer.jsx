import React, { useEffect, useState } from "react";
import CustomerCart from "./CustomerCart";
import CustomerAddForm from "./CustomerAddForm";
import { PuffLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { IoIosAdd } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllCustomers } from "@/store/Slices/customer.slice";

const Customer = () => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state?.customer) || {};

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  const filteredCustomers = customers?.filter((customer) => {
    const query = search.toLowerCase();
    return (
      (customer.name && customer.name.toLowerCase().includes(query)) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.phone && customer.phone.toLowerCase().includes(query)) ||
      (customer.licenseNo && customer.licenseNo.toLowerCase().includes(query))
    );
  }) || [];

  // Handler for cancelling add form
  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-start px-2 py-8">
      {/* Top Controls */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search customers by name, email, phone, or license"
          className="border border-orange-400 w-full md:w-1/2 max-w-md mx-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg shadow-md"
          onClick={() => setShowForm(true)}
        >
          <IoIosAdd size={22} />
          Add Customer
        </Button>
      </div>

      {/* Add Customer Form */}
      {showForm && (
        <div className="w-full flex justify-center mb-8">
          <div className="w-full max-w-6xl px-4">
            <CustomerAddForm onCancel={handleCancel} />
          </div>
        </div>
      )}

      {/* Customer Cards */}
      <div className="w-full max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
            <PuffLoader color="#9333ea" size={80} speedMultiplier={1.2} />
          </div>
        ) : (
          <CustomerCart filteredCustomers={filteredCustomers} />
        )}
      </div>
    </div>
  );
};

export default Customer;
