import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { PuffLoader } from "react-spinners";
import InventoryAddForm from "./InventoryAddForm";
import InventoryCart from "./InventoryCart";
import { getAllInventory } from "@/store/Slices/inventory.slice";

const Inventory = () => {
  const dispatch = useDispatch();
  const { inventory = [], loading } = useSelector((state) => state?.inventory) || {};

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getAllInventory());
  }, [dispatch]);

  const filteredInventory = Array.isArray(inventory)
    ? inventory.filter((car) => {
        const query = search.toLowerCase();
        return (
          (car.carName && car.carName.toLowerCase().includes(query)) ||
          (car.carModel && car.carModel.toLowerCase().includes(query))
        );
      })
    : [];

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleAdd = () => {
    setShowForm(false);
    dispatch(getAllInventory());
  };

  return (
    <div className="min-h-screen flex flex-col items-start px-2 py-8">
      {/* Top Controls */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search vehicle"
          className="border border-orange-400 w-full md:w-1/2 max-w-md mx-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg shadow-md"
          onClick={() => setShowForm(true)}
        >
          <IoIosAdd size={22} />
          Add Car
        </Button>
      </div>

      {/* Add Car Form */}
      {showForm && (
        <div className="w-full flex justify-center mb-8">
          <div className="w-full max-w-6xl px-4">
            <InventoryAddForm onAdd={handleAdd} onCancel={handleCancel} />
          </div>
        </div>
      )}

      {/* Car Cards */}
      <div className="w-full max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
            <PuffLoader color="#9333ea" size={80} speedMultiplier={1.2} />
          </div>
        ) : (
          <InventoryCart filteredInventory={filteredInventory} />
        )}
      </div>
    </div>
  );
};

export default Inventory;
