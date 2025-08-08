import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { postFleet } from "@/store/Slices/fleet.slice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const FleetAddForm = ({ onAdd, onCancel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.fleet || {});

  const initialForm = {
    carName: "",
    model: "",
    year: "",
    pricePerDay: "",
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
    category: "",
    status: "",
  };

  const [form, setForm] = useState({ ...initialForm });

  // Category options based on your enum
  const categoryOptions = [
    {
      value: "Economy",
      label: "Economy",
      description: "Budget-friendly vehicles",
    },
    {
      value: "Luxury",
      label: "Luxury",
      description: "Premium high-end vehicles",
    },
    { value: "SUV", label: "SUV", description: "Sport Utility Vehicles" },
    {
      value: "Sports",
      label: "Sports",
      description: "High-performance sports cars",
    },
  ];

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
        <h2 className="text-2xl font-bold text-purple-700 col-span-full text-center uppercase">
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
          "carName",
          "model",
          "year",
          "pricePerDay",
          "registration",
          "fuel",
          "insurance",
          "owner",
          "vin",
          "engine",
          "color",
          "type",
          "odometer",
          "transmission",
          "regExpiry",
          "inspExpiry",
          "businessUse",
        ].map((name) => {
          const labelMap = {
            carName: "Car Name",
            model: "Model",
            year: "Manufacturing Year",
            pricePerDay: "Price Per Day",
            registration: "Registration Number",
            fuel: "Fuel Type",
            insurance: "Insurance",
            owner: "Owner",
            vin: "VIN Number",
            engine: "Engine Number",
            color: "Color",
            type: "Type",
            odometer: "Odometer",
            transmission: "Transmission",
            regExpiry: "Expiry Date",
            inspExpiry: "Inspection Report Expiry Date",
            businessUse: "Business Use",
          };
          const typeMap = {
            year: "date",
            regExpiry: "date",
            inspExpiry: "date",
            odometer: "number",
            pricePerDay: "number",
          };
          const stepMap = {
            pricePerDay: "0.01",
          };
          const minMap = {
            pricePerDay: "0",
            odometer: "0",
          };

          return (
            <div key={name}>
              <Label htmlFor={name} className="mb-2 inline-block">
                {labelMap[name]} <span className="text-red-500">*</span>
              </Label>
              <Input
                id={name}
                name={name}
                type={typeMap[name] || "text"}
                step={stepMap[name]}
                min={minMap[name]}
                placeholder={labelMap[name]}
                value={form[name]}
                onChange={handleChange}
                required
              />
            </div>
          );
        })}

        {/* Category Accordion */}
        <div className="col-span-full">
          <Label className="mb-2 inline-block">
            Category <span className="text-red-500">*</span>
          </Label>
          <Accordion type="single" collapsible>
            <AccordionItem value="category">
              <AccordionTrigger className="bg-white text-purple-700 px-4 py-3 rounded-xl font-semibold border border-gray-300">
                {form.category
                  ? `Selected: ${form.category}`
                  : "Select Category"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2 py-2">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                        form.category === option.value
                          ? "bg-purple-100 border-purple-400 text-purple-700 shadow-md"
                          : "bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50 cursor-pointer"
                      }`}
                      onClick={() =>
                        setForm({ ...form, category: option.value })
                      }
                    >
                      <div className="font-semibold text-lg">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Status Accordion */}
        <div className="col-span-full">
          <Label className="mb-2 inline-block">
            Status <span className="text-red-500">*</span>
          </Label>
          <Accordion type="single" collapsible>
            <AccordionItem value="status">
              <AccordionTrigger className="bg-white text-purple-700 px-4 py-3 rounded-xl font-semibold border border-gray-300">
                {form.status ? `Selected: ${form.status}` : "Select Status"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 px-2 py-2">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      form.status === "Available"
                        ? "bg-green-100 border-green-400 text-green-700 shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50 cursor-pointer"
                    }`}
                    onClick={() => setForm({ ...form, status: "Available" })}
                  >
                    <div className="font-semibold">Available</div>
                    <div className="text-sm">Ready for rental</div>
                  </button>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      form.status === "Rented"
                        ? "bg-red-100 border-red-400 text-red-700 shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50 cursor-pointer"
                    }`}
                    onClick={() => setForm({ ...form, status: "Rented" })}
                  >
                    <div className="font-semibold">Rented</div>
                    <div className="text-sm">Currently unavailable</div>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="col-span-full flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-700 text-white cursor-pointer px-6 py-2"
            disabled={loading || !form.category || !form.status}
          >
            {loading ? "Adding..." : "Add Car"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FleetAddForm;
