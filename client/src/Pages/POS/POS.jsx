import { useState } from "react";
import { Link } from "react-router-dom";
import PosAllCars from "./PosAllCars";
import PosInventory from "./PosInventory";

const POS = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 min-h-screen lg:ml-6">
       <div className="flex justify-end mb-2">
          <Link
            to="/dashboard/pos/history"
            className="inline-flex items-center hover:text-red-400 hover:underline gap-2 px-4 py-2 rounded-lg transition cursor-pointer"
          >
            <span className="text-xs uppercase">Service History</span>
          </Link>
        </div>
      <PosAllCars selectedCar={selectedCar} setSelectedCar={setSelectedCar} />
      <PosInventory cart={cart} setCart={setCart} selectedCar={selectedCar} />
    </div>
  );
};

export default POS;
