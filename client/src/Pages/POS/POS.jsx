import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PosAllCars from "./PosAllCars";
import PosInventory from "./PosInventory";
import WalkInServiceCustomer from "./WalkInService";

const POS = () => {
  const location = useLocation();
  const isWalkIn = location.pathname.includes("walk-in");

  const [selectedCar, setSelectedCar] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 min-h-screen lg:ml-6">
      {!isWalkIn && (
        <div className="flex justify-end mb-2">
          <Link
            to="/dashboard/pos/history"
            className="inline-flex items-center hover:text-red-400 hover:underline gap-2 px-4 py-2 rounded-lg transition cursor-pointer"
          >
            <span className="text-xs uppercase">Service History</span>
          </Link>
        </div>
      )}
      {isWalkIn && (
        <div className="flex justify-end mb-2">
          <Link
            to="#"
            className="inline-flex items-center hover:text-red-400 hover:underline gap-2 px-4 py-2 rounded-lg transition cursor-pointer"
          >
            <span className="text-xs uppercase">Walk-in History</span>
          </Link>
        </div>
      )}

      {!isWalkIn && (
        <PosAllCars selectedCar={selectedCar} setSelectedCar={setSelectedCar} />
      )}

      {!isWalkIn && (
        <PosInventory
          cart={cart}
          setCart={setCart}
          selectedCar={isWalkIn ? null : selectedCar}
        />
      )}

      {/* This component is for walk-in service customers */}
      <WalkInServiceCustomer />
    </div>
  );
};

export default POS;
