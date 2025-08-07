import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllFleets } from "@/store/Slices/fleet.slice";
import { useState, useMemo, useEffect } from "react";
import { FaCar, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";

const PosAllCars = ({ selectedCar, setSelectedCar }) => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { fleets, loading, error } = useSelector((state) => state?.fleet || {});

  useEffect(() => {
    dispatch(getAllFleets());
  }, [dispatch]);

  // Filter fleets by name or model
  const filteredCars = useMemo(() => {
    if (!search) return fleets;
    const lower = search.toLowerCase();
    return fleets.filter(
      (car) =>
        car.carName?.toLowerCase().includes(lower) ||
        car.model?.toLowerCase().includes(lower) || 
        car.registration?.toLowerCase().includes(lower)
    );
  }, [fleets, search]);

  // When a car is selected, set reference
  const handleSelectCar = (car) => {
    setSelectedCar(car);
  };

  return (
    <div className="">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex flex-col items-center gap-2 text-lg">
            <div className="flex items-center gap-2">
              <FaCar className="text-blue-600" size={26} />
              <h1 className="uppercase text-center">Service your car</h1>
            </div>
            <div className="relative w-full max-w-md mt-4 flex justify-center">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Car Name or Model"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-start"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <PuffLoader color="#9333ea" size={48} />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-red-500 font-semibold text-lg">{error}</span>
            </div>
          ) : (
            <>
              <div className="flex overflow-x-auto gap-4 pb-2">
                {filteredCars.map((car) => (
                  <Card
                    key={car.id || car._id}
                    className={`min-w-[220px] max-w-[250px] cursor-pointer transition-all duration-200 border-2 ${
                      selectedCar?.id === car.id || selectedCar?._id === car._id
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-400 hover:shadow-md"
                    }`}
                    onClick={() => handleSelectCar(car)}
                  >
                    <CardContent className="p-4 space-y-1">
                      <h3 className="font-bold text-gray-800 text-center text-lg">
                        {car.carName}
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        {car.registration}
                      </p>
                      <p className="text-xs text-gray-500 text-center">
                        Model: {car.model}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedCar && (
                <div className="mt-6 flex justify-center">
                  <div className="p-2 bg-purple-100 rounded-lg min-w-[250px] text-center shadow">
                    <p className="text-sm font-medium text-purple-800">
                      Selected: {selectedCar.carName} ({selectedCar.registration})
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PosAllCars;
