import { useState } from "react";
import PosAllCars from "./PosAllCars";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCashRegister } from "react-icons/fa";
import PosInventory from "./PosInventory";

const POS = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 min-h-screen lg:ml-6">
      <PosAllCars selectedCar={selectedCar} setSelectedCar={setSelectedCar} />
      <PosInventory cart={cart} setCart={setCart} selectedCar={selectedCar} />
    </div>
  );
};

export default POS;
