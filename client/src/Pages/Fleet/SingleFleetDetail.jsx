/* eslint-disable no-constant-binary-expression */
import { useEffect, useState } from "react";
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
import { Car, ImageOff } from "lucide-react";

const SingleFleetDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const singleFleet = useSelector((state) => state.fleet.singleFleet);

  const { loading, error } = singleFleet || {};

  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [inspectionName, setInspectionName] = useState("");
  const [agree, setAgree] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    dispatch(getSingleFleet(id));
  }, [dispatch, id]);

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

  // Get car image URL
  const getCarImageUrl = () => {
    if (car.images && car.images.length > 0) {
      return car.images[0].url;
    }
    return null;
  };

  const carImageUrl = getCarImageUrl();

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

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-muted">
      <Card className="w-full max-w-6xl shadow-xl rounded-3xl bg-white p-2 md:p-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Car Image Section */}
            <div className="lg:col-span-1">
              <div className="rounded-xl p-4 h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Car Image
                </h3>

                {carImageUrl ? (
                  <div className="relative">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    )}

                    <img
                      src={carImageUrl}
                      alt={`${car.carName} ${car.model}`}
                      className={`w-full h-64 object-cover rounded-lg shadow-md transition-opacity duration-300 ${
                        imageLoading ? "opacity-0" : "opacity-100"
                      }`}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />

                    {imageError && (
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500">
                        <ImageOff className="h-12 w-12 mb-2" />
                        <p className="text-sm">Failed to load image</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500">
                    <Car className="h-16 w-16 mb-3" />
                    <p className="text-sm font-medium">No image available</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Image not uploaded for this vehicle
                    </p>
                  </div>
                )}

                {/* Image Info */}
                {carImageUrl && !imageError && (
                  <div className="mt-3 text-xs text-gray-600 text-center">
                    <p>
                      Alt:{" "}
                      {car.images?.[0]?.altText ||
                        `${car.carName} ${car.model}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Car Details Section */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                {/* Left Section */}
                <div className="space-y-3 text-sm text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>
                  <Info label="Model" value={car.model} />
                  <Info
                    label="Year"
                    value={
                      car.year
                        ? new Date(car.year).toLocaleDateString("en-GB")
                        : ""
                    }
                  />
                  <Info
                    label="Price Per Day"
                    value={`$${car.pricePerDay}` || "N/A"}
                  />
                  <Info
                    label="Registration"
                    value={car.registration || "N/A"}
                  />
                  <Info label="Color" value={car.color || "N/A"} />
                  <Info label="Fuel" value={car.fuel || "N/A"} />
                  <Info label="Type" value={car.type || "N/A"} />
                  <Info label="Owner" value={car.owner || "N/A"} />
                </div>

                {/* Right Section */}
                <div className="space-y-3 text-sm text-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    Technical Details
                  </h3>
                  <Info label="VIN" value={car.vin || "N/A"} />
                  <Info label="Engine" value={car.engine || "N/A"} />
                  <Info label="Category" value={car.category || "N/A"} />
                  <Info
                    label="Odometer"
                    value={`${car.odometer} km` || "N/A"}
                  />
                  <Info
                    label="Transmission"
                    value={car.transmission || "N/A"}
                  />
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center w-full pt-6 border-t border-gray-200">
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
              disabled={car.status?.toLowerCase() === "available"}
            >
              Return Rental
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-6xl">
        <FleetHistory fleetId={id} />
      </div>
      <div className="w-full max-w-6xl">
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
    <span className="font-semibold min-w-[130px] text-gray-600">{label}:</span>
    <span className="text-gray-800 font-medium">{value || "—"}</span>
  </div>
);

export default SingleFleetDetail;
