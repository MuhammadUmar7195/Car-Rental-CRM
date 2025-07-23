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
import dayjs from "dayjs";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    singleCustomer,
    loading: customerLoading,
    error: customerError,
  } = useSelector((state) => state.customer);
  const {
    rentals,
    loading: rentalsLoading,
    error: rentalsError,
  } = useSelector((state) => state.rental);

  useEffect(() => {
    if (id) {
      dispatch(getSingleCustomer(id));
      dispatch(getRentalsByCustomerId(id));
    }
  }, [dispatch, id]);

  if (customerLoading || rentalsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <PuffLoader color="#9333ea" size={60} />
      </div>
    );
  }

  if (customerError || rentalsError) {
    return (
      <div className="text-red-600 text-center py-10">
        {customerError || rentalsError}
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
              <Badge variant="default" className="capitalize w-fit mt-1">{rental?.status}</Badge>
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
            <div className="flex justify-between">
              <span>Paid Total</span>
              <span className="font-medium text-green-600">
                Rs {rental?.amountPaid?.toLocaleString() || "0"}
              </span>
            </div>
            <p className="text-gray-500 mt-2">
              Payment may have been made weekly or in lump sum.
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
