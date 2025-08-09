import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { deleteInventory } from "@/store/Slices/inventory.slice";
import { toast } from "sonner";
import DeleteDialog from "@/components/Common/DeleteDialog";

const InventoryCart = ({ filteredInventory }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteInventory(id))
      .then(() => {
        toast.success("Inventory deleted successfully");
      })
      .catch((error) => {
        toast.error(`Failed to delete inventory: ${error.message}`);
      });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 w-full px-2 md:px-4">
      {filteredInventory.map((inv, index) => (
        <Card
          key={index}
          className="shadow-xl border-0 rounded-3xl bg-gradient-to-br from-purple-50 to-white hover:shadow-2xl transition-all duration-300"
        >
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold border-2 border-purple-200">
                {inv.inventoryName?.[0] || "C"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-2xl text-purple-800 truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[260px]">
                    {inv.inventoryName || "N/A"}
                  </h3>
                  <button
                    className="lg:ml-40 rounded-full hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 transition flex-shrink-0 cursor-pointer"
                    aria-label="Edit car"
                    onClick={() =>
                      navigate(`/dashboard/inventory/edit/${inv._id}`)
                    }
                    tabIndex={0}
                  >
                    <MdModeEditOutline className="w-5 h-5 text-purple-600" />
                  </button>
                </div>
                <div className="flex sm:flex-row gap-1 sm:gap-3 text-gray-500 text-sm">
                  <span className="font-semibold">
                    Model:{" "}
                    <span className="font-normal">{inv.carModel || "N/A"}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">
                Quantity: {inv.quantity ?? "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Cost Price: $ {inv.costPrice ?? "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Selling Price: $ {inv.sellingPrice ?? "N/A"}
              </span>
            </div>
            <div className="mt-auto flex justify-between items-end pt-4">
              <div className="flex gap-2">
                <DeleteDialog
                  triggerButton={
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-500 hover:text-red-600 rounded-full cursor-pointer"
                      type="button"
                    >
                      <motion.div
                        whileHover={{ rotate: -20 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-base"
                      >
                        <MdDeleteOutline />
                      </motion.div>
                    </Button>
                  }
                  onConfirm={() => handleDelete(inv._id)}
                />
                <Button
                  className="px-4 py-1 rounded-lg bg-purple-600 text-white text-xs font-semibold shadow hover:bg-purple-700 transition-colors cursor-pointer flex items-center gap-2"
                  type="button"
                  onClick={() => navigate(`/dashboard/inventory/${inv._id}`)}
                >
                  Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InventoryCart;
