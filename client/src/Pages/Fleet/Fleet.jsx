
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Fleet = () => {
  const [form, setForm] = useState({
    carName: "",
    model: "",
    year: "",
    registration: "",
    insurance: "",
    fuel: "",
    owner: "",
    engine: "",
    color: "",
    type: "",
    vin: "",
    odometer: "",
    transmission: "",
    regExpiry: "",
    inspExpiry: "",
    businessUse: "",
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
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">Add Car to Fleet</h2>
        <Label htmlFor="carName">Car Name</Label>
        <Input id="carName" name="carName" type="text" placeholder="Car Name" value={form.carName} onChange={handleChange} required />
        <Label htmlFor="model">Model</Label>
        <Input id="model" name="model" type="text" placeholder="Model" value={form.model} onChange={handleChange} required />
        <Label htmlFor="year">Manufacturing Year</Label>
        <Input id="year" name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} required />
        <Label htmlFor="registration">Registration Number</Label>
        <Input id="registration" name="registration" type="text" placeholder="Registration Number" value={form.registration} onChange={handleChange} required />
        <Label htmlFor="insurance">Insurance</Label>
        <Input id="insurance" name="insurance" type="text" placeholder="Insurance" value={form.insurance} onChange={handleChange} required />
        <Label htmlFor="fuel">Fuel Type</Label>
        <Input id="fuel" name="fuel" type="text" placeholder="Fuel Type" value={form.fuel} onChange={handleChange} required />
        <Label htmlFor="owner">Owner</Label>
        <Input id="owner" name="owner" type="text" placeholder="Owner" value={form.owner} onChange={handleChange} required />
        <Label htmlFor="engine">Engine Number</Label>
        <Input id="engine" name="engine" type="text" placeholder="Engine Number" value={form.engine} onChange={handleChange} required />
        <Label htmlFor="color">Color</Label>
        <Input id="color" name="color" type="text" placeholder="Color" value={form.color} onChange={handleChange} required />
        <Label htmlFor="type">Type</Label>
        <Input id="type" name="type" type="text" placeholder="Type (e.g. SUV, Sedan)" value={form.type} onChange={handleChange} required />
        <Label htmlFor="vin">VIN Number</Label>
        <Input id="vin" name="vin" type="text" placeholder="VIN Number" value={form.vin} onChange={handleChange} required />
        <Label htmlFor="odometer">Odometer</Label>
        <Input id="odometer" name="odometer" type="number" placeholder="Odometer" value={form.odometer} onChange={handleChange} required />
        <Label htmlFor="transmission">Transmission</Label>
        <Input id="transmission" name="transmission" type="text" placeholder="Transmission" value={form.transmission} onChange={handleChange} required />
        <Label htmlFor="regExpiry">Expiry Date of Registration</Label>
        <Input id="regExpiry" name="regExpiry" type="date" value={form.regExpiry} onChange={handleChange} required />
        <Label htmlFor="inspExpiry">Vehicle Inspection Report Expiry Date</Label>
        <Input id="inspExpiry" name="inspExpiry" type="date" value={form.inspExpiry} onChange={handleChange} required />
        <Label htmlFor="businessUse">Business Use</Label>
        <Input id="businessUse" name="businessUse" type="text" placeholder="Business Use" value={form.businessUse} onChange={handleChange} required />
        <Button type="submit" className="bg-purple-700 text-white rounded px-4 py-2 font-semibold hover:bg-purple-800 transition-colors cursor-pointer">Add Car</Button>
      </form>
    </div>
  );
};

export default Fleet;
