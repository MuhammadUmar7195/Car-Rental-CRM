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
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteAccountingEntry } from "@/store/Slices/accouting.slice";
import { toast } from "sonner";
import { FiRefreshCw } from "react-icons/fi";
import AssignCustomerDialog from "./AssignCustomerDialog";

const AccountingCart = ({ accountingData, loading, error }) => {
  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteAccountingEntry(id));
    toast.success("Accounting entry deleted successfully!");
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <p className="text-xs sm:text-sm text-black bg-yellow-50 border border-purple-200 rounded px-3 py-2">
          <span className="font-extrabold">Note:</span> Please use{" "}
          <span className="font-semibold animate-pulse uppercase">
            date, amount, description
          </span>{" "}
          columns in order when uploading your CSV file.😊
        </p>
      </div>
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
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{row?.date}</TableCell>
                    <TableCell>{row?.description}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {row?.amount}
                    </TableCell>
                    <TableCell>
                      <MdDeleteOutline
                        onClick={() => handleDelete(row._id)}
                        className="fill-red-500 hover:animate-pulse cursor-pointer"
                        size={19}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white text-xs px-4 py-1 rounded">
                  Rental Expense
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white text-xs px-4 py-1 rounded">
                  Workshop Expense
                </Button>
               <AssignCustomerDialog accountingId={row._id} />
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center gap-2 text-gray-500 py-6">
              No Records Found. Refresh it{" "}
              <FiRefreshCw className="animate-spin" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountingCart;
