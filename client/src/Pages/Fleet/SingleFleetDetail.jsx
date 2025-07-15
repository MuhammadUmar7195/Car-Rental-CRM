import React, { useEffect } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleFleet } from "../../store/Slices/fleet.slice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PuffLoader } from "react-spinners";
import FleetHistory from "./FleetHistory";

const SingleFleetDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleFleet, loading, error } =
    useSelector((state) => state.fleet) || {};

  useEffect(() => {
    if (!singleFleet || singleFleet._id !== id) {
      dispatch(getSingleFleet(id));
    }
  }, [dispatch, id, singleFleet]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <PuffLoader color="#9333ea" size={80} speedMultiplier={1.2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-lg text-red-500">
        {error}{" "}
        <Button variant="link" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!singleFleet) {
    return (
      <div className="text-center py-10 text-lg text-gray-500">
        Car not found.{" "}
        <Button variant="link" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const car = singleFleet;
  const isRented = car.status?.toLowerCase() === "rented";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-muted">
      <Card className="w-full max-w-5xl shadow-xl rounded-3xl bg-white p-4 md:p-6">
        <CardHeader className="flex flex-col items-center text-center relative">
          <Button
            onClick={() => navigate(`/dashboard/fleet`)}
            className="absolute left-4 top-4 px-3 py-2 font-semibold bg-purple-700 text-white hover:bg-purple-800 cursor-pointer rounded-full"
          >
            <IoChevronBackSharp />
          </Button>
          <CardTitle className="text-3xl font-bold text-purple-800 mb-2 uppercase">
            {car.carName || "N/A"}
          </CardTitle>
          <CardDescription>
            <Badge
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                isRented
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {car?.status || "N/A"}
            </Badge>
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Section */}
            <div className="space-y-2 text-sm text-gray-700">
              <Info label="Model" value={car.model} />
              <Info
                label="Year"
                value={
                  car.year ? new Date(car.year).toLocaleDateString("en-GB") : ""
                }
              />
              <Info label="Registration" value={car.registration || "N/A"} />
              <Info label="Color" value={car.color || "N/A"} />
              <Info label="Fuel" value={car.fuel || "N/A"} />
              <Info label="Type" value={car.type || "N/A"} />
              <Info label="Owner" value={car.owner || "N/A"} />
            </div>

            {/* Right Section */}
            <div className="space-y-2 text-sm text-gray-700">
              <Info label="VIN" value={car.vin || "N/A"} />
              <Info label="Engine" value={car.engine || "N/A"} />
              <Info label="Odometer" value={car.odometer || "N/A"} />
              <Info label="Transmission" value={car.transmission || "N/A"} />
              <Info label="Business Use" value={car.businessUse || "N/A"} />
              <Info
                label="Reg Expiry"
                value={
                  car.regExpiry
                    ? new Date(car.regExpiry).toLocaleDateString("en-GB")
                    : ""
                }
              />
              <Info
                label="Inspection Expiry"
                value={
                  car.inspExpiry
                    ? new Date(car.inspExpiry).toLocaleDateString("en-GB")
                    : ""
                }
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              onClick={() => alert("Rental feature coming soon!")}
              className="px-6 py-2 font-semibold border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 cursor-pointer"
            >
              Rental
            </Button>
            <Button
              variant="outline"
              onClick={() => alert("Service feature coming soon!")}
              className="px-6 py-2 font-semibold border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 cursor-pointer"
            >
              Service
            </Button>
          </div>
        </CardContent>
      </Card>
      <FleetHistory fleetId={id}/>
    </div>
  );
};

// Small reusable field display component
const Info = ({ label, value }) => (
  <div className="flex items-start gap-2">
    <span className="font-semibold min-w-[130px]">{label}:</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);

export default SingleFleetDetail;
