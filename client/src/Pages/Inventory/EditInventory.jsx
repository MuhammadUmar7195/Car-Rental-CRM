import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSingleInventory, updateInventoryByID } from "@/store/Slices/inventory.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";

const EditInventory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleInventory, loading, error } = useSelector(
    (state) => state.inventory || {}
  );
  
  const [form, setForm] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!singleInventory || singleInventory._id !== id) {
      dispatch(getSingleInventory(id));
    } else {
      setForm({ ...singleInventory });
    }
  }, [dispatch, id, singleInventory]);

  useEffect(() => {
    if (singleInventory && singleInventory._id === id) {
      setForm({ ...singleInventory });
    }
  }, [singleInventory, id]);

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
        updateInventoryByID({ inventoryId: id, inventoryData: form })
      ).unwrap();
      toast.success("Inventory updated successfully!");
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
          Edit Inventory
        </h2>

        {[
          { label: "Name", name: "inventoryName", type: "text" },
          { label: "Model", name: "carModel", type: "text" },
          { label: "Quantity", name: "quantity", type: "number", min: 0 },
          { label: "Cost Price", name: "costPrice", type: "number", min: 0 },
          { label: "Selling Price", name: "sellingPrice", type: "number", min: 0 },
        ].map(({ label, name, type, ...rest }) => (
          <div key={name}>
            <Label htmlFor={name} className="mb-2">
              {label} <span className="text-red-500">*</span>
            </Label>
            <Input
              id={name}
              name={name}
              type={type}
              placeholder={label}
              value={form[name] ?? ""}
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
            {submitLoading ? "Updating..." : "Update Inventory"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditInventory;
