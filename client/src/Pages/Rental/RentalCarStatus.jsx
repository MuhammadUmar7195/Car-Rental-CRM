import React, { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaCar } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { ChevronDown } from "lucide-react";

const RentalCarStatus = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAccordionChange = async (value) => {
    if (value === "car-list" && cars.length === 0) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fleet/get-car-status?businessUse=Available`,
          { withCredentials: true }
        );
        setCars(response.data.fleets || []);
      } catch (err) {
        console.error(err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <Card className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center space-y-6">
        <div className="text-purple-700 flex justify-center text-5xl -mb-0.5">
          <FaCar />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 -mb-0.5">Select Vehicle</h2>
        <Accordion
          type="single"
          collapsible
          onValueChange={handleAccordionChange}
          className="text-left"
        >
          <AccordionItem value="car-list">
            <AccordionTrigger className="flex items-center justify-between w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full transition">
              <span>Select available vehicle</span>
              <ChevronDown
                className="h-5 w-5 transition-transform duration-300 cursor-pointer"
                data-state="closed"
              />
            </AccordionTrigger>
            <AccordionContent className="mt-6 ml-4">
              {loading ? (
                <div className="flex justify-center py-4">
                  <PuffLoader size={30} color="#9333ea" />
                </div>
              ) : cars.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cars.map((car) => (
                    <li key={car._id} className="border-b pb-2 text-gray-600">
                      <strong className="text-purple-700">
                        {car.carName || car.model}
                      </strong>{" "}
                      - {car.registration}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">
                  No available vehicles found.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default RentalCarStatus;
