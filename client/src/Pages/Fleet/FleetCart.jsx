import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const FleetCart = ({ filteredCars }) => {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {filteredCars.map((car, index) => (
        <Card
          key={index}
          className="shadow-xl border-0 rounded-3xl bg-gradient-to-br from-purple-50 to-white hover:shadow-2xl transition-all duration-300"
        >
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold border-2 border-purple-200">
                {car.model?.[0] || "C"}
              </div>
              <div>
                <h3 className="font-bold text-2xl text-purple-800 mb-1">
                  {car.carName || car.model}
                </h3>
                <div className="flex sm:flex-row gap-1 sm:gap-3 text-gray-500 text-sm">
                  <span className="font-semibold">Model: <span className="font-normal">{car.model}</span></span>
                  <span className="hidden sm:inline">|</span>
                  <span className="font-semibold">Year: <span className="font-normal">{car.year ? new Date(car.year).toLocaleDateString('en-GB') : ''}</span></span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">Plate: {car.registration}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Color: {car.color}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Fuel: {car.fuel}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Type: {car.type}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Owner: {car.owner}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">VIN: {car.vin}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Engine: {car.engine}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Odometer: {car.odometer}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Trans: {car.transmission}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">Reg Expiry: {car.regExpiry ? new Date(car.regExpiry).toLocaleDateString('en-GB') : ''}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Inspection Expiry: {car.inspExpiry ? new Date(car.inspExpiry).toLocaleDateString('en-GB') : ''}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Business: {car.businessUse}</span>
            </div>
            <div className="mt-auto flex justify-between items-end pt-4">
              <span
                className={`inline-block px-4 py-1 rounded-full text-xs font-semibold shadow-sm ${
                  parseInt(car.odometer) > 100000
                    ? "bg-red-100 text-red-600 border border-red-200"
                    : "bg-green-100 text-green-700 border border-green-200"
                }`}
              >
                {parseInt(car.odometer) > 100000 ? "Inactive" : "Active"}
              </span>
              <span className="text-xs text-gray-400">#{car.registration?.slice?.(-4) || index + 1}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FleetCart;
