import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PuffLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { getRentalsByFleetId } from "../../store/Slices/rental.slice";

const FleetHistory = ({ fleetId }) => {
  const dispatch = useDispatch();
  const { rentals, loading, error } = useSelector((state) => state.rental);

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

  if (!rentals || rentals.length === 0) {
    return (
      <div className="text-center py-6 text-lg text-gray-500">
        No rental history found for this fleet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <Card className="shadow-xl rounded-3xl bg-white p-4 md:p-6">
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
          <div className="flex flex-col gap-4 items-center">
            {rentals.map((rental) => (
              <div key={rental._id} className="w-full max-w-xl border rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-purple-700">Rental ID:</span>
                  <span className="text-xs text-gray-600">{rental._id}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span>
                    <span className="font-semibold">Customer:</span> {rental.customer?.name || "N/A"}
                  </span>
                  <span>
                    <span className="font-semibold">Rental Date:</span> {rental.rentalDate ? new Date(rental.rentalDate).toLocaleDateString() : "N/A"}
                  </span>
                  <span>
                    <span className="font-semibold">Purpose:</span> {rental.purpose || "N/A"}
                  </span>
                  <span>
                    <span className="font-semibold">Set Price:</span> Rs {rental.setPrice || "N/A"}
                  </span>
                  <span>
                    <span className="font-semibold">Advance:</span> Rs {rental.advanceRent || "N/A"}
                  </span>
                  <span>
                    <span className="font-semibold">Bond:</span> Rs {rental.bond || "N/A"}
                  </span>
                  <span>
                    <span className="font-semibold">Remaining:</span> Rs {rental.remainingAmount || "N/A"}
                  </span>
                  <span>
                    <span className="font-semibold">Status:</span>{" "}
                    <Badge
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetHistory;
