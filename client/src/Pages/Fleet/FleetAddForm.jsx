import React, { useState } from "react";
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
                placeholder={labelMap[name]}
                value={form[name]}
                onChange={handleChange}
                required
              />
            </div>
          );
        })}

        {/* Status Accordion */}
        <div className="col-span-full">
          <Label className="mb-2 inline-block">Status</Label>
          <Accordion type="single" collapsible>
            <AccordionItem value="status">
              <AccordionTrigger className="bg-white text-purple-700 px-4 py-3 rounded-xl font-semibold">
                {form.status ? `Selected: ${form.status}` : "Select Status"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 px-2 py-2">
                  <button
                    type="button"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      form.status === "Available"
                        ? "bg-purple-100 border-purple-400 text-purple-700"
                        : "bg-white border-gray-300 text-gray-700 cursor-pointer"
                    }`}
                    onClick={() => setForm({ ...form, status: "Available" })}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      form.status === "Rented"
                        ? "bg-purple-100 border-purple-400 text-purple-700"
                        : "bg-white border-gray-300 text-gray-700 cursor-pointer"
                    }`}
                    onClick={() => setForm({ ...form, status: "Rented" })}
                  >
                    Rented
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

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
