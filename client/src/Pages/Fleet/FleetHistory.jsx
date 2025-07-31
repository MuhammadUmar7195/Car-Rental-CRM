import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PuffLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { getRentalsByFleetId } from "../../store/Slices/rental.slice";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const FleetHistory = ({ fleetId }) => {
  const dispatch = useDispatch();
  const { rentals, loading, error } = useSelector((state) => state.rental);
console.log(rentals);

  useEffect(() => {
    if (fleetId) {
      dispatch(getRentalsByFleetId(fleetId));
    }
  }, [dispatch, fleetId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
        <PuffLoader color="#9333ea" size={60} speedMultiplier={1.2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Card className="w-full shadow-xl rounded-3xl bg-white p-4 md:p-6 mt-8">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-2xl font-bold text-purple-800 mb-2 uppercase">
          Fleet Rental History
        </CardTitle>
        <CardDescription>
          <span className="text-gray-500 text-sm">
            All rental records for this vehicle
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(!rentals || rentals.length === 0) ? (
          <div className="text-center py-6 text-lg text-gray-500">
            No rental history found for this fleet.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rental ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rental Date</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Set Price</TableHead>
                  <TableHead>Advance</TableHead>
                  <TableHead>Bond</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Inspection Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow key={rental._id} className="hover:bg-purple-50 transition">
                    <TableCell className="font-mono text-xs">{rental._id}</TableCell>
                    <TableCell>{rental.customer?.name || "N/A"}</TableCell>
                    <TableCell>
                      {rental.bookingDate
                        ? new Date(rental.bookingDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{rental.purpose || "N/A"}</TableCell>
                    <TableCell>$ {rental.setPrice || "N/A"}</TableCell>
                    <TableCell>$ {rental.advanceRent || "N/A"}</TableCell>
                    <TableCell>$ {rental.bond || "N/A"}</TableCell>
                    <TableCell>$ {rental.remainingAmount || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
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
                        {rental.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
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
                      {rental.inspectionName || (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FleetHistory;
