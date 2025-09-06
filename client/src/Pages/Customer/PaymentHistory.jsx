import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { getAccountingAndRentalsByCustomerId } from "@/store/Slices/accouting.slice";

const PaymentHistory = ({ customerId }) => {
  const dispatch = useDispatch();
  const { assignCustomerPayment, loading, error } = useSelector(
    (state) => state.accounting
  );  

  useEffect(() => {
    if (customerId) {
      dispatch(getAccountingAndRentalsByCustomerId(customerId));
    }
  }, [dispatch, customerId]);

  // Use accounting entries as "payments"
  const payments = assignCustomerPayment?.accounting || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
        <PuffLoader color="#9333ea" size={60} speedMultiplier={1.2} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-lg text-red-500">{error}</div>;
  }

  return (
    <Card className="w-full shadow-xl rounded-3xl bg-white p-4 md:p-6 mt-8">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-2xl font-bold text-purple-800 mb-2 uppercase">
          Customer Payment History
        </CardTitle>
        <CardDescription>
          <span className="text-gray-500 text-sm">
            All payment/accounting records for this customer
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!payments || payments.length === 0 ? (
          <div className="text-center py-6 text-lg text-gray-500">
            No payment history found for this customer.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Assigned Amount</TableHead>
                  <TableHead className="text-center">Rental Amount</TableHead>
                  <TableHead className="text-center">Grand Total</TableHead>
                  <TableHead className="text-center">Rental Purpose</TableHead>
                  <TableHead className="text-center">Rental Status</TableHead>
                  <TableHead className="text-center">
                    Paid Bank Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((entry) => (
                  <TableRow
                    key={entry._id}
                    className="hover:bg-purple-50 transition text-center"
                  >
                    <TableCell>
                      {entry.date
                        ? entry.date
                        : entry.assignedAt
                        ? new Date(entry.assignedAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {entry.amount !== undefined
                        ? `$ ${Math.abs(entry.amount)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {entry.rentalOrderSnapshot?.amountPaid !== undefined
                        ? `$ ${Math.abs(entry.rentalOrderSnapshot.amountPaid)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {entry.rentalOrderSnapshot?.amountPaid !== undefined &&
                      entry.amount !== undefined
                        ? `$ ${Math.abs(
                            entry.rentalOrderSnapshot.amountPaid + entry.amount
                          )}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {entry.rentalOrderSnapshot?.purpose || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                          entry.rentalOrderSnapshot?.status === "reserved"
                            ? "bg-yellow-100 text-yellow-800"
                            : entry.rentalOrderSnapshot?.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {entry.rentalOrderSnapshot?.status || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.description || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
