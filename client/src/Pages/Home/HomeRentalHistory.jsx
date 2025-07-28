import { Badge } from "@/components/ui/badge";
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
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";

const HomeRentalHistory = ({ customerFilter, vehicleFilter }) => {
  const dispatch = useDispatch();
  const { rentals, loading, error } = useSelector(
    (state) => state?.rental || {}
  );

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

  return (
    <div className="lg:px-0.5 md:px-10 min-h-screen relative">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-600 text-center uppercase tracking-wide">
            Rental History
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="15"
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
      </Card>
    </div>
  );
};

export default HomeRentalHistory;
