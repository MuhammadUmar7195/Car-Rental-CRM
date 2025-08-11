import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleFleet, updateFleet } from "../../store/Slices/fleet.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import { Upload, X, Image, CheckCircle, Edit } from "lucide-react";
import useCarImageUpload from "@/hooks/useCarImageUpload";
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
  const { uploadImage, uploading, uploadError, clearError } =
    useCarImageUpload();

  const [form, setForm] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Category options matching FleetAddForm
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

  // Image handling functions
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
      if (!file.type.startsWith("image/")) {
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

      // Update form with image data
      setForm({
        ...form,
        images: [
          {
            url: imageUrl,
            altText: `${form.carName} ${form.model}`.trim() || "Car image",
          },
        ],
      });

      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeNewImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    clearError();
  };

  const removeExistingImage = () => {
    setForm({ ...form, images: [] });
    toast.success("Existing image will be removed on save");
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get current image URL
  const getCurrentImageUrl = () => {
    if (uploadedImageUrl) return uploadedImageUrl;
    if (form?.images && form.images.length > 0) return form.images[0].url;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");

    // Validate that image is uploaded if selected
    if (selectedImage && !uploadedImageUrl) {
      toast.error("Please upload the selected image before submitting");
      setSubmitLoading(false);
      return;
    }

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
        className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold text-purple-700 col-span-full text-center mb-2 uppercase">
          Edit Fleet Details
        </h2>

        {/* Current Image Display & Upload Section */}
        <div className="col-span-full">
          <Label className="mb-2 inline-block">
            Car Image <span className="text-gray-500">(Optional)</span>
          </Label>

          {/* Current Image Display */}
          {getCurrentImageUrl() && !showImageUpload && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={getCurrentImageUrl()}
                  alt="Current car image"
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setShowImageUpload(true)}
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors shadow-lg cursor-pointer"
                    title="Change image"
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Current car image • Click edit to change
              </p>
            </div>
          )}

          {/* Image Upload Section */}
          {(showImageUpload || !getCurrentImageUrl()) && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:border-purple-300 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="New car image preview"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <Button
                      type="button"
                      onClick={removeNewImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                    >
                      <X size={16} />
                    </Button>
                  </div>

                  {/* File Info */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">File:</span>{" "}
                      {selectedImage?.name}
                    </p>
                    <p>
                      <span className="font-medium">Size:</span>{" "}
                      {formatFileSize(selectedImage?.size)}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedImage?.type}
                    </p>
                  </div>

                  {/* Upload/Status Section */}
                  <div className="flex items-center gap-3">
                    {!uploadedImageUrl ? (
                      <Button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploading || submitLoading}
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
                        New image uploaded successfully!
                      </div>
                    )}

                    {showImageUpload && getCurrentImageUrl() && (
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          setShowImageUpload(false);
                          removeNewImage();
                        }}
                        disabled={uploading || submitLoading}
                      >
                        Cancel
                      </Button>
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
                <Label
                  htmlFor="carImage"
                  className="cursor-pointer flex flex-col items-center justify-center h-64 hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <Image className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2 text-center text-lg font-medium">
                    {getCurrentImageUrl()
                      ? "Click to select new car image"
                      : "Click to select car image"}
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    PNG, JPG, JPEG
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    Minimum 1MB, Maximum 5MB
                  </p>
                  <p className="text-purple-600 text-sm text-center mt-2 font-medium">
                    High quality images recommended
                  </p>
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
          )}
        </div>

        {/* Rest of your existing form fields */}
        {[
          { label: "Car Name", name: "carName", type: "text" },
          { label: "Model", name: "model", type: "text" },
          { label: "Manufacturing Year", name: "year", type: "date" },
          {
            label: "Price Per Day",
            name: "pricePerDay",
            type: "number",
            step: "0.01",
            min: 0,
          },
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
        ].map(({ label, name, type, step, min, ...rest }) => (
          <div key={name}>
            <Label htmlFor={name} className={`mb-2`}>
              {label}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id={name}
              name={name}
              type={type}
              step={step}
              min={min}
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
                      disabled={submitLoading}
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
                    disabled={submitLoading}
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
                    disabled={submitLoading}
                  >
                    <div className="font-semibold">Rented</div>
                    <div className="text-sm">Currently unavailable</div>
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
            disabled={submitLoading || uploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-700 text-white hover:bg-purple-800 cursor-pointer"
            disabled={
              submitLoading ||
              !form.category ||
              !form.status ||
              uploading ||
              (selectedImage && !uploadedImageUrl)
            }
          >
            {submitLoading ? "Updating..." : "Update Fleet"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditFleetPage;
