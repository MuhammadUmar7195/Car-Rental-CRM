import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleFleet, updateFleet } from "../../store/Slices/fleet.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Utility to format date
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

const EditFleetPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleFleet, loading, error } = useSelector(
    (state) => state.fleet || {}
  );
  const [form, setForm] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!singleFleet || singleFleet._id !== id) {
      dispatch(getSingleFleet(id));
    } else {
      setForm({ ...singleFleet });
    }
  }, [dispatch, id, singleFleet]);

  useEffect(() => {
    if (singleFleet && singleFleet._id === id) {
      setForm({ ...singleFleet });
    }
  }, [singleFleet, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");

    try {
      await dispatch(updateFleet({ fleetId: id, fleetData: form })).unwrap();
      toast.success("Fleet updated successfully!");
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
        className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <h2 className="text-3xl font-bold text-purple-700 col-span-full text-center mb-2 uppercase">
          Edit Fleet Details
        </h2>

        {[
          { label: "Car Name", name: "carName", type: "text" },
          { label: "Model", name: "model", type: "text" },
          { label: "Manufacturing Year", name: "year", type: "date" },
          { label: "Registration Number", name: "registration", type: "text" },
          { label: "Fuel Type", name: "fuel", type: "text" },
          { label: "Insurance", name: "insurance", type: "text" },
          { label: "Owner", name: "owner", type: "text" },
          { label: "VIN Number", name: "vin", type: "text" },
          { label: "Engine Number", name: "engine", type: "text" },
          { label: "Color", name: "color", type: "text" },
          { label: "Type", name: "type", type: "text" },
          { label: "Odometer", name: "odometer", type: "number", min: 0 },
          { label: "Transmission", name: "transmission", type: "text" },
          { label: "Registration Expiry", name: "regExpiry", type: "date" },
          { label: "Inspection Expiry", name: "inspExpiry", type: "date" },
          { label: "Business Use", name: "businessUse", type: "text" },
        ].map(({ label, name, type, ...rest }) => (
          <div key={name}>
            <Label htmlFor={name} className={`mb-2`}>
              {label}
            </Label>
            <Input
              id={name}
              name={name}
              type={type}
              placeholder={label}
              value={
                type === "date" ? formatDate(form[name]) : form[name] || ""
              }
              onChange={handleChange}
              disabled={submitLoading}
              {...rest}
            />
          </div>
        ))}

        {/* Status Accordion */}
        <div className="col-span-full">
          <Label className="mb-2 inline-block">Status</Label>
          <Accordion type="single" collapsible>
            <AccordionItem value="status">
              <AccordionTrigger className="bg-white text-purple-700 px-4 py-3 rounded-xl font-semibold">
                {form.status ? `Selected: ${form.status}` : "Select Status"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 px-2 py-2">
                  <button
                    type="button"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      form.status === "Available"
                        ? "bg-purple-100 border-purple-400 text-purple-700"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setForm({ ...form, status: "Available" })}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      form.status === "Rented"
                        ? "bg-purple-100 border-purple-400 text-purple-700"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setForm({ ...form, status: "Rented" })}
                  >
                    Rented
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {submitError && (
          <div className="col-span-full text-center text-red-600">
            {submitError}
          </div>
        )}

        <div className="col-span-full flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            className={`cursor-pointer`}
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
            {submitLoading ? "Updating..." : "Update Fleet"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFleetPage;
