
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

const Rental = () => {
  const {user}= useSelector((state) => state?.auth);
  
  const [form, setForm] = useState({
    license: "",
    expiry: "",
    name: "",
    phone: "",
    state: "",
    postal: "",
    email: "",
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
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">Car Rental License Form</h2>
        <Label htmlFor="license">License Number</Label>
        <Input
          id="license"
          name="license"
          type="text"
          placeholder="Enter license number"
          value={form.license}
          onChange={handleChange}
          required
        />
        <Label htmlFor="expiry">Date of Expiry</Label>
        <Input
          id="expiry"
          name="expiry"
          type="date"
          value={form.expiry}
          onChange={handleChange}
          required
        />
        <Label htmlFor="name">Name of Person</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Label htmlFor="phone">Contact Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Enter phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          name="state"
          type="text"
          placeholder="Enter state"
          value={form.state}
          onChange={handleChange}
          required
        />
        <Label htmlFor="postal">Postal Code</Label>
        <Input
          id="postal"
          name="postal"
          type="text"
          placeholder="Enter postal code"
          value={form.postal}
          onChange={handleChange}
          required
        />
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={form.email || user?.email}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          className="bg-purple-700 text-white rounded px-4 py-2 font-semibold hover:bg-purple-800 transition-colors cursor-pointer"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Rental;
