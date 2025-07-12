import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PuffLoader } from "react-spinners";
import {
  getSingleCustomer,
  updateCustomer,
} from "@/store/Slices/customer.slice";
import { toast } from "sonner";

const EditCustomerPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleCustomer, loading, error } = useSelector(
    (state) => state.customer || {}
  );

  const [form, setForm] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!singleCustomer || singleCustomer._id !== id) {
      dispatch(getSingleCustomer(id));
    } else {
      setForm({ ...singleCustomer });
    }
  }, [dispatch, id, singleCustomer]);

  useEffect(() => {
    if (singleCustomer && singleCustomer._id === id) {
      setForm({ ...singleCustomer });
    }
  }, [singleCustomer, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");

    try {
      await dispatch(
        updateCustomer({ customerId: id, customerData: form })
      ).unwrap();
      toast.success("Customer updated successfully!");
      navigate(-1);
    } catch (err) {
      setSubmitError(err?.message || "Update failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <PuffLoader color="#9333ea" size={80} />
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-muted">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <h2 className="text-3xl font-bold text-purple-700 col-span-full text-center mb-2 uppercase">
          Edit Customer Details
        </h2>

        {[
          { label: "Full Name", name: "name", type: "text" },
          { label: "License Number", name: "licenseNo", type: "text" },
          { label: "License Expiry", name: "expiryDate", type: "date" },
          { label: "Phone Number", name: "phone", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "DC Number", name: "dcNumber", type: "text" },
          { label: "Suburb", name: "suburb", type: "text" },
          { label: "State", name: "state", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Postal Code", name: "postalCode", type: "text" },
        ].map(({ label, name, type, ...rest }) => (
          <div key={name}>
            <Label htmlFor={name} className="mb-2">
              {label}
            </Label>
            <Input
              id={name}
              name={name}
              type={type}
              placeholder={label}
              value={
                type === "date" && form[name]
                  ? new Date(form[name]).toISOString().split("T")[0]
                  : form[name] || ""
              }
              onChange={handleChange}
              disabled={submitLoading}
              {...rest}
            />
          </div>
        ))}

        {submitError && (
          <div className="col-span-full text-center text-red-600">
            {submitError}
          </div>
        )}

        <div className="col-span-full flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
            disabled={submitLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-700 text-white hover:bg-purple-800 cursor-pointer"
            disabled={submitLoading}
          >
            {submitLoading ? "Updating..." : "Update Customer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomerPage;
