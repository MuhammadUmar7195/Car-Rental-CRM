import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "@/store/Slices/customer.slice";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { assignCustomerToAccounting } from "@/store/Slices/accouting.slice";
import { getRentalsByCustomerId } from "@/store/Slices/rental.slice";

const AssignCustomerDialog = ({ accountingId, onClose }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [assigned, setAssigned] = useState(false);
  const [confirmCustomerId, setConfirmCustomerId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkingAssignment, setCheckingAssignment] = useState(false);
  const [selectedRentalOrderId, setSelectedRentalOrderId] = useState(null);

  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state?.customer || {});
  const { loading: assignLoading, error: assignError } = useSelector(
    (state) => state?.accounting || {}
  );
  const { rentals, loading: rentalsLoading } = useSelector(
    (state) => state.rental || {}
  );

  // Check if accounting entry is already assigned
  useEffect(() => {
    const checkIfAssigned = async () => {
      if (!accountingId) return;
      try {
        setCheckingAssignment(true);
        // Updated API endpoint to match your backend
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/accounting/check-assigned/${accountingId}`,
          { withCredentials: true }
        );
        setAssigned(res.data?.isAssigned || false);
      } catch (err) {
        console.error("Assignment check failed:", err);
        setAssigned(false);
      } finally {
        setCheckingAssignment(false);
      }
    };
    checkIfAssigned();
  }, [accountingId]);

  // Only fetch customers if not already present
  useEffect(() => {
    if (open && (!customers || customers.length === 0)) {
      dispatch(getAllCustomers());
    }
  }, [open, dispatch, customers]);

  useEffect(() => {
    if (confirmCustomerId) {
      dispatch(getRentalsByCustomerId(confirmCustomerId));
    }
  }, [dispatch, confirmCustomerId]);

  const handleAssign = useCallback(
    (customerId, rentalOrderId) => {
      if (!rentalOrderId) {
        toast.error("Please select a rental order.");
        return;
      }
      dispatch(
        assignCustomerToAccounting({ customerId, accountingId, rentalOrderId })
      )
        .unwrap()
        .then(() => {
          toast.success("Customer and rental order assigned successfully!");
          setAssigned(true);
          setOpen(false);
          onClose?.();
        })
        .catch((err) => {
          toast.error(err || "Failed to assign customer.");
        });
    },
    [dispatch, accountingId, onClose]
  );

  const handleConfirmAssign = useCallback(() => {
    if (confirmCustomerId && selectedRentalOrderId) {
      handleAssign(confirmCustomerId, selectedRentalOrderId);
      setShowConfirm(false);
      setConfirmCustomerId(null);
      setSelectedRentalOrderId(null);
    } else {
      toast.error("Please select a rental order.");
    }
  }, [confirmCustomerId, selectedRentalOrderId, handleAssign]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers?.filter((customer) => {
      return (
        customer?.name?.toLowerCase().includes(query) ||
        customer?.phone?.toLowerCase().includes(query) ||
        customer?.licenseNo?.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  if (checkingAssignment) {
    return (
      <Button
        className="bg-gray-400 text-white text-xs px-4 py-1 rounded"
        disabled
      >
        <PuffLoader color="#fff" size={12} />
      </Button>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={`${
              assigned
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            } text-xs px-4 py-1 rounded cursor-pointer`}
            onClick={() => !assigned && setOpen(true)}
            disabled={assigned}
          >
            {assigned ? "✓ Assigned" : "Assign Customer"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Customer</DialogTitle>
            <DialogDescription>
              Search and select a customer by name, phone, or license number.
            </DialogDescription>
          </DialogHeader>

          {loading || assignLoading ? (
            <div className="flex justify-center py-6">
              <PuffLoader color="#9333ea" size={32} />
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Search by name, phone, or license number..."
                className="mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="max-h-64 overflow-y-auto">
                {filteredCustomers?.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer._id}
                      className="flex justify-between items-center py-2 px-3 border-b transition cursor-pointer hover:bg-purple-50"
                      onClick={() => {
                        setConfirmCustomerId(customer._id);
                        setShowConfirm(true);
                      }}
                    >
                      <span className="font-medium text-purple-700 w-1/3 truncate">
                        {customer?.name || "N/A"}
                      </span>
                      <span className="text-xs text-gray-500 w-1/3 truncate">
                        {customer?.phone || "N/A"}
                      </span>
                      <span className="text-xs text-gray-500 w-1/3 truncate">
                        {customer?.licenseNo || "N/A"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No customers found.
                  </div>
                )}
              </div>
              {assignError && (
                <div className="text-red-500 text-xs text-center">
                  {assignError}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full mt-2 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to assign this customer to the accounting entry?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Rental Order Selection inside the dialog */}
          <div className="my-3">
            <label className="block mb-1 text-sm font-medium">
              Select Rental Order
            </label>
            {rentals?.length === 0 && (
              <div className="text-gray-500 text-center py-2">
                No rental orders found.
              </div>
            )}
            {rentals?.map((order) => (
              <div
                key={order._id}
                className={`border rounded px-3 py-2 mb-2 cursor-pointer transition ${
                  selectedRentalOrderId === order._id
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setSelectedRentalOrderId(order._id)}
              >
                <span className="font-medium text-purple-700">
                  {order.customer?.name || "N/A"}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  - {order.purpose} (
                  {new Date(order.bookingDate).toLocaleDateString()})
                </span>
                {selectedRentalOrderId === order._id && (
                  <span className="ml-2 text-green-600 font-bold">✓</span>
                )}
              </div>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              onClick={handleConfirmAssign}
              disabled={!selectedRentalOrderId}
            >
              Yes, Assign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default React.memo(AssignCustomerDialog);
