import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FaCar } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import { FaRegCircleCheck } from "react-icons/fa6";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import useAvailableCars from "@/hooks/useAvailableCars";

const RentalCarStatus = ({ onCarSelect }) => {
  const { cars, loading, error, refetch } = useAvailableCars();
  const [selectedCar, setSelectedCar] = useState(null);
  const [search, setSearch] = useState("");

  const handleCarSelect = (car) => {
    if (selectedCar?._id === car._id) {
      setSelectedCar(null);
      onCarSelect(null);
    } else {
      setSelectedCar(car);
      onCarSelect(car);
    }
  };

  // Filter cars by carName or registration
  const filteredCars = cars.filter(
    (car) =>
      car.carName?.toLowerCase().includes(search.toLowerCase()) ||
      car.registration?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRetry = () => {
    if (refetch) {
      refetch();
    } else {
      // If refetch is not available, reload the page
      window.location.reload();
    }
  };

  return (
    <Card className="bg-white p-6 rounded-xl shadow-md w-full">
      <div className="text-purple-700 flex justify-center text-4xl ">
        <FaCar size={60} />
      </div>
      <h2 className="text-xl font-semibold text-purple-700 text-center uppercase">
        Select Vehicle
      </h2>

      <Input
        type="text"
        placeholder="Search by car name or registration"
        className="mt-2 border border-purple-300"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={loading || error}
      />

      {loading ? (
        <div className="flex justify-center py-4">
          <PuffLoader size={30} color="#9333ea" />
        </div>
      ) : error ? (
        <div className="py-4">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <AlertCircle className="text-red-500" size={40} />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600">
                Failed to load vehicles
              </p>
              <p className="text-xs text-gray-500">
                {error || "Something went wrong while fetching available cars"}
              </p>
            </div>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="mt-2 text-purple-600 border-purple-300 hover:bg-purple-50 cursor-pointer"
            >
              <RefreshCw size={14} className="mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="max-h-48 overflow-y-auto">
          <ul className="space-y-2">
            {filteredCars.map((car) => {
              const isSelected = selectedCar?._id === car._id;
              const isDisabled = selectedCar && !isSelected;
              return (
                <li
                  key={car._id}
                  className={`p-2 rounded flex items-center justify-between transition-all duration-200
                    ${
                      isSelected
                        ? "bg-purple-100 font-semibold"
                        : "hover:bg-gray-100"
                    }
                    ${
                      isDisabled
                        ? "opacity-50 pointer-events-none"
                        : "cursor-pointer"
                    }
                  `}
                  onClick={() => handleCarSelect(car)}
                >
                  <span>
                    <strong className="text-purple-700">{car.carName}</strong> -{" "}
                    {car.model} ({car.registration})
                  </span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, rotate: -90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 90, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className="ml-2"
                      >
                        <FaRegCircleCheck
                          className="text-green-500"
                          size={22}
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      ) : search ? (
        <div className="text-sm text-gray-500 py-2 text-center">
          No vehicles found matching "{search}".
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-2 text-center">
          No available vehicles found.
        </div>
      )}
    </Card>
  );
};

export default RentalCarStatus;
