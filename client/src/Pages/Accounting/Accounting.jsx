import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";

const Accounting = () => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log("File selected:", file);
    }
  };
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center uppercase">
        Customer Details
      </h1>

      <div className="flex justify-start">
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white uppercase cursor-pointer"
          onClick={handleUploadClick}
        >
          + Upload Bank Statement
        </Button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-medium mb-4">Transaction History</h2>

        {/* Table 1 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>20-03-25</TableCell>
                  <TableCell>
                    Description
                    <br />
                    CAR RENT PAYMENT
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    +500
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex gap-4 mt-4">
              <Button className="bg-purple-600 text-white text-xs px-4 py-1">
                Rental Expense
              </Button>
              <Button className="bg-purple-600 text-white text-xs px-4 py-1">
                Workshop Expense
              </Button>
              <Button className="bg-purple-600 text-white text-xs px-4 py-1">
                Assign Customer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table 2 - highlighted entry */}
        <Card className="bg-lime-100">
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>20-03-25</TableCell>
                  <TableCell>
                    Description
                    <br />
                    CAR RENT PAYMENT
                  </TableCell>
                  <TableCell className="text-right text-green-600 font-medium">
                    +500
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accounting;
