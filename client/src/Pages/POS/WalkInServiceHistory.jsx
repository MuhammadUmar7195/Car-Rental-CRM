import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import {
  getAllWalkInServices,
  clearServiceError,
} from "@/store/Slices/walkInService.slice";

const WalkInServiceHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { services, loading, error } = useSelector(
    (state) => state?.walkInService || {}
  );  

  useEffect(() => {
    dispatch(getAllWalkInServices());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearServiceError());
    }
  }, [error, dispatch]);

  // Ensure services is an array and filter out any invalid entries
  const validServices = Array.isArray(services)
    ? services.filter((service) => service && service._id)
    : [];
    

  return (
    <div className="py-10 lg:px-30 md:px-10 min-h-screen relative">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <div className="flex items-center mb-6">
          <Button
            onClick={() => navigate("/dashboard/pos")}
            className="mr-4 px-3 py-2 font-semibold bg-purple-700 text-white hover:bg-purple-800 cursor-pointer rounded-full"
          >
            <IoChevronBackSharp size={20} />
          </Button>
          <h2 className="text-2xl font-bold text-purple-600 text-center uppercase tracking-wide flex-1 lg:mr-30 uppercase">
            Walk-in Service History
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-xs sm:text-sm text-black bg-yellow-50 border border-purple-200 rounded px-3 py-2">
            <span className="font-extrabold">Reminder:</span> Track all walk-in
            service orders and maintain accurate records. Update the service
            status to{" "}
            <span className="font-semibold animate-pulse uppercase">
              (completed)
            </span>{" "}
            once the service is finished.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <PuffLoader color="#7e22ce" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-center">
              <p className="text-red-500 font-semibold text-lg mb-2">
                Error loading services: {error}
              </p>
              <Button
                onClick={() => dispatch(getAllWalkInServices())}
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Service ID</TableHead>
                  <TableHead className="text-center">Customer Name</TableHead>
                  <TableHead className="text-center">Phone</TableHead>
                  <TableHead className="text-center">Car Model</TableHead>
                  <TableHead className="text-center">Registration</TableHead>
                  <TableHead className="text-center">Service Date</TableHead>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center">Serviced By</TableHead>
                  <TableHead className="text-center">Items Used</TableHead>
                  <TableHead className="text-center">Total Cost</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validServices.length > 0 ? (
                  validServices.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell className="px-4 py-3 font-mono text-xs">
                        {service._id}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {service?.customerName || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {service?.phone || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {service?.carModel || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {service?.carRegistrationNumber || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {service?.createdAt
                          ? new Date(service.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3 max-w-xs">
                        <div
                          className="truncate cursor-pointer"
                          title={service?.description || "No description"}
                        >
                          {service?.description || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {service?.servicedBy || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="max-w-xs">
                          {service?.itemsUsed &&
                          Array.isArray(service.itemsUsed) &&
                          service.itemsUsed.length > 0 ? (
                            <div className="space-y-1">
                              {service.itemsUsed
                                .slice(0, 2)
                                .map((item, index) => (
                                  <div
                                    key={item?.inventoryItem || index}
                                    className="text-xs bg-gray-100 p-1 rounded"
                                  >
                                    {item?.inventoryItem?.carName || "Unknown Item"}
                                    <span className="font-semibold text-purple-600">
                                      {" "}
                                      (×{item?.quantityUsed || 0})
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
                      <TableCell className="px-4 py-3">
                        <span className="font-semibold text-purple-600">
                          $ {service?.totalCost?.toLocaleString() || "0"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${
                            service?.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : service?.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service?.status || "Unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="11"
                      className="text-center text-gray-500 px-4 py-6"
                    >
                      {loading ? (
                        <PuffLoader />
                      ) : (
                        "No walk-in service records found."
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

export default WalkInServiceHistory;
