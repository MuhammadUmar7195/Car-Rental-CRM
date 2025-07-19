import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getFleetServiceOrders} from "@/store/Slices/service.slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";

const FleetServiceHistory = ({ fleetId }) => {
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector(
    (state) => state?.service || {}
  );

  useEffect(() => {
    if (fleetId) {
      dispatch(getFleetServiceOrders(fleetId));
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
    return <div className="text-center py-6 text-lg text-red-500">{error}</div>;
  }

  return (
    <Card className="w-full shadow-xl rounded-3xl bg-white p-4 md:p-6 mt-8">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-2xl font-bold text-purple-800 mb-2 uppercase">
          Fleet Service History
        </CardTitle>
        <CardDescription>
          <span className="text-gray-500 text-sm">
            All service records for this vehicle
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!services || services.length === 0 ? (
          <div className="text-center py-6 text-lg text-gray-500">
            No service history found for this fleet.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Serviced By</TableHead>
                  <TableHead>Items Used</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow
                    key={service._id}
                    className="hover:bg-purple-50 transition"
                  >
                    <TableCell className="font-mono text-xs">
                      {service._id}
                    </TableCell>
                    <TableCell>
                      {service.serviceDate
                        ? new Date(service.serviceDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={service.description}>
                        {service.description || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>{service.servicedBy || "N/A"}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {service.itemsUsed && service.itemsUsed.length > 0 ? (
                          <div className="space-y-1">
                            {service.itemsUsed
                              .slice(0, 2)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-gray-100 p-1 rounded"
                                >
                                  {item.inventoryItem?.carName ||
                                    "Unknown Item"}
                                  <span className="font-semibold text-purple-600">
                                    {" "}
                                    (×{item.quantityUsed})
                                  </span>
                                </div>
                              ))}
                            {service.itemsUsed.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{service.itemsUsed.length - 2} more items
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No items</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-purple-600">
                        Rs {service.totalCost?.toLocaleString() || "0"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                          service.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : service.status === "Completed"
                            ? "bg-green-100 text-green-800"                           
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.status || "Unknown"}
                      </Badge>
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

export default FleetServiceHistory;
