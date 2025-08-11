import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { postFleet } from "@/store/Slices/fleet.slice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import useCarImageUpload from "@/hooks/useCarImageUpload";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const FleetAddForm = ({ onAdd, onCancel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.fleet || {});
  const { uploadImage, uploading, uploadError, clearError } = useCarImageUpload();

  const initialForm = {
    carName: "",
    model: "",
    year: "",
    pricePerDay: "",
    registration: "",
    insurance: "",
    fuel: "",
    owner: "",
    engine: "",
    color: "",
    type: "",
    vin: "",
    odometer: "",
    transmission: "",
    regExpiry: "",
    inspExpiry: "",
    businessUse: "",
    category: "",
    status: "",
    images: [], 
  };

  const [form, setForm] = useState({ ...initialForm });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  // Category options based on your enum
  const categoryOptions = [
    {
      value: "Economy",
      label: "Economy",
      description: "Budget-friendly vehicles",
    },
    {
      value: "Luxury",
      label: "Luxury",
      description: "Premium high-end vehicles",
    },
    { value: "SUV", label: "SUV", description: "Sport Utility Vehicles" },
    {
      value: "Sports",
      label: "Sports",
      description: "High-performance sports cars",
    },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (minimum 1MB)
      if (file.size < 1 * 1024 * 1024) {
        toast.error("Image size should be at least 1MB for better quality");
        return;
      }

      // Validate file size (maximum 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should not exceed 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select only image files");
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous upload state
      setUploadedImageUrl(null);
      clearError();
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const imageUrl = await uploadImage(selectedImage);
      setUploadedImageUrl(imageUrl);
      
      // Update form with image data in the format expected by your backend
      setForm({
        ...form,
        images: [{
          url: imageUrl,
          altText: `${form.carName} ${form.model}`.trim() || "Car image"
        }]
      });
      
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setForm({ ...form, images: [] });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that image is uploaded if selected
    if (selectedImage && !uploadedImageUrl) {
      toast.error("Please upload the selected image before submitting");
      return;
    }

    try {
      const res = await dispatch(postFleet(form)).unwrap();
      if (onAdd) onAdd(res);
      setForm({ ...initialForm });
      setSelectedImage(null);
      setImagePreview(null);
      setUploadedImageUrl(null);
      toast.success("Car added to fleet successfully!");
      onCancel();
    } catch (err) {
      console.error("Failed to add car:", err);
      toast.error(err || "Failed to add car to fleet");
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-purple-700 col-span-full text-center uppercase">
          Add Car to Fleet
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-6 right-8 text-gray-400 hover:text-purple-700 text-2xl focus:outline-none cursor-pointer z-10"
          aria-label="Close form"
        >
          <IoMdClose size={24} />
        </button>

        {/* Image Upload Section */}
        <div className="col-span-full">
          <Label className="mb-2 inline-block">
            Car Image <span className="text-gray-500">(Minimum 1MB recommended)</span>
          </Label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-purple-300 transition-colors">
            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Car preview" 
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* File Info */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">File:</span> {selectedImage?.name}</p>
                  <p><span className="font-medium">Size:</span> {formatFileSize(selectedImage?.size)}</p>
                  <p><span className="font-medium">Type:</span> {selectedImage?.type}</p>
                </div>
                
                {/* Upload/Status Section */}
                <div className="flex items-center gap-3">
                  {!uploadedImageUrl ? (
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload to Cloud
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Image uploaded successfully!
                    </div>
                  )}
                </div>
                
                {/* Error display */}
                {uploadError && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    {uploadError}
                  </div>
                )}
              </div>
            ) : (
              <Label htmlFor="carImage" className="cursor-pointer flex flex-col items-center justify-center h-64 hover:bg-gray-100 transition-colors rounded-lg">
                <Image className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2 text-center text-lg font-medium">Click to select car image</p>
                <p className="text-gray-500 text-sm text-center">PNG, JPG, JPEG</p>
                <p className="text-gray-500 text-sm text-center">Minimum 1MB, Maximum 5MB</p>
                <p className="text-purple-600 text-sm text-center mt-2 font-medium">High quality images recommended</p>
              </Label>
            )}

            <input
              id="carImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Rest of your form fields */}
        {[
          "carName",
          "model",
          "year",
          "pricePerDay",
          "registration",
          "fuel",
          "insurance",
          "owner",
          "vin",
          "engine",
          "color",
          "type",
          "odometer",
          "transmission",
          "regExpiry",
          "inspExpiry",
          "businessUse",
        ].map((name) => {
          const labelMap = {
            carName: "Car Name",
            model: "Model",
            year: "Manufacturing Year",
            pricePerDay: "Price Per Day",
            registration: "Registration Number",
            fuel: "Fuel Type",
            insurance: "Insurance",
            owner: "Owner",
            vin: "VIN Number",
            engine: "Engine Number",
            color: "Color",
            type: "Type",
            odometer: "Odometer",
            transmission: "Transmission",
            regExpiry: "Expiry Date",
            inspExpiry: "Inspection Report Expiry Date",
            businessUse: "Business Use",
          };
          const typeMap = {
            year: "date",
            regExpiry: "date",
            inspExpiry: "date",
            odometer: "number",
            pricePerDay: "number",
          };
          const stepMap = {
            pricePerDay: "0.01",
          };
          const minMap = {
            pricePerDay: "0",
            odometer: "0",
          };

          return (
            <div key={name}>
              <Label htmlFor={name} className="mb-2 inline-block">
                {labelMap[name]} <span className="text-red-500">*</span>
              </Label>
              <Input
                id={name}
                name={name}
                type={typeMap[name] || "text"}
                step={stepMap[name]}
                min={minMap[name]}
                placeholder={labelMap[name]}
                value={form[name]}
                onChange={handleChange}
                required
              />
            </div>
          );
        })}

        {/* Category Accordion */}
        <div className="col-span-full">
          <Label className="mb-2 inline-block">
            Category <span className="text-red-500">*</span>
          </Label>
          <Accordion type="single" collapsible>
            <AccordionItem value="category">
              <AccordionTrigger className="bg-white text-purple-700 px-4 py-3 rounded-xl font-semibold border border-gray-300">
                {form.category
                  ? `Selected: ${form.category}`
                  : "Select Category"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2 py-2">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                        form.category === option.value
                          ? "bg-purple-100 border-purple-400 text-purple-700 shadow-md"
                          : "bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50 cursor-pointer"
                      }`}
                      onClick={() =>
                        setForm({ ...form, category: option.value })
                      }
                    >
                      <div className="font-semibold text-lg">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Status Accordion */}
        <div className="col-span-full">
          <Label className="mb-2 inline-block">
            Status <span className="text-red-500">*</span>
          </Label>
          <Accordion type="single" collapsible>
            <AccordionItem value="status">
              <AccordionTrigger className="bg-white text-purple-700 px-4 py-3 rounded-xl font-semibold border border-gray-300">
                {form.status ? `Selected: ${form.status}` : "Select Status"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 px-2 py-2">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      form.status === "Available"
                        ? "bg-green-100 border-green-400 text-green-700 shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50 cursor-pointer"
                    }`}
                    onClick={() => setForm({ ...form, status: "Available" })}
                  >
                    <div className="font-semibold">Available</div>
                    <div className="text-sm">Ready for rental</div>
                  </button>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                      form.status === "Rented"
                        ? "bg-red-100 border-red-400 text-red-700 shadow-md"
                        : "bg-white border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50 cursor-pointer"
                    }`}
                    onClick={() => setForm({ ...form, status: "Rented" })}
                  >
                    <div className="font-semibold">Rented</div>
                    <div className="text-sm">Currently unavailable</div>
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="col-span-full flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-700 text-white cursor-pointer px-6 py-2"
            disabled={loading || !form.category || !form.status || uploading}
          >
            {loading ? "Adding..." : "Add Car"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FleetAddForm;
