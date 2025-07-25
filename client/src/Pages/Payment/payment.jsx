import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PuffLoader } from "react-spinners";
import { IoChevronBackSharp } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi";
import { getSingleCustomer } from "@/store/Slices/customer.slice";
import { getRentalsByCustomerId } from "@/store/Slices/rental.slice";
import { getAssignAccountByCustomerId } from "@/store/Slices/assignCustomerAccount";
import dayjs from "dayjs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    singleCustomer,
    loading: customerLoading,
    error: customerError,
  } = useSelector((state) => state?.customer || {});

  const {
    rentals,
    loading: rentalsLoading,
    error: rentalsError,
  } = useSelector((state) => state?.rental || {});

  const {
    assignCustomerAccountData,
    loading: accountingLoading,
    error: accountingError,
  } = useSelector((state) => state?.assignCustomerAccount || {});

  console.log("assignCustomerAccountData:", assignCustomerAccountData);

  useEffect(() => {
    if (id) {
      dispatch(getSingleCustomer(id));
      dispatch(getRentalsByCustomerId(id));
      dispatch(getAssignAccountByCustomerId(id));
    }
  }, [dispatch, id]);

  if (customerLoading || rentalsLoading || accountingLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <PuffLoader color="#9333ea" size={60} />
      </div>
    );
  }

  if (customerError || rentalsError || accountingError) {
    return (
      <div className="text-red-600 text-center py-10">
        {customerError || rentalsError || accountingError}
      </div>
    );
  }

  const customer = singleCustomer;
  const rental = rentals?.[0];
  const now = dayjs();
  const returnDate = dayjs(rental?.returnDate);
  const weeksOverdue = returnDate?.isBefore(now)
    ? now.diff(returnDate, "week") + 1
    : 0;

  // Fix: Access the correct data array from assignCustomerAccountData
  const paidSummary = Array.isArray(assignCustomerAccountData?.data)
    ? assignCustomerAccountData.data.filter(
        (entry) => entry && typeof entry === "object"
      )
    : [];

  console.log("paidSummary:", paidSummary);

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      {/* Customer Card */}
      <Card className="mb-6 shadow-lg relative">
        <Button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 px-3 py-2 font-semibold bg-purple-700 text-white hover:bg-purple-800 hover:text-white rounded-full cursor-pointer"
          variant="ghost"
        >
          <IoChevronBackSharp size={18} />
        </Button>
        <CardHeader className="flex justify-center items-center">
          <CardTitle className="text-purple-800 text-2xl font-bold uppercase flex items-center gap-2">
            <HiOutlineUserCircle className="text-3xl" />
            Customer Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Info label="Name" value={customer?.name} />
          <Info label="License No" value={customer?.licenseNo} />
          <Info label="Email" value={customer?.email} />
          <Info label="Phone" value={customer?.phone} />
          <Info label="State" value={customer?.state} />
          <Info label="Postal Code" value={customer?.postalCode} />
        </CardContent>
      </Card>

      {/* Rental Card */}
      {rental && (
        <Card className="mb-6 bg-purple-50 shadow-md">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-purple-700 text-xl font-semibold uppercase">
              📄 Rental Payment Summary
            </CardTitle>
            {rental?.status === "reserved" ? (
              <Badge className="bg-green-600 text-white animate-pulse">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-100 text-red-600">
                Inactive
              </Badge>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Info
              label="Set Price"
              value={`Rs ${rental?.setPrice?.toLocaleString()}`}
            />
            <Info
              label="Advance Rent"
              value={`Rs ${rental?.advanceRent?.toLocaleString()}`}
            />
            <Info label="Bond" value={`Rs ${rental?.bond?.toLocaleString()}`} />
            <Info
              label="Recent Paid"
              value={`Rs ${rental?.amountPaid?.toLocaleString()}`}
            />
            <Info
              label="Booking Date"
              value={dayjs(rental?.bookingDate).format("DD MMM YYYY")}
            />
            <Info
              label="Remaining Amount"
              value={`Rs ${rental?.remainingAmount?.toLocaleString()}`}
            />
            <Info
              label="Return Date"
              value={dayjs(rental?.returnDate).format("DD MMM YYYY")}
            />
            <div className="flex flex-col">
              <Label className="text-gray-600">Status</Label>
              <Badge variant="default" className="capitalize w-fit mt-1">
                {rental?.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dues and Payment */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 text-lg font-semibold">
              📌 Payment Dues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {weeksOverdue === 0 ? (
              <p className="text-gray-600">No overdue payments yet.</p>
            ) : (
              Array.from({ length: weeksOverdue }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <span>Week {i + 1}</span>
                  <span>Rs {rental?.setPrice?.toLocaleString()}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-700 text-lg font-semibold">
              💰 Paid Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {/* Rental Paid Total */}
            <div className="flex justify-between">
              <span>Rental Paid Total</span>
              <span className="font-medium text-green-600">
                Rs {rental?.amountPaid?.toLocaleString() || "0"}
              </span>
            </div>

            {/* Assigned Accounting Payments Table */}
            {paidSummary.length > 0 && (
              <>
                <div className="mt-3 text-xs text-gray-500 font-semibold border-t pt-2">
                  Assigned Accounting Payments:
                </div>

                <Table className="mt-2 border">
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="text-left">Date</TableHead>
                      <TableHead className="text-left">Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidSummary.map((entry, idx) => (
                      <TableRow key={entry._id || idx}>
                        <TableCell>
                          {entry?.accountingId?.date || "—"}
                        </TableCell>
                        <TableCell>
                          {entry?.accountingId?.description || "No Description"}
                        </TableCell>
                        <TableCell className="text-right text-green-700 font-medium">
                          Rs{" "}
                          {entry?.accountingId?.amount?.toLocaleString() || "0"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Total from Assigned Payments */}
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Assigned Total</span>
                  <span className="text-green-700">
                    Rs{" "}
                    {paidSummary
                      .reduce(
                        (total, entry) =>
                          total + (entry?.accountingId?.amount || 0),
                        0
                      )
                      .toLocaleString()}
                  </span>
                </div>
              </>
            )}

            {/* Show message when no assigned payments */}
            {paidSummary.length === 0 && (
              <div className="text-gray-500 text-center py-4 border rounded">
                No assigned payments found.
              </div>
            )}

            {/* Grand Total */}
            <div className="flex justify-between font-bold text-lg border-t-2 pt-2 mt-3">
              <span>Grand Total Paid</span>
              <span className="text-green-600">
                Rs{" "}
                {(
                  (rental?.amountPaid || 0) +
                  paidSummary.reduce(
                    (total, entry) =>
                      total + (entry?.accountingId?.amount || 0),
                    0
                  )
                ).toLocaleString()}
              </span>
            </div>

            <p className="text-gray-500 mt-2 text-xs">
              Payment includes rental payments and assigned accounting entries.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// 🧩 Reusable Info Block
const Info = ({ label, value }) => (
  <div className="flex flex-col">
    <Label className="text-gray-600">{label}</Label>
    <span className="mt-1 font-medium text-gray-800">{value || "—"}</span>
  </div>
);

export default PaymentDetails;
