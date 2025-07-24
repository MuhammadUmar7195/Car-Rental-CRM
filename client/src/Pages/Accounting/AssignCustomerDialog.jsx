import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "@/store/Slices/customer.slice";
import { postAssignCustomerAccount } from "@/store/Slices/assignCustomerAccount";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

const AssignCustomerDialog = ({ accountingId }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [assigned, setAssigned] = useState(false); // Track assignment
  const [confirmCustomerId, setConfirmCustomerId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state?.customer || {});
  const { loading: assignLoading, error: assignError } = useSelector((state) => state?.accounting || {});

  useEffect(() => {
    if (open) {
      dispatch(getAllCustomers());
    }
  }, [dispatch, open]);

  const handleAssign = (customerId) => {
    dispatch(postAssignCustomerAccount({ customerId, accountingId }))
      .unwrap()
      .then(() => {
        toast.success("Customer assigned successfully!");
        setAssigned(true); // Mark as assigned
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err || "Failed to assign customer.");
      });
  };

  const handleConfirmAssign = () => {
    if (confirmCustomerId) {
      handleAssign(confirmCustomerId);
      setShowConfirm(false);
      setConfirmCustomerId(null);
    }
  };

  // Filter customers by name, phone, or license number
  const filteredCustomers = customers?.filter((customer) => {
    const query = search.trim().toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query) ||
      customer.licenseNo?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white text-xs px-4 py-1 rounded"
            onClick={() => setOpen(true)}
            disabled={assigned} // Disable after assignment
          >
            Assign Customer
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
                disabled={assigned}
              />
              <div className="max-h-64 overflow-y-auto">
                {filteredCustomers && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer._id}
                      className={`flex justify-between items-center py-2 px-3 border-b transition cursor-pointer ${
                        assigned ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-purple-50"
                      }`}
                      onClick={() => {
                        if (!assigned) {
                          setConfirmCustomerId(customer._id);
                          setShowConfirm(true);
                        }
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
                <div className="text-red-500 text-xs text-center">{assignError}</div>
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

      {/* Confirmation for assign the details */}
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
            <AlertDialogAction className= "bg-red-600 hover:bg-red-700 text-white cursor-pointer" onClick={handleConfirmAssign}>
              Yes, Assign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AssignCustomerDialog;
