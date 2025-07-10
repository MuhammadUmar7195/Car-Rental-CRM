import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useNavigate } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";

const FleetCart = ({ filteredCars }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 w-full px-2 md:px-4">
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
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-2xl text-purple-800 truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[260px]">
                    {car.carName || "N/A"}
                  </h3>
                  <button
                    className="lg:ml-40 rounded-full hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 transition flex-shrink-0 cursor-pointer"
                    aria-label="Edit car"
                    onClick={() => navigate(`/dashboard/fleet/edit/${car._id}`)}
                    tabIndex={0}
                  >
                    <MdModeEditOutline className="w-5 h-5 text-purple-600" />
                  </button>
                </div>
                <div className="flex sm:flex-row gap-1 sm:gap-3 text-gray-500 text-sm">
                  <span className="font-semibold">
                    Model: <span className="font-normal">{car.model || "N/A"}</span>
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="font-semibold">
                    Year:{" "}
                    <span className="font-normal">
                      {car.year
                        ? new Date(car.year).toLocaleDateString("en-GB")
                        : ""}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">
                Plate: {car.registration || "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Color: {car.color || "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Fuel: {car.fuel || "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Type: {car.type || "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Owner: {car.owner || "N/A"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">
                VIN: {car.vin || "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Engine: {car.engine || "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Odometer: {car.odometer || "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Trans: {car.transmission || "N/A"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">
                Reg Expiry:{" "}
                {car.regExpiry
                  ? new Date(car.regExpiry).toLocaleDateString("en-GB")
                  : ""}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Inspection Expiry:{" "}
                {car.inspExpiry
                  ? new Date(car.inspExpiry).toLocaleDateString("en-GB")
                  : ""}
              </span>
            </div>
            <div className="mt-auto flex justify-between items-end pt-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={car.businessUse?.toLowerCase() === 'rented' ? 'destructive' : 'success'}
                  className="text-xs px-4 py-1 rounded-full font-semibold shadow-sm"
                >
                  {car.businessUse?.toLowerCase() === 'rented' ? 'Rented' : 'Available'}
                </Badge>              
              </div>
              <Button
                className="px-4 py-1 rounded-lg bg-purple-600 text-white text-xs font-semibold shadow hover:bg-purple-700 transition-colors cursor-pointer"
                type="button"
                onClick={() => navigate(`/dashboard/fleet/${car._id}`)}
              >
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FleetCart;
