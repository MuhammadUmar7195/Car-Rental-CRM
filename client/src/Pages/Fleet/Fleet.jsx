import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFleets } from "@/store/Slices/fleet.slice";
import { IoIosAdd } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FleetCart from "./FleetCart";
import FleetAddForm from "./FleetAddForm";

const Fleet = () => {
  const dispatch = useDispatch();
  const { fleets, loading } = useSelector((state) => state.fleet) || {};

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getAllFleets());
  }, [dispatch]);

  const filteredCars = fleets.filter((car) => {
    const query = search.toLowerCase();
    return (
      (car.carName && car.carName.toLowerCase().includes(query)) ||
      (car.model && car.model.toLowerCase().includes(query)) ||
      (car.registration && car.registration.toLowerCase().includes(query))
    );
  });

  // Handler for cancelling add form
  const handleCancel = () => {
    setShowForm(false);
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
            <FleetAddForm onCancel={handleCancel} />
          </div>
        </div>
      )}

      {/* Car Cards */}
      <div className="w-full max-w-6xl mx-auto">
        {loading ? (
          <div className="col-span-full text-center text-lg text-gray-500 py-10">
            Loading cars...
          </div>
        ) : (
          <FleetCart filteredCars={filteredCars} />
        )}
      </div>
    </div>
  );
};

export default Fleet;
