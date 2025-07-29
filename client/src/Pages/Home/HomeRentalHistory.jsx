import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import HomeReturnReplace from "./HomeRentalReplace";

const HomeRentalHistory = ({ customerFilter, vehicleFilter }) => {
  const dispatch = useDispatch();
  const { rentals, loading, error } = useSelector(
    (state) => state?.rental || {}
  );

  // Dialog state - only what's needed for HomeReturnReplace
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    dispatch(getAllRental());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearRentalError());
    }
  }, [error, dispatch]);

  // Filter rentals based on customerFilter and vehicleFilter
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
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setShowReturnDialog(false);
    setSelectedRental(null);
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

        {/* Warning paragraph */}
        <div className="mb-4">
          <p className="text-xs sm:text-sm text-black bg-yellow-50 border border-purple-200 rounded px-3 py-2">
            <span className="font-extrabold">Note:</span> If you want to replace
            the car with a new one, then you will return the current rental car
            first.
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
                  <TableHead className="text-center">Status</TableHead>
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
                          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer uppercase ${
                            rental.status === "reserved"
                              ? "bg-yellow-100 text-yellow-800"
                              : rental.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : rental.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : rental.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rental?.status}
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

        {/* HomeReturnReplace Component handles its own dialog logic */}
        <HomeReturnReplace
          open={showReturnDialog}
          onClose={handleDialogClose}
          rental={selectedRental}
        />
      </Card>
    </div>
  );
};

export default HomeRentalHistory;
