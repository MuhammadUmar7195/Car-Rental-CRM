import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PuffLoader } from "react-spinners";
import { FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const RentalForm = ({ selectedCar, selectedCustomer }) => {
  const [formData, setFormData] = useState({
    returnDate: "",
    bookingDate: "", // optional
    purpose: "",
    setPrice: "",
    bond: "",
    advanceRent: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCar || !selectedCustomer) {
      setError("Please select both a car and customer first");
      return;
    }

    if (!formData.purpose || !formData.setPrice) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const rentalData = {
        customerId: selectedCustomer._id,
        fleetId: selectedCar._id,
        // Send bookingDate only if admin filled it, otherwise backend uses Date.now()
        ...(formData.bookingDate && {
          bookingDate: new Date(formData.bookingDate),
        }),
        rentalData: {
          // returnDate is optional, backend handles 7-day logic
          ...(formData.returnDate && { returnDate: formData.returnDate }),
          purpose: formData.purpose,
          setPrice: parseFloat(formData.setPrice),
          bond: parseFloat(formData.bond) || 0,
          advanceRent: parseFloat(formData.advanceRent) || 0,
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/add`,
        rentalData,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success("Rental created successfully!");
        navigate("/dashboard/rental-history");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create rental");
      setError(err.response?.data?.message || "Failed to create rental");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white p-6 rounded-xl shadow-md w-full">
      <div className="text-purple-600 flex justify-center text-4xl mb-4">
        <FaFileAlt size={50} />
      </div>
      <h2 className="text-xl text-purple-500 font-semibold text-center mb-4 uppercase">
        Rental Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div>
          <Label className="block text-sm font-medium mb-1">
            Selected Car <span className="text-xs text-gray-500">(fixed)</span>
          </Label>
          <Input
            value={
              selectedCar
                ? `${selectedCar?.carName} (${selectedCar?.registration})`
                : "None selected"
            }
            readOnly
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Customer <span className="text-xs text-gray-500">(fixed)</span>
          </Label>
          <Input
            value={
              selectedCustomer
                ? `${selectedCustomer.name} (${selectedCustomer.licenseNo})`
                : "None selected"
            }
            readOnly
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Booking Date{" "}
            <span className="text-xs text-gray-500">(optional)</span>
          </Label>
          <Input
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Return Date{" "}
            <span className="text-xs text-gray-500">(optional)</span>
          </Label>
          <Input
            type="date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Purpose <span className="text-red-500">*</span>
          </Label>
          <Textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Set Price <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            name="setPrice"
            value={formData.setPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Bond Amount
            <span className="text-red-500"> *</span>
          </Label>
          <Input
            type="number"
            name="bond"
            value={formData.bond}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Advance Rent
            <span className="text-red-500"> *</span>
          </Label>
          <Input
            type="number"
            name="advanceRent"
            value={formData.advanceRent}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
          disabled={loading}
        >
          {loading ? <PuffLoader size={20} color="#ffffff" /> : "Create Rental"}
        </Button>
      </form>
    </Card>
  );
};

export default RentalForm;
