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

const AssignCustomerDialog = ({ accountingId, onClose }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [assigned, setAssigned] = useState(false);
  const [confirmCustomerId, setConfirmCustomerId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkingAssignment, setCheckingAssignment] = useState(false);

  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state?.customer || {});
  const { loading: assignLoading, error: assignError } = useSelector(
    (state) => state?.accounting || {}
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

  const handleAssign = useCallback(
    (customerId) => {
      // Updated dispatch to use the correct thunk from accounting slice
      dispatch(assignCustomerToAccounting({ customerId, accountingId }))
        .unwrap()
        .then(() => {
          toast.success("Customer assigned successfully!");
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
    if (confirmCustomerId) {
      handleAssign(confirmCustomerId);
      setShowConfirm(false);
      setConfirmCustomerId(null);
    }
  }, [confirmCustomerId, handleAssign]);

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
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              onClick={handleConfirmAssign}
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
