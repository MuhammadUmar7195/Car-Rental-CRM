import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaBoxes, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { getAllInventory } from "@/store/Slices/inventory.slice";
import { postService } from "@/store/Slices/service.slice";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";

const PosInventory = ({ cart, setCart, selectedCar }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [servicedBy, setServicedBy] = useState("");
  const dispatch = useDispatch();
  const { inventory, loading, error } = useSelector(
    (state) => state?.inventory || {}
  );

  useEffect(() => {
    dispatch(getAllInventory());
  }, [dispatch]);

  const addToCart = (item) => {
    if (item.quantity <= 0) {
      toast.error("Item is out of stock!");
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      // Check if adding one more exceeds available stock
      if (existingItem.quantity >= item.quantity) {
        toast.error("Cannot add more than available stock!");
        return;
      }
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    // Find the original inventory item to check stock
    const originalItem = inventory?.find((item) => item._id === id);
    if (originalItem && newQuantity > originalItem.quantity) {
      toast.info("Available Stock is Limited");
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const getTotalAmount = () => {
    return cart.reduce(
      (total, item) => total + (item.sellingPrice || 0) * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    setDescription("");
    setServicedBy("");
  };

  const handleCheckout = async () => {
    if (!selectedCar) {
      toast.info("Please select a car first!");
      return;
    }

    if (cart.length === 0) {
      toast.info("Please add at least one item to the cart!");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a service description!");
      return;
    }

    if (!servicedBy.trim()) {
      toast.error("Please enter who serviced the car!");
      return;
    }

    const itemsUsed = cart.map((item) => ({
      inventoryItem: item._id,
      quantityUsed: item.quantity,
    }));

    const serviceData = {
      carId: selectedCar._id,
      itemsUsed,
      description: description.trim(),
      servicedBy: servicedBy.trim(),
    };

    try {
      await dispatch(postService(serviceData)).unwrap();
      toast.success("Service order created successfully!");
      clearCart();
      setIsCartOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error creating service order"
      );
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 relative">
      {/* Inventory Grid */}
      <Card className="bg-white shadow-md">
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <PuffLoader color="#9333ea" size={48} />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-red-500 font-semibold text-lg">
                {error}
              </span>
            </div>
          ) : !inventory || inventory.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-gray-500 text-lg">
                No inventory items found
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {inventory.map((item) => (
                <Card
                  key={item._id}
                  className="hover:shadow-md transition-all duration-300 border-2 hover:border-purple-300 hover:scale-105"
                >
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                        <FaBoxes className="text-purple-600 text-2xl" />
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-1 text-center truncate">
                      {item.carName || "No Name"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 text-center truncate">
                      {item.carModel || "No Model"}
                    </p>
                    <p className="text-lg font-bold text-purple-600 mb-2 text-center">
                      Rs {(item.sellingPrice || 0).toLocaleString()}
                    </p>

                    <div className="flex items-center justify-center mb-3">
                      <Badge variant="ghost">Stock: {item.quantity || 0}</Badge>
                    </div>

                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 cursor-pointer"
                      onClick={() => addToCart(item)}
                      disabled={(item.quantity || 0) === 0}
                    >
                      <FaPlus className="mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Cart Button - Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogTrigger asChild>
            <Button
              className={`bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                cart.length > 0 ? "animate-bounce" : ""
              }`}
            >
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {/* Cart Counter Badge */}
                {cart.length > 0 && (
                  <div className="absolute -top-6 -right-7 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg">
                    {getTotalItems() > 99 ? "99+" : getTotalItems()}
                  </div>
                )}
              </div>
            </Button>
          </DialogTrigger>

          {/* Cart Dialog */}
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2 text-xl">
                <FaShoppingCart className="fill-purple-600" />
                Service Cart ({getTotalItems()} items)
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Review your selected services and proceed to order.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-xl">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Add items from inventory to get started
                  </p>
                </div>
              ) : (
                <>
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                      >
                        {/* Item Info */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-lg uppercase">
                            {item.carName || "No Name"}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            Model: {item.carModel || "No Model"}
                          </p>
                          <p className="text-lg font-bold text-purple-600">
                            Rs. {(item.sellingPrice || 0).toLocaleString()} each
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-white border-2 border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 lg:ml-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer border-0"
                            >
                              <FaMinus className="w-3 h-3" />
                            </Button>

                            <div className="px-3 py-1 min-w-[50px] text-center">
                              <span className="font-bold text-lg text-gray-800 select-none">
                                {item.quantity || 0}
                              </span>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="h-8 w-8 p-0 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors duration-200 cursor-pointer border-0"
                              disabled={(() => {
                                const originalItem = inventory?.find(
                                  (inv) => inv._id === item._id
                                );
                                return (
                                  originalItem &&
                                  item.quantity >= originalItem.quantity
                                );
                              })()}
                            >
                              <FaPlus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Total Price */}
                          <div className="text-right min-w-[100px]">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="font-bold text-lg text-gray-800">
                              Rs.{" "}
                              {(
                                (item.sellingPrice || 0) * item.quantity
                              ).toLocaleString()}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item._id)}
                            className="h-8 w-8 p-0 cursor-pointer bg-red-400 hover:bg-red-500"
                          >
                            <MdDelete className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Service Details Form */}
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Service Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="servicedBy"
                          className="text-sm font-medium text-gray-700"
                        >
                          Serviced By <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="servicedBy"
                          placeholder="Enter technician name"
                          value={servicedBy}
                          onChange={(e) => setServicedBy(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700"
                        >
                          Service Description{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="description"
                          placeholder="Describe the service performed..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="space-y-4 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                    {selectedCar && (
                      <Card className="mb-4 border-blue-300 bg-blue-50">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="text-blue-800 font-medium">
                            🚗 {selectedCar.carName}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-blue-700 border-blue-300"
                          >
                            {selectedCar.registration}
                          </Badge>
                        </CardContent>
                      </Card>
                    )}
                    {!selectedCar && (
                      <p className="text-center uppercase">
                        ⚠️ Add your car before service order
                      </p>
                    )}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-medium">Total Items:</span>
                        <span className="font-semibold text-purple-600">
                          {getTotalItems()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-2xl">
                        <span className="font-bold">Grand Total:</span>
                        <span className="font-bold text-purple-600">
                          Rs. {getTotalAmount().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3 cursor-pointer"
                        onClick={handleCheckout}
                        disabled={
                          !selectedCar ||
                          cart.length === 0 ||
                          !description.trim() ||
                          !servicedBy.trim()
                        }
                      >
                        <FaShoppingCart className="mr-2" />
                        Create Service Order
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="px-6 py-3 text-lg hover:bg-gray-100 cursor-pointer"
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PosInventory;
