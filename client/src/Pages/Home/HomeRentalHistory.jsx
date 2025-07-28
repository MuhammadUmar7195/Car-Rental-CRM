import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clearRentalError, getAllRental } from "@/store/Slices/rental.slice";
import { useEffect, useMemo, useState } from "react";
import { VscReplace } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import axios from "axios";

const HomeRentalHistory = ({ customerFilter, vehicleFilter }) => {
  const dispatch = useDispatch();
  const { rentals, loading, error } = useSelector(
    (state) => state?.rental || {}
  );

  // Return dialog state
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [inspectionName, setInspectionName] = useState("");
  const [agree, setAgree] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllRental());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearRentalError());
    }
  }, [error, dispatch]);

  const filteredRentals = useMemo(() => {
    if (!rentals || rentals.length === 0) return [];

    return rentals.filter((rental) => {
      // Customer filter logic
      const matchesCustomer =
        !customerFilter ||
        rental?.customer?.name
          ?.toLowerCase()
          .includes(customerFilter.toLowerCase()) ||
        rental?.customer?.licenseNo
          ?.toLowerCase()
          .includes(customerFilter.toLowerCase()) ||
        rental?.customer?.phone
          ?.toLowerCase()
          .includes(customerFilter.toLowerCase());

      // Vehicle filter logic
      const matchesVehicle =
        !vehicleFilter ||
        rental?.fleet?.carName
          ?.toLowerCase()
          .includes(vehicleFilter.toLowerCase()) ||
        rental?.fleet?.model
          ?.toLowerCase()
          .includes(vehicleFilter.toLowerCase()) ||
        rental?.fleet?.registration
          ?.toLowerCase()
          .includes(vehicleFilter.toLowerCase());

      return matchesCustomer && matchesVehicle;
    });
  }, [rentals, customerFilter, vehicleFilter]);

  // Check if any filters are active
  const hasActiveFilters = customerFilter || vehicleFilter;

  // Handle replace button click
  const handleReplaceClick = (rental) => {
    setSelectedRental(rental);
    setShowReturnDialog(true);
    setInspectionName("");
    setAgree(false);
  };

  // Handle return rental submission
  const handleReturnRental = async () => {
    setReturnLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/inspection/${
          selectedRental?.fleet?._id
        }`,
        { inspectionName: inspectionName.trim() },
        { withCredentials: true }
      );

      toast.success(
        `${selectedRental?.fleet?.carName} rental returned successfully!`
      );

      setShowReturnDialog(false);
      setInspectionName("");
      setAgree(false);
      setSelectedRental(null);
      dispatch(getAllRental());
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to return rental");
    } finally {
      setReturnLoading(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    if (!returnLoading) {
      setShowReturnDialog(false);
      setInspectionName("");
      setAgree(false);
      setSelectedRental(null);
    }
  };

  return (
    <div className="lg:px-0.5 md:px-10 min-h-screen relative">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-600 text-center uppercase tracking-wide">
            Recent History
          </h2>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtered by:</span>
              {customerFilter && (
                <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Customer: {customerFilter}
                </div>
              )}
              {vehicleFilter && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Vehicle: {vehicleFilter}
                </div>
              )}
            </div>
          )}
        </div>

        {/* warning paragraph */}
        <div>
          <p className="text-xs sm:text-sm text-black bg-yellow-50 border border-purple-200 rounded px-3 py-2">
            <span className="font-extrabold">Note:</span> If you want to replace the car with a new one, then you will return the current rental car first.
          </p>
        </div>

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">{filteredRentals.length}</span> of{" "}
              <span className="font-semibold">{rentals?.length || 0}</span>{" "}
              rental records
              {customerFilter && ` matching customer "${customerFilter}"`}
              {vehicleFilter && ` matching vehicle "${vehicleFilter}"`}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <PuffLoader color="#7e22ce" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Rental ID</TableHead>
                  <TableHead className="text-center">Customer</TableHead>
                  <TableHead className="text-center">License No</TableHead>
                  <TableHead className="text-center">Phone</TableHead>
                  <TableHead className="text-center">Car</TableHead>
                  <TableHead className="text-center">Model</TableHead>
                  <TableHead className="text-center">Registration</TableHead>
                  <TableHead className="text-center">Set Price</TableHead>
                  <TableHead className="text-center">Advance</TableHead>
                  <TableHead className="text-center">Bond</TableHead>
                  <TableHead className="text-center">Remaining</TableHead>
                  <TableHead className="text-center">Payment</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentals.length > 0 ? (
                  filteredRentals.map((rental) => (
                    <TableRow key={rental?._id} className="hover:bg-gray-50">
                      <TableCell className="px-4 py-3 font-mono text-xs">
                        {rental?._id}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium">
                        {rental.customer?.name || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.customer?.licenseNo || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.customer?.phone || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium">
                        {rental.fleet?.carName || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.fleet?.model || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.fleet?.registration || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium">
                        Rs {rental?.setPrice?.toLocaleString() || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        Rs {rental?.advanceRent?.toLocaleString() || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        Rs {rental?.bond?.toLocaleString() || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium">
                        Rs {rental?.remainingAmount?.toLocaleString() || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${
                            rental.paymentStatus === "partial"
                              ? "bg-blue-100 text-blue-800"
                              : rental.paymentStatus === "pending"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {rental.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          className="px-3 py-1 rounded transition font-semibold text-xs cursor-pointer text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => handleReplaceClick(rental)}
                        >
                          <VscReplace className="mr-1" />
                          Replace
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="13"
                      className="text-center text-gray-500 px-4 py-8"
                    >
                      {hasActiveFilters ? (
                        <div className="space-y-2">
                          <p>No rental records match your filters.</p>
                          <p className="text-sm">
                            Try adjusting your search criteria or clear the
                            filters to see all records.
                          </p>
                        </div>
                      ) : (
                        "No rental records found."
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Return Rental Dialog */}
        <Dialog open={showReturnDialog} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Return Rental - {selectedRental?.fleet?.carName}
              </DialogTitle>
            </DialogHeader>

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
                  disabled={returnLoading}
                  className="w-full"
                  autoFocus
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreement"
                  checked={agree}
                  onCheckedChange={setAgree}
                  disabled={returnLoading}
                  className="mt-0.5"
                />
                <Label htmlFor="agreement" className="text-sm leading-5">
                  I confirm that the vehicle has been properly inspected and
                  agree to process the return and replace for new car.
                </Label>
              </div>

              {/* Additional rental info */}
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p>
                  <strong>Customer:</strong> {selectedRental?.customer?.name}
                </p>
                <p>
                  <strong>Vehicle:</strong> {selectedRental?.fleet?.carName} (
                  {selectedRental?.fleet?.registration})
                </p>
                <p>
                  <strong>Rental ID:</strong> {selectedRental?._id}
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={handleDialogClose}
                disabled={returnLoading}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReturnRental}
                disabled={!inspectionName.trim() || !agree || returnLoading}
                className="flex-1 sm:flex-none bg-purple-700 hover:bg-purple-600 text-white"
              >
                {returnLoading ? "Processing..." : "Confirm Return"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default HomeRentalHistory;
