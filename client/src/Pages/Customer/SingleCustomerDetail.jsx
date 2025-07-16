import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleCustomer } from "../../store/Slices/customer.slice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PuffLoader } from "react-spinners";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { IoIosCheckmark } from "react-icons/io";
import CustomerHistory from "./CustomerHistory";

const SingleCustomerDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleCustomer, loading, error } =
    useSelector((state) => state.customer) || {};

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!singleCustomer || singleCustomer._id !== id) {
      dispatch(getSingleCustomer(id));
    }
  }, [dispatch, id, singleCustomer]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <PuffLoader color="#9333ea" size={80} speedMultiplier={1.2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-lg text-red-500">
        {error}{" "}
        <Button variant="link" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!singleCustomer) {
    return (
      <div className="text-center py-10 text-lg text-gray-500">
        Customer not found.{" "}
        <Button variant="link" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const customer = singleCustomer;
  const isExpired = new Date(customer.expiryDate) < new Date();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-muted">
      <Card className="w-full max-w-5xl shadow-xl rounded-3xl bg-white p-4 md:p-6 relative">
        <CardHeader className="flex flex-col items-center text-center">
          <Button
            onClick={() => navigate(`/dashboard/customer`)}
            className="absolute left-4 top-4 px-3 py-2 font-semibold bg-purple-700 text-white hover:bg-purple-800 cursor-pointer rounded-full"
          >
            <IoChevronBackSharp />
          </Button>
          <CardTitle className="text-3xl font-bold text-purple-800 mb-2 uppercase">
            {customer.name || "N/A"}
          </CardTitle>
          <CardDescription>
            <Badge
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                isExpired
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {isExpired ? "License Expired" : "Active License"}
            </Badge>
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Section */}
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Info label="License Number" value={customer.licenseNo} />
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(customer.licenseNo || "");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                >
                  {copied ? <IoIosCheckmark size={15} /> : <IoCopyOutline />}
                </button>
              </div>
              <Info
                label="License Expiry"
                value={
                  customer.expiryDate
                    ? new Date(customer.expiryDate).toLocaleDateString("en-GB")
                    : ""
                }
              />
              <Info label="Phone" value={customer.phone || "N/A"} />
              <Info label="Email" value={customer.email || "N/A"} />
              <Info label="DC Number" value={customer.dcNumber || "N/A"} />
            </div>

            {/* Right Section */}
            <div className="space-y-2 text-sm text-gray-700">
              <Info label="Suburb" value={customer.suburb || "N/A"} />
              <Info label="State" value={customer.state || "N/A"} />
              <Info label="Postal Code" value={customer.postalCode || "N/A"} />
              <Info label="Address" value={customer.address || "N/A"} />
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              className="px-6 py-2 font-semibold border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 cursor-pointer"
              onClick={() =>
                navigate(`/dashboard/rental?customerId=${customer._id}`)
              }
            >
              Create Rental
            </Button>
            <Button
              variant="outline"
              className="px-6 py-2 font-semibold border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 cursor-pointer"
              onClick={() =>
                navigate(`/dashboard/customer/edit/${customer._id}`)
              }
            >
              Edit Customer
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="w-full max-w-5xl">
        <CustomerHistory customerId={id} />
      </div>
    </div>
  );
};

// Small reusable field display component
const Info = ({ label, value }) => (
  <div className="flex items-start gap-2">
    <span className="font-semibold min-w-[130px]">{label}:</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);

export default SingleCustomerDetail;
