import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PuffLoader } from 'react-spinners';
// import { getPaymentsByCustomerId } from '@/store/Slices/payment.slice';

const PaymentHistory = ({ customerId }) => {
  const dispatch = useDispatch();
  // const { payments, loading, error } = useSelector((state) => state.payment);
  const { payments, loading, error } = { payments: [], loading: false, error: null }; // Placeholder state

  useEffect(() => {
    if (customerId) {
      console.log("Fetching payments for customerId:", customerId);
    //   dispatch(getPaymentsByCustomerId(customerId));    
    }
  }, [dispatch, customerId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[20vh] w-full">
        <PuffLoader color="#9333ea" size={60} speedMultiplier={1.2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Card className="w-full shadow-xl rounded-3xl bg-white p-4 md:p-6 mt-8">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-2xl font-bold text-purple-800 mb-2 uppercase">
          Customer Payment History
        </CardTitle>
        <CardDescription>
          <span className="text-gray-500 text-sm">
            All payment records for this customer
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(!payments || payments.length === 0) ? (
          <div className="text-center py-6 text-lg text-gray-500">
            No payment history found for this customer.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Payment ID</TableHead>
                  <TableHead className="text-center">Rental ID</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Method</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id} className="hover:bg-purple-50 transition">
                    <TableCell className="font-mono text-xs">{payment._id}</TableCell>
                    <TableCell className="font-mono text-xs">{payment.rentalId || "N/A"}</TableCell>
                    <TableCell>$ {payment.amount || "N/A"}</TableCell>
                    <TableCell>{payment.method || "N/A"}</TableCell>
                    <TableCell>
                      {payment.date
                        ? new Date(payment.date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                          payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.note || "—"}</TableCell>
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