import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { FaCar } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { Input } from "@/components/ui/input";

const RentalCarStatus = ({ onCarSelect }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fleet/get-car-status?status=Available`,
          { withCredentials: true }
        );
        setCars(response.data.fleets || []);
      } catch (err) {
        console.error(err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    onCarSelect(car);
  };

  // Filter cars by carName or registration
  const filteredCars = cars.filter(
    (car) =>
      car.carName?.toLowerCase().includes(search.toLowerCase()) ||
      car.registration?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-white p-6 rounded-xl shadow-md w-full">
      <div className="text-purple-700 flex justify-center text-4xl ">
        <FaCar size={60}/>
      </div>
      <h2 className="text-xl font-semibold text-purple-700 text-center uppercase">Select Vehicle</h2>
      <Input
        type="text"
        placeholder="Search by car name or registration"
        className="mt-2 border border-purple-300"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <div className="flex justify-center py-4">
          <PuffLoader size={30} color="#9333ea" />
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="max-h-48 overflow-y-auto">
          <ul className="space-y-2">
            {filteredCars.map((car) => (
              <li
                key={car._id}
                className={`p-2 rounded cursor-pointer ${selectedCar?._id === car._id ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                onClick={() => handleCarSelect(car)}
              >
                <strong className="text-purple-700">{car.carName}</strong> - {car.model} ({car.registration})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-sm text-gray-500 py-2">No available vehicles found.</div>
      )}
    </Card>
  );
};

export default RentalCarStatus;
