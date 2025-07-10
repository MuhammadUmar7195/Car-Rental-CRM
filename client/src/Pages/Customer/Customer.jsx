
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Customer = () => {
  const [form, setForm] = useState({
    license: "",
    name: "",
    dcNumber: "",
    state: "",
    postal: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">Add Customer</h2>
        <Label htmlFor="license">Customer License No</Label>
        <Input id="license" name="license" type="text" placeholder="License Number" value={form.license} onChange={handleChange} required />
        <Label htmlFor="name">Customer Name</Label>
        <Input id="name" name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <Label htmlFor="dcNumber">DC Number</Label>
        <Input id="dcNumber" name="dcNumber" type="text" placeholder="DC Number" value={form.dcNumber} onChange={handleChange} required />
        <Label htmlFor="state">State</Label>
        <Input id="state" name="state" type="text" placeholder="State" value={form.state} onChange={handleChange} required />
        <Label htmlFor="postal">Postal Code</Label>
        <Input id="postal" name="postal" type="text" placeholder="Postal Code" value={form.postal} onChange={handleChange} required />
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <Label htmlFor="address">Address</Label>
        <textarea
          id="address"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[80px]"
        />
        <Button type="submit" className="bg-purple-700 text-white rounded px-4 py-2 font-semibold hover:bg-purple-800 transition-colors cursor-pointer">Add Customer</Button>
      </form>
    </div>
  );
};

export default Customer;
