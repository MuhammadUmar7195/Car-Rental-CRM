import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { getAllInventory } from "@/store/Slices/inventory.slice";
import { postWalkInService } from "@/store/Slices/walkInService.slice";
import { PuffLoader } from "react-spinners";
import { IoChevronBackSharp } from "react-icons/io5";

const WalkInServiceCustomer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    carModel: "",
    carRegistrationNumber: "",
    description: "",
    servicedBy: "",
  });
  const [cart, setCart] = useState([]);

  const { inventory, loading: inventoryLoading, error: inventoryError } = useSelector(
    (state) => state?.inventory || {}
  );
  const { loading: serviceLoading } = useSelector(
    (state) => state?.walkInService || {}
  );

  useEffect(() => {
    dispatch(getAllInventory());
  }, [dispatch]);

  // Calculate total cost from inventory cart
  const totalCost = cart.reduce(
    (sum, item) => sum + (item.sellingPrice || 0) * (item.quantity || 1),
    0
  );

  const isFormValid =
    form.customerName.trim() &&
    form.phone.trim() &&
    form.carModel.trim() &&
    form.carRegistrationNumber.trim() &&
    form.description.trim() &&
    form.servicedBy.trim() &&
    cart.length > 0;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Add item to cart with quantity selection
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: Math.min(i.quantity + 1, item.quantity) }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const handleQuantityChange = (id, qty, maxQty) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id
          ? { ...i, quantity: Math.max(1, Math.min(qty, maxQty)) }
          : i
      )
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill all required fields and add inventory items.");
      return;
    }
    const walkInService = {
      ...form,
      itemsUsed: cart.map((item) => ({
        inventoryItem: item._id,
        quantityUsed: item.quantity,
        name: item.carName,
        carModel: item.carModel,
        price: item.sellingPrice,
      })),
      totalCost,
      status: "Pending",
    };
    try {
      await dispatch(postWalkInService(walkInService)).unwrap();
      toast.success("Walk-in service order created!");
      navigate("/dashboard/pos/walk-in-history");
    } catch (err) {
      toast.error(err || "Failed to create walk-in service order");
    }
  };

  return (
    <>
      <div className="flex justify-end -mb-4">
        <Link
          to="/dashboard/pos/walk-in-history"
          className="inline-flex items-center hover:text-red-400 hover:underline gap-2 rounded-lg transition cursor-pointer"
        >
          <span className="text-xs uppercase">Walk-in History</span>
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto shadow-2xl rounded-3xl border border-gray-200">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between mb-10">
              <Button
                onClick={() => navigate("/dashboard/pos")}
                className="font-semibold bg-purple-700 text-white hover:bg-purple-800 cursor-pointer rounded-full p-2"
              >
                <IoChevronBackSharp size={20} />
              </Button>
              <h2 className="text-2xl md:text-3xl font-bold text-purple-700 text-center flex-1">
                Walk-in Customer Service
              </h2>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                  className="py-3 text-base"
                />
                <Label htmlFor="phone" className="mt-4">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="py-3 text-base"
                />
                <Label htmlFor="servicedBy" className="mt-4">
                  Serviced By <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="servicedBy"
                  name="servicedBy"
                  value={form.servicedBy}
                  onChange={handleChange}
                  placeholder="Technician name"
                  required
                  className="py-3 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carModel">
                  Car Model <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="carModel"
                  name="carModel"
                  value={form.carModel}
                  onChange={handleChange}
                  placeholder="e.g. Altis 1.6"
                  required
                  className="py-3 text-base"
                />
                <Label htmlFor="carRegistrationNumber" className="mt-4">
                  Registration Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="carRegistrationNumber"
                  name="carRegistrationNumber"
                  value={form.carRegistrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. ABC-123"
                  required
                  className="py-3 text-base"
                />
                <Label htmlFor="description" className="mt-4">
                  Service Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the service"
                  required
                  className="py-3 text-base"
                />
              </div>
            </form>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Inventory Items
              </h3>
              {inventoryLoading ? (
                <div className="flex justify-center items-center py-10">
                  <PuffLoader color="#9333ea" size={48} />
                </div>
              ) : inventoryError ? (
                <div className="text-center py-8 text-red-500 font-semibold">
                  {inventoryError}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {inventory && inventory.length > 0 ? (
                    inventory.map((item) => (
                      <div
                        key={item._id}
                        className="border rounded-xl p-4 bg-white shadow flex flex-col gap-3"
                      >
                        <div className="font-bold text-lg text-purple-700">
                          {item.carName}
                        </div>
                        <div className="text-gray-600 text-sm">
                          Model: {item.carModel}
                        </div>
                        <div className="text-gray-600 text-sm">
                          Stock: {item.quantity}
                        </div>
                        <div className="text-gray-800 font-semibold">
                          Price: ${item.sellingPrice}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 cursor-pointer"
                            onClick={() => handleAddToCart(item)}
                            disabled={cart.some((i) => i._id === item._id)}
                          >
                            Add
                          </Button>
                          {cart.some((i) => i._id === item._id) && (
                            <>
                              <input
                                type="number"
                                min={1}
                                max={item.quantity}
                                value={
                                  cart.find((i) => i._id === item._id)
                                    ?.quantity || 1
                                }
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item._id,
                                    Number(e.target.value),
                                    item.quantity
                                  )
                                }
                                className="w-16 border rounded px-2 py-1 text-base"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-400 cursor-pointer"
                                onClick={() => handleRemoveFromCart(item._id)}
                              >
                                Remove
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center text-gray-500 py-8">
                      No inventory items found.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
              <span className="font-semibold text-purple-700 text-lg">
                Total Cost: ${totalCost.toLocaleString()}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || serviceLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl font-bold text-lg cursor-pointer"
              >
                {serviceLoading ? "Submitting..." : "Create Service Order"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WalkInServiceCustomer;
