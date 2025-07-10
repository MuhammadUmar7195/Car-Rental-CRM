import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { postFleet } from "@/store/Slices/fleet.slice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const FleetAddForm = ({ onAdd, onCancel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.fleet || {});

  const initialForm = {
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
  };

  const [form, setForm] = useState({ ...initialForm });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(postFleet(form)).unwrap(); 
      if (onAdd) onAdd(res); 
      setForm({ ...initialForm });
      onCancel();
    } catch (err) {
      console.error("Failed to add car:", err);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <h2 className="text-2xl font-bold text-purple-700 col-span-full text-center">
          Add Car to Fleet
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-6 right-8 text-gray-400 hover:text-purple-700 text-2xl focus:outline-none cursor-pointer z-10"
          aria-label="Close form"
        >
          <IoMdClose size={24} />
        </button>

        {[
          { label: "Model", name: "model", type: "text" },
          { label: "Manufacturing Year", name: "year", type: "number", min: 1900, max: new Date().getFullYear() },
          { label: "Registration Number", name: "registration", type: "text" },
          { label: "Fuel Type", name: "fuel", type: "text" },
          { label: "Insurance", name: "insurance", type: "text" },
          { label: "Owner", name: "owner", type: "text" },
          { label: "VIN Number", name: "vin", type: "text" },
          { label: "Engine Number", name: "engine", type: "text" },
          { label: "Color", name: "color", type: "text" },
          { label: "Type", name: "type", type: "text" },
          { label: "Odometer", name: "odometer", type: "number", min: 0 },
          { label: "Transmission", name: "transmission", type: "text" },
          { label: "Expiry Date", name: "regExpiry", type: "date" },
          {
            label: "Inspection Report Expiry Date",
            name: "inspExpiry",
            type: "date",
          },
          { label: "Business Use", name: "businessUse", type: "text" },
        ].map(({ label, name, type, ...rest }) => (
          <div key={name}>
            <Label htmlFor={name} className="mb-2 inline-block">{label}</Label>
            <Input
              id={name}
              name={name}
              type={type}
              placeholder={label}
              value={form[name]}
              onChange={handleChange}
              required
              {...rest}
            />
          </div>
        ))}

        <div className="col-span-full flex justify-end gap-3 mt-4">
          <Button
            type="submit"
            className="bg-purple-700 text-white cursor-pointer"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Car"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FleetAddForm;
