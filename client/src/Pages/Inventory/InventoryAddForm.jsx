import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { postInventory } from "@/store/Slices/inventory.slice";

const InventoryAddForm = ({ onAdd, onCancel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.inventory || {});

  const initialForm = {
    carName: "",
    carModel: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
  };

  const [form, setForm] = useState({ ...initialForm });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(postInventory(form)).unwrap();
      if (onAdd) onAdd(res);
      setForm({ ...initialForm });
      if (onCancel) onCancel();
    } catch (err) {
      console.error("Failed to add inventory:", err);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <h2 className="text-2xl font-bold text-purple-700 col-span-full text-center uppercase">
          Add Inventory
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
          { label: "Name", name: "carName", type: "text" },
          { label: "Model", name: "carModel", type: "text" },
          { label: "Quantity", name: "quantity", type: "number", min: 0 },
          { label: "Cost Price", name: "costPrice", type: "number", min: 0 },
          { label: "Selling Price", name: "sellingPrice", type: "number", min: 0 },
        ].map(({ label, name, type, ...rest }) => (
          <div key={name}>
            <Label htmlFor={name} className="mb-2 inline-block">
              {label} <span className="text-red-500">*</span>
            </Label>
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
            {loading ? "Adding..." : "Add Inventory"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InventoryAddForm;
