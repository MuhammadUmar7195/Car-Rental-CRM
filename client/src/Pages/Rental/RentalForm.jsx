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
import RentalInvoice from "./RentalInvoice";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

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
          // for example parseFloat(3.15 rupees) => output: willbe 3.15
          bond: parseFloat(formData.bond),
          advanceRent: parseFloat(formData.advanceRent),
          setPrice: parseFloat(formData.setPrice),
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/add`,
        rentalData,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        const rentalDoc = (
          <RentalInvoice
            selectedCar={selectedCar}
            selectedCustomer={selectedCustomer}
            rentalData={rentalData.rentalData}
          />
        );

        const blob = await pdf(rentalDoc).toBlob();
        saveAs(blob, "RentalInvoice.pdf"); 

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64pdf = reader.result.split(",")[1]; // strip data:application/pdf;base64,

          await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/send-invoice`,
            {
              email: selectedCustomer.email,
              pdfBase64: base64pdf,
            },
            { withCredentials: true }
          );
        };
        reader.readAsDataURL(blob);
        toast.success("Rental created and send on customer email successfully!");
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
