import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { clearRentalError, getAllRental } from "@/store/Slices/rental.slice";
import { Badge } from "@/components/ui/badge";

const RentalHistory = () => {
  const dispatch = useDispatch();
  const { rentals, loading, error } = useSelector((state) => state?.rental || {});

  useEffect(() => {
    dispatch(getAllRental());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearRentalError());
    }
  }, [error, dispatch]);

  return (
    <div className="py-30 lg:px-30 md:px-10  min-h-screen">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center uppercase tracking-wide">
          Rental History
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <PuffLoader color="#7e22ce" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-3">Rental ID</TableHead>
                  <TableHead className="px-4 py-3">Customer</TableHead>
                  <TableHead className="px-4 py-3">License No</TableHead>
                  <TableHead className="px-4 py-3">Phone</TableHead>
                  <TableHead className="px-4 py-3">Car</TableHead>
                  <TableHead className="px-4 py-3">Model</TableHead>
                  <TableHead className="px-4 py-3">Registration</TableHead>
                  <TableHead className="px-4 py-3">Rental Date</TableHead>
                  <TableHead className="px-4 py-3">Purpose</TableHead>
                  <TableHead className="px-4 py-3">Set Price</TableHead>
                  <TableHead className="px-4 py-3">Advance</TableHead>
                  <TableHead className="px-4 py-3">Bond</TableHead>
                  <TableHead className="px-4 py-3">Remaining</TableHead>
                  <TableHead className="px-4 py-3">Status</TableHead>
                  <TableHead className="px-4 py-3">Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.length > 0 ? (
                  // eslint-disable-next-line no-unused-vars
                  rentals.map((rental, index) => (
                    <TableRow key={rental?._id}>
                      <TableCell className="px-4 py-3">{rental?._id}</TableCell>
                      <TableCell className="px-4 py-3">{rental.customer?.name}</TableCell>
                      <TableCell className="px-4 py-3">{rental.customer?.licenseNo}</TableCell>
                      <TableCell className="px-4 py-3">{rental.customer?.phone}</TableCell>
                      <TableCell className="px-4 py-3">{rental.fleet?.carName}</TableCell>
                      <TableCell className="px-4 py-3">{rental.fleet?.model}</TableCell>
                      <TableCell className="px-4 py-3">{rental.fleet?.registration}</TableCell>
                      <TableCell className="px-4 py-3">
                        {new Date(rental.rentalDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3">{rental.purpose}</TableCell>
                      <TableCell className="px-4 py-3">Rs {rental.setPrice}</TableCell>
                      <TableCell className="px-4 py-3">Rs {rental.advanceRent}</TableCell>
                      <TableCell className="px-4 py-3">Rs {rental.bond}</TableCell>
                      <TableCell className="px-4 py-3">Rs {rental.remainingAmount}</TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rental.status === "reserved"
                              ? "bg-yellow-100 text-yellow-800"
                              : rental.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {rental.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                    <TableCell colSpan="15" className="text-center text-gray-500 px-4 py-6">
                      No rental records found.
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

export default RentalHistory;
