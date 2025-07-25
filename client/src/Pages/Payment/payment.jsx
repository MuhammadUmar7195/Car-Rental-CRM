import { useEffect } from "react";
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
      <div className="text-red-600 text-center py-10 px-4">
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

  const paidSummary = Array.isArray(assignCustomerAccountData?.data)
    ? assignCustomerAccountData.data.filter(
        (entry) => entry && typeof entry === "object"
      )
    : [];

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-6xl mx-auto">
      {/* Customer Card */}
      <Card className="mb-4 sm:mb-6 shadow-lg relative">
        <Button
          onClick={() => navigate(-1)}
          className="absolute left-2 sm:left-4 top-2 sm:top-4 px-2 sm:px-3 py-1 sm:py-2 font-semibold bg-purple-700 text-white hover:bg-purple-800 hover:text-white rounded-full cursor-pointer text-sm"
          variant="ghost"
        >
          <IoChevronBackSharp size={16} className="sm:w-[18px] sm:h-[18px]" />
        </Button>
        <CardHeader className="flex justify-center items-center pt-12 sm:pt-6">
          <CardTitle className="text-purple-800 text-xl sm:text-2xl font-bold uppercase flex items-center gap-2 text-center">
            <HiOutlineUserCircle className="text-2xl sm:text-3xl" />
            <span className="hidden sm:inline">Customer Profile</span>
            <span className="sm:hidden">Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
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
        <Card className="mb-4 sm:mb-6 bg-purple-50 shadow-md">
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <CardTitle className="text-purple-700 text-lg sm:text-xl font-semibold uppercase text-center sm:text-left">
              📄 <span className="hidden sm:inline">Rental Payment Summary</span>
              <span className="sm:hidden">Payment Summary</span>
            </CardTitle>
            {rental?.status === "reserved" ? (
              <Badge className="bg-green-600 text-white animate-pulse w-fit mx-auto sm:mx-0">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-100 text-red-600 w-fit mx-auto sm:mx-0">
                Inactive
              </Badge>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 text-base sm:text-lg font-semibold">
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
            <CardTitle className="text-green-700 text-base sm:text-lg font-semibold">
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

                {/* Desktop Table View */}
                <div className="hidden sm:block">
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
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3 mt-2">
                  {paidSummary.map((entry, idx) => (
                    <div key={entry._id || idx} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">Date</span>
                        <span className="text-sm font-medium">
                          {entry?.accountingId?.date || "—"}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs text-gray-500 block mb-1">Description</span>
                        <span className="text-sm">
                          {entry?.accountingId?.description || "No Description"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs text-gray-500">Amount</span>
                        <span className="text-sm font-semibold text-green-700">
                          Rs {entry?.accountingId?.amount?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

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
            <div className="flex justify-between font-bold text-base sm:text-lg border-t-2 pt-2 mt-3">
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
    <Label className="text-gray-600 text-xs sm:text-sm">{label}</Label>
    <span className="mt-1 font-medium text-gray-800 text-sm sm:text-base break-words">
      {value || "—"}
    </span>
  </div>
);

export default PaymentDetails;
