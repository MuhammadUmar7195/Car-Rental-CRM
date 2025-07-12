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

const RentalForm = ({ selectedCar, selectedCustomer }) => {
  const [formData, setFormData] = useState({
    rentalDate: "",
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

    // Basic validation
    if (!formData.rentalDate || !formData.purpose || !formData.setPrice) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const rentalData = {
        customerId: selectedCustomer._id,
        fleetId: selectedCar._id,
        rentalData: {
          ...formData,
          bond: parseFloat(formData.bond),
          advanceRent: parseFloat(formData.advanceRent),
          setPrice: parseFloat(formData.setPrice),
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/create-rental`,
        rentalData,
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate("/rental-success"); // Redirect to success page
      }
    } catch (err) {
      console.error(err);
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
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <Label className="block text-sm font-medium mb-1">Selected Car</Label>
          <Input
            value={
              selectedCar
                ? `${selectedCar.carName} (${selectedCar.registration})`
                : "None selected"
            }
            readOnly
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">Customer</Label>
          <Input
            value={
              selectedCustomer
                ? `${selectedCustomer.name} (${selectedCustomer.licenseNumber})`
                : "None selected"
            }
            readOnly
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">
            Rental Date <span className="text-red-500">*</span>{" "}
          </Label>
          <Input
            type="date"
            name="rentalDate"
            value={formData.rentalDate}
            onChange={handleChange}
            required
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
          <Label className="block text-sm font-medium mb-1">Bond Amount</Label>
          <Input
            type="number"
            name="bond"
            value={formData.bond}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-1">Advance Rent</Label>
          <Input
            type="number"
            name="advanceRent"
            value={formData.advanceRent}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <PuffLoader size={20} color="#ffffff" /> : "Create Rental"}
        </Button>
      </form>
    </Card>
  );
};

export default RentalForm;
