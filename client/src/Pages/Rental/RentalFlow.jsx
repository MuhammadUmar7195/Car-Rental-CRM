import { useState } from "react";
import RentalCarStatus from "./RentalCarStatus";
import CustomerWithLicense from "./CustomerWithLicense";
import RentalForm from "./RentalForm";

const RentalFlow = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Car Rental Process</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <RentalCarStatus onCarSelect={setSelectedCar} />
          <CustomerWithLicense onCustomerSelect={setSelectedCustomer} />
        </div>

        {selectedCar && selectedCustomer && (
          <RentalForm selectedCar={selectedCar} selectedCustomer={selectedCustomer} />
        )}
      </div>
    </div>
  );
};

export default RentalFlow;