import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { getSingleInventory } from "@/store/Slices/inventory.slice";

const SingleInventoryDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleInventory, loading, error } =
    useSelector((state) => state?.inventory) || {};

  useEffect(() => {
    if (!singleInventory || singleInventory._id !== id) {
      dispatch(getSingleInventory(id));
    }
  }, [dispatch, id, singleInventory]);

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

  if (!singleInventory) {
    return (
      <div className="text-center py-10 text-lg text-gray-500">
        Inventory not found.{" "}
        <Button variant="link" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  const inventory = singleInventory;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-muted">
      <Card className="w-full max-w-3xl shadow-xl rounded-3xl bg-white p-4 md:p-6 relative">
        <CardHeader className="flex flex-col items-center text-center">
          <Button
            onClick={() => navigate(`/dashboard/inventory`)}
            className="absolute left-4 top-4 px-3 py-2 font-semibold bg-purple-700 text-white hover:bg-purple-800 cursor-pointer rounded-full"
          >
            <IoChevronBackSharp />
          </Button>
          <CardTitle className="text-3xl font-bold text-purple-800 mb-2 uppercase">
            {inventory.inventoryName || "N/A"}
          </CardTitle>
          <CardDescription>
            <Badge
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                inventory.quantity > 0
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {inventory.quantity > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Section */}
            <div className="space-y-2 text-sm text-gray-700">
              <Info label="Car Model" value={inventory.carModel} />
              <Info label="Quantity" value={inventory.quantity} />
              <Info label="Cost Price" value={`$ ${inventory.costPrice}`} />
              <Info
                label="Selling Price"
                value={`$ ${inventory.sellingPrice}`}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              className="px-6 py-2 font-semibold border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 cursor-pointer"
              onClick={() =>
                navigate(`/dashboard/inventory/edit/${inventory._id}`)
              }
            >
              Edit Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Small reusable field display component
const Info = ({ label, value }) => (
  <div className="flex items-start gap-2">
    <span className="font-semibold min-w-[130px]">{label}:</span>
    <span className="text-gray-800">{value ?? "—"}</span>
  </div>
);

export default SingleInventoryDetail;
