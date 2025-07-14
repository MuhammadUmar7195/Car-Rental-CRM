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
import { useState, useRef } from "react";
import axios from "axios";
import Papa from "papaparse";
import { toast } from "sonner";
import AccountingCart from "./AccountingCart";
import { FiRefreshCw } from "react-icons/fi";

const Accounting = () => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          // parse data on csv file is really confusing description amount ma ja rha ha or amount descripton.
          const parsed = results.data.map((row) => ({
            date: row.date || row.Date || "",
            description: row.amount || row.Amount || "",
            amount: row.description || row.Description || "",
          }));

          // we upload data form csv file by parsing it and sending to backend
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/accounting/upload`,
              { transactions: parsed },
              { withCredentials: true }
            );
            if (response.data.success) {
              toast.success(
                response?.data?.message || "Data uploaded successfully!"
              );
            }
          } catch (err) {
            toast.error(
              err?.response?.data?.message || "Failed to upload data"
            );
          }
        },
      });
    }
  };

  // Add a refresh handler
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center uppercase">
        Customer Details
      </h1>
      <div className="flex justify-between">
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
        <Button
          variant="outline"
          className="lg:mr-10 sm:ml-3 cursor-pointer"
          onClick={handleRefresh}
        >
          <FiRefreshCw className="text-purple-600" size={18} />
        </Button>
      </div>
      <Separator />
      <div>
        <AccountingCart />
      </div>
    </div>
  );
};

export default Accounting;
