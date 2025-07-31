import { useState } from "react";
import RentalCarStatus from "./RentalCarStatus";
import CustomerWithLicense from "./CustomerWithLicense";
import RentalForm from "./RentalForm";
import { Link } from "react-router-dom";

const RentalFlow = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8 uppercase">
          Car Rental Process
        </h1>
        <div className="flex justify-end mb-2">
          <Link
            to="/dashboard/rental-history"
            className="inline-flex items-center hover:text-red-400 hover:underline gap-2 px-4 py-2 rounded-lg transition cursor-pointer"
          >
            <span className="text-xs uppercase">Rental History</span>
          </Link>
        </div>

        {/* The car selection and customer details */}
        <div className="grid md:grid-cols-2 gap-6">
          <RentalCarStatus onCarSelect={setSelectedCar} />
          <CustomerWithLicense onCustomerSelect={setSelectedCustomer} />
        </div>

        {selectedCar && selectedCustomer && (
          <RentalForm
            selectedCar={selectedCar}
            selectedCustomer={selectedCustomer}
          />
        )}
      </div>
    </div>
  );
};

export default RentalFlow;
