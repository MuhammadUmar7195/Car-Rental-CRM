import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAccountingData } from "@/store/Slices/accouting.slice";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PuffLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

const AccountingCart = () => {
  const dispatch = useDispatch();
  const { accountingData, loading, error } =
    useSelector((state) => state?.accounting) || {};
  console.log(accountingData);

  useEffect(() => {
    dispatch(getAllAccountingData());
  }, [dispatch]);

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <PuffLoader color="#7e22ce" size={48} />
        </div>
      ) : error ? (
        <Card>
          <CardContent>
            <p className="text-center text-red-500 py-6 font-semibold">
              {error}
            </p>
          </CardContent>
        </Card>
      ) : accountingData && accountingData.length > 0 ? (
        accountingData.map((row, idx) => (
          <Card key={idx} className="mb-4">
            <CardContent className="p-4 space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {row.amount}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex gap-4">
                <Button className="bg-purple-600 text-white text-xs px-4 py-1 rounded">
                  Rental Expense
                </Button>
                <Button className="bg-purple-600 text-white text-xs px-4 py-1 rounded">
                  Workshop Expense
                </Button>
                <Button className="bg-purple-600 text-white text-xs px-4 py-1 rounded">
                  Assign Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent>
            <p className="text-center text-gray-500 py-6">
              No accounting records found.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountingCart;
