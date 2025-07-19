import React, { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import axios from "axios";
import { Label } from "@/components/ui/label";
import FleetServiceHistory from "./FleetServiceHistory";

const SingleFleetDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleFleet, loading, error } =
    useSelector((state) => state.fleet) || {};

  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [inspectionName, setInspectionName] = useState("");
  const [agree, setAgree] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);

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

  const handleReturnRental = async () => {
    setReturnLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/inspection/${id}`,
        { inspectionName },
        { withCredentials: true }
      );
      toast.success("Rental returned and inspection name updated!");
      setShowReturnDialog(false);
      setInspectionName("");
      setAgree(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to return rental");
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-muted">
      <Card className="w-full max-w-5xl shadow-xl rounded-3xl bg-white p-2 md:p-6">
        <CardHeader className="flex flex-col items-center text-center relative">
          <Button
            onClick={() => navigate(`/dashboard/fleet`)}
            className="absolute left-4 top-4 px-3 py-2 font-semibold bg-purple-700 text-white hover:bg-purple-800 cursor-pointer rounded-full"
          >
            <IoChevronBackSharp />
          </Button>
          <CardTitle className="text-3xl font-bold text-purple-800 mb-2 lg:mr-9 uppercase">
            {car.carName || "N/A"}
          </CardTitle>
          <CardDescription>
            <Badge
              className={`px-4 py-1 rounded-full text-sm font-medium lg:mr-9 ${
                isRented
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {car?.status || "N/A"}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
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

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center w-full">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/rental")}
              className="px-6 py-2 font-semibold border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 cursor-pointer"
            >
              Rental
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/pos")}
              className="px-6 py-2 font-semibold border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 cursor-pointer"
            >
              Service
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowReturnDialog(true)}
              className="px-6 py-2 font-semibold border-black text-black hover:bg-gray-50 hover:border-black cursor-pointer"
            >
              Return Rental
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="w-full max-w-5xl">
        <FleetHistory fleetId={id} />
      </div>
      <div className="w-full max-w-5xl">
        <FleetServiceHistory fleetId={id} />
      </div>

      {/* Return Rental Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Rental</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block font-medium mb-1">
              Inspected By: <span className="text-red-500">*</span>
            </label>
            <Input
              value={inspectionName}
              onChange={(e) => setInspectionName(e.target.value)}
              placeholder="Enter Inspector name"
              required
            />
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                checked={agree}
                className={"cursor-pointer"}
                onCheckedChange={setAgree}
                id="agree"
                defaultChecked={false}
              />
              <Label htmlFor="agree" className="text-sm">
                I confirm the inspection and agree to return this vehicle.
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReturnDialog(false)}
              disabled={returnLoading}
              className={`cursor-pointer`}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-700 hover:bg-purple-600 text-white cursor-pointer"
              onClick={handleReturnRental}
              disabled={!inspectionName || !agree || returnLoading}
            >
              {returnLoading ? "Processing..." : "Confirm Return"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
