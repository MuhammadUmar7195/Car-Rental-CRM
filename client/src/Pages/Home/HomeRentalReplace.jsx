import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getAllRental } from "@/store/Slices/rental.slice";
import useAvailableCars from "@/hooks/useAvailableCars";
import { PuffLoader } from "react-spinners";
import {
  AlertCircle,
  RefreshCw,
  Search,
  CarIcon,
  FileTextIcon,
} from "lucide-react";
import { FaRegCircleCheck as FaCheck } from "react-icons/fa6";

const HomeReturnReplace = ({ open, onClose, rental }) => {
  const dispatch = useDispatch();
  const {
    cars,
    loading: carsLoading,
    error: carsError,
    refetch,
  } = useAvailableCars();

  // Step management
  const [step, setStep] = useState(1);

  // Return step state
  const [inspectionName, setInspectionName] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Car selection state
  const [selectedCar, setSelectedCar] = useState(null);
  const [carSearch, setCarSearch] = useState("");

  // New rental form state
  const [purpose, setPurpose] = useState("");
  const [setPrice, setSetPrice] = useState("");
  const [bondPrice, setBondPrice] = useState("");
  const [advancePrice, setAdvancePrice] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Filter available cars
  const filteredCars = cars.filter(
    (car) =>
      car.carName?.toLowerCase().includes(carSearch.toLowerCase()) ||
      car.model?.toLowerCase().includes(carSearch.toLowerCase()) ||
      car.registration?.toLowerCase().includes(carSearch.toLowerCase())
  );

  const handleReturnCar = async () => {
    if (!inspectionName.trim()) {
      toast.error("Please enter inspector name");
      return;
    }

    if (!agree) {
      toast.error("Please confirm the inspection agreement");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/inspection/${
          rental?.fleet?._id
        }`,
        { inspectionName: inspectionName.trim() },
        { withCredentials: true }
      );

      toast.success(`${rental?.fleet?.carName} returned successfully!`);

      // Move to car selection step
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to return rental");
    } finally {
      setLoading(false);
    }
  };

  const handleCarSelect = (car) => {
    if (selectedCar?._id === car._id) {
      setSelectedCar(null);
    } else {
      setSelectedCar(car);
    }
  };

  const handleProceedToRental = () => {
    if (!selectedCar) {
      toast.error("Please select a replacement vehicle");
      return;
    }

    // Prefill form with existing rental data and format dates properly
    if (rental) {
      setPurpose(rental.purpose || "");
      setSetPrice(rental.setPrice?.toString() || "");
      setBondPrice(rental.bond?.toString() || "");
      setAdvancePrice(rental.advanceRent?.toString() || "");

      // Format dates for input fields (YYYY-MM-DD format)
      if (rental.bookingDate) {
        const bookingDateFormatted = new Date(
          rental.bookingDate
        )
          .toISOString()
          .split("T")[0];
        setBookingDate(bookingDateFormatted);
      } else {
        const today = new Date().toISOString().split("T")[0];
        setBookingDate(today);
      }

      if (rental.returnDate) {
        const returnDateFormatted = new Date(rental.returnDate)
          .toISOString()
          .split("T")[0];
        setReturnDate(returnDateFormatted);
      }
    } else {
      // Set default dates if no rental data
      const today = new Date().toISOString().split("T")[0];
      setBookingDate(today);
    }

    // Move to rental form step
    setStep(3);
  };

  const handleCreateRental = async () => {
    // Validation checks
    if (!purpose.trim()) {
      toast.error("Please enter rental purpose");
      return;
    }
    if (!setPrice || parseFloat(setPrice) <= 0) {
      toast.error("Please enter a valid set price");
      return;
    }
    if (!bondPrice || parseFloat(bondPrice) <= 0) {
      toast.error("Please enter a valid bond price");
      return;
    }
    if (!advancePrice || parseFloat(advancePrice) <= 0) {
      toast.error("Please enter a valid advance price");
      return;
    }

    setLoading(true);
    try {
      // Updated data structure to match your Postman format
      const rentalData = {
        customerId: rental?.customer?._id,
        fleetId: selectedCar._id,
        rentalData: {
          purpose: purpose.trim(),
          setPrice: parseFloat(setPrice),
          bond: parseFloat(bondPrice),
          advanceRent: parseFloat(advancePrice),
          overdue: 0, // Default overdue to 0
          // Only include dates if they are provided
          ...(bookingDate && {
            bookingDate: new Date(bookingDate).toISOString(),
          }),
          ...(returnDate && { returnDate: new Date(returnDate).toISOString() }),
        },
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/add`,
        rentalData,
        { withCredentials: true }
      );

      toast.success(
        `New rental created successfully with ${selectedCar.carName}!`
      );
      dispatch(getAllRental());
      handleClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create new rental"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Reset all states
      setStep(1);
      setInspectionName("");
      setAgree(false);
      setSelectedCar(null);
      setCarSearch("");
      setPurpose("");
      setSetPrice("");
      setBondPrice("");
      setAdvancePrice("");
      setBookingDate("");
      setReturnDate("");
      onClose();
    }
  };

  const goBackToStep = (targetStep) => {
    setStep(targetStep);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return `Return Rental - ${rental?.fleet?.carName}`;
      case 2:
        return `Select Replacement Vehicle for ${rental?.customer?.name}`;
      case 3:
        return `Create New Rental Order`;
      default:
        return "Vehicle Replacement";
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return <CarIcon className="h-5 w-5" />;
      case 2:
        return <Search className="h-5 w-5" />;
      case 3:
        return <FileTextIcon className="h-5 w-5" />;
      default:
        return <CarIcon className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            {getStepIcon()}
            {getStepTitle()}
          </DialogTitle>
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepNumber
                      ? "bg-purple-600 text-white"
                      : step > stepNumber
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? "✓" : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-8 h-0.5 mx-1 ${
                      step > stepNumber ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        {step === 1 && (
          // STEP 1: Return Current Car
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inspector" className="text-sm font-medium">
                Inspected By <span className="text-red-500">*</span>
              </Label>
              <Input
                id="inspector"
                value={inspectionName}
                onChange={(e) => setInspectionName(e.target.value)}
                placeholder="Enter inspector name"
                disabled={loading}
                className="w-full"
                autoFocus
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreement"
                checked={agree}
                onCheckedChange={setAgree}
                disabled={loading}
                className="mt-0.5"
              />
              <Label htmlFor="agreement" className="text-sm leading-5">
                I confirm that the vehicle has been properly inspected and agree
                to process the return and replace with a new car.
              </Label>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-mono">
                  Current Rental Details
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>
                  <strong>Customer:</strong> {rental?.customer?.name}
                </p>
                <p>
                  <strong>Vehicle:</strong> {rental?.fleet?.carName} (
                  {rental?.fleet?.registration})
                </p>
                <p>
                  <strong>Rental ID:</strong> {rental?._id}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          // STEP 2: Select New Car
          <div className="space-y-4 py-4">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Name:</strong> {rental?.customer?.name}
                </p>
                <p>
                  <strong>License:</strong> {rental?.customer?.licenseNo}
                </p>
                <p>
                  <strong>Phone:</strong> {rental?.customer?.phone}
                </p>
              </CardContent>
            </Card>

            {/* Search Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Search Available Vehicles
              </Label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search by car name, model, or registration"
                  value={carSearch}
                  onChange={(e) => setCarSearch(e.target.value)}
                  className="pl-10"
                  disabled={carsLoading}
                />
              </div>
            </div>

            {/* Available Cars List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  Available Vehicles
                  {carsError && (
                    <Button
                      onClick={refetch}
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-300 hover:bg-purple-50"
                    >
                      <RefreshCw size={14} className="mr-1" />
                      Retry
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto">
                {carsLoading ? (
                  <div className="flex justify-center py-4">
                    <PuffLoader size={30} color="#9333ea" />
                  </div>
                ) : carsError ? (
                  <div className="text-center py-4 space-y-2">
                    <AlertCircle className="text-red-500 mx-auto" size={32} />
                    <p className="text-sm text-red-600">
                      Failed to load vehicles
                    </p>
                    <p className="text-xs text-gray-500">{carsError}</p>
                  </div>
                ) : filteredCars.length > 0 ? (
                  <div className="space-y-2">
                    {filteredCars.map((car) => {
                      const isSelected = selectedCar?._id === car._id;
                      return (
                        <div
                          key={car._id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => handleCarSelect(car)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-purple-700">
                                  {car.carName}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {car.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {car.model} • {car.registration}
                              </p>
                              <p className="text-xs text-gray-500">
                                {car.color} • {car.fuel} • {car.type}
                              </p>
                            </div>
                            {isSelected && (
                              <FaCheck className="text-green-500" size={20} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    {carSearch ? (
                      <p>No vehicles found matching "{carSearch}"</p>
                    ) : (
                      <p>No available vehicles found</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Car Summary */}
            {selectedCar && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-sm text-green-700">
                    Selected Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>
                    <strong>{selectedCar.carName}</strong> - {selectedCar.model}
                  </p>
                  <p>Registration: {selectedCar.registration}</p>
                  <p>
                    Color: {selectedCar.color} • Fuel: {selectedCar.fuel}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 3 && (
          // STEP 3: Create New Rental
          <div className="space-y-6 py-4">
            {/* Rental Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>
                    <strong>Name:</strong> {rental?.customer?.name}
                  </p>
                  <p>
                    <strong>License:</strong> {rental?.customer?.licenseNo}
                  </p>
                  <p>
                    <strong>Phone:</strong> {rental?.customer?.phone}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Selected Vehicle</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>
                    <strong>Car:</strong> {selectedCar?.carName}
                  </p>
                  <p>
                    <strong>Model:</strong> {selectedCar?.model}
                  </p>
                  <p>
                    <strong>Registration:</strong> {selectedCar?.registration}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Rental Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-sm font-medium">
                  Rental Purpose <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  value={rental?.purpose || purpose || "N/A"}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Enter the purpose of rental"
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="setPrice" className="text-sm font-medium">
                    Set Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="setPrice"
                    type="number"
                    value={rental?.setPrice || setPrice}
                    onChange={(e) => setSetPrice(e.target.value)}
                    disabled={loading}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bondPrice" className="text-sm font-medium">
                    Bond Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bondPrice"
                    type="number"
                    value={rental?.bond || bondPrice}
                    onChange={(e) => setBondPrice(e.target.value)}
                    disabled={loading}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advancePrice" className="text-sm font-medium">
                    Advance Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="advancePrice"
                    type="number"
                    value={rental?.advanceRent || advancePrice}
                    onChange={(e) => setAdvancePrice(e.target.value)}
                    disabled={loading}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingDate" className="text-sm font-medium">
                    Booking Date <span className="text-xs text-gray-500">(optional)</span>
                  </Label>
                  <Input
                    id="bookingDate"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnDate" className="text-sm font-medium">
                    Return Date <span className="text-xs text-gray-500">(optional)</span>
                  </Label>
                  <Input
                    type="date"
                    id="returnDate"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    disabled={loading}
                    min={bookingDate}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {step === 1 && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 sm:flex-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReturnCar}
                disabled={!inspectionName.trim() || !agree || loading}
                className="flex-1 sm:flex-none bg-purple-700 hover:bg-purple-600 text-white cursor-pointer"
              >
                {loading ? "Processing..." : "Return & Continue"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button
                variant="outline"
                onClick={() => goBackToStep(1)}
                disabled={loading}
                className="flex-1 sm:flex-none cursor-pointer"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 sm:flex-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProceedToRental}
                disabled={!selectedCar || loading}
                className="flex-1 sm:flex-none bg-blue-700 hover:bg-blue-600 text-white cursor-pointer"
              >
                Proceed to Rental
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Button
                variant="outline"
                onClick={() => goBackToStep(2)}
                disabled={loading}
                className="flex-1 sm:flex-none cursor-pointer"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 sm:flex-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRental}
                disabled={loading}
                className="flex-1 sm:flex-none bg-green-700 hover:bg-green-600 text-white cursor-pointer"
              >
                {loading ? "Creating..." : "Create Rental"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HomeReturnReplace;
