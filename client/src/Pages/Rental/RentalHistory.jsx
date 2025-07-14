import React, { useEffect } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { VscOpenPreview } from "react-icons/vsc";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  clearRentalError,
  deleteRental,
  getAllRental,
  getSingleRental,
} from "@/store/Slices/rental.slice";
import { Badge } from "@/components/ui/badge";
import { MdDeleteOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import RentalInvoice from "./RentalInvoice";
import { IoMdDownload } from "react-icons/io";

const RentalHistory = () => {
  const navigate = useNavigate();
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this rental order?")) {
      dispatch(deleteRental(id)).then(() => {
        dispatch(getAllRental());
        toast.success("Rental order deleted successfully!");
      });
    }
  };

  const handleDownload = async (rentalId) => {
    try {
      // Dispatch to get single rental
      const rentalData = await dispatch(getSingleRental(rentalId)).unwrap();

      const {
        customer,
        fleet,
        rentalDate,
        purpose,
        setPrice,
        bond,
        advanceRent,
      } = rentalData;

      // Build invoice component props
      const invoiceComponent = (
        <RentalInvoice
          selectedCustomer={customer}
          selectedCar={fleet}
          rentalData={{ rentalDate, purpose, setPrice, bond, advanceRent }}
        />
      );

      const blob = await pdf(invoiceComponent).toBlob();
      saveAs(blob, `RentalInvoice_${rentalId}.pdf`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate invoice");
    }
  };

  const handleViewInvoice = async (rentalId) => {
    try {
      const rentalData = await dispatch(getSingleRental(rentalId)).unwrap();

      const {
        customer,
        fleet,
        rentalDate,
        purpose,
        setPrice,
        bond,
        advanceRent,
      } = rentalData;

      const invoiceComponent = (
        <RentalInvoice
          selectedCustomer={customer}
          selectedCar={fleet}
          rentalData={{ rentalDate, purpose, setPrice, bond, advanceRent }}
        />
      );

      // Generate PDF blob
      const blob = await pdf(invoiceComponent).toBlob();
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      // Open in new tab for viewing
      window.open(url, "_blank");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate invoice");
    }
  };

  return (
    <div className="py-10 lg:px-30 md:px-10 min-h-screen relative">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <div className="flex items-center mb-6">
          <Button
            onClick={() => navigate("/dashboard/rental")}
            className="mr-4 px-3 py-2 font-semibold bg-purple-700 text-white hover:bg-purple-800 cursor-pointer rounded-full"
          >
            <IoChevronBackSharp size={20} />
          </Button>
          <h2 className="text-2xl font-bold text-purple-600 text-center uppercase tracking-wide flex-1 lg:mr-30">
            Rental History
          </h2>
        </div>

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
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.length > 0 ? (
                  // eslint-disable-next-line no-unused-vars
                  rentals.map((rental, index) => (
                    <TableRow key={rental?._id}>
                      <TableCell className="px-4 py-3">{rental?._id}</TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.customer?.name}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.customer?.licenseNo}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.customer?.phone}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.fleet?.carName}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.fleet?.model}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.fleet?.registration}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {new Date(rental.rentalDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rental.purpose}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        Rs {rental.setPrice}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        Rs {rental.advanceRent}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        Rs {rental.bond}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        Rs {rental.remainingAmount}
                      </TableCell>
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
                      <TableCell className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant={"destructive"}
                            onClick={() => handleDelete(rental._id)}
                            className="text-white hover:opacity-80 px-3 py-1 rounded transition font-semibold text-xs cursor-pointer"
                          >
                            <MdDeleteOutline size={19} />
                          </Button>
                          <Button
                            variant="outline"
                            className="px-3 py-1 rounded transition font-semibold text-xs cursor-pointer"
                            onClick={() => handleViewInvoice(rental._id)}
                          >
                            <VscOpenPreview/>
                          </Button>
                          <Button
                            variant="secondary"
                            className="px-3 py-1 rounded transition font-semibold text-xs cursor-pointer"
                            onClick={() => handleDownload(rental._id)}
                          >
                            <IoMdDownload className="fill-purple-500"/>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="16"
                      className="text-center text-gray-500 px-4 py-6"
                    >
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
