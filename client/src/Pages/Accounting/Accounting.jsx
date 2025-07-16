import { getAllAccountingData } from "@/store/Slices/accouting.slice";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import AccountingCart from "./AccountingCart";
import { FiRefreshCw } from "react-icons/fi";
import { CiViewList } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Papa from "papaparse";
import axios from "axios";

const Accounting = () => {
  const fileInputRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const { accountingData, loading, error } =
    useSelector((state) => state?.accounting) || {};

  useEffect(() => {
    dispatch(getAllAccountingData());
  }, [dispatch]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear previous file
      fileInputRef.current.click();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllAccountingData());
    setRefreshing(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parsed = results.data.map((row) => ({
            date: row.date || row.Date || "",
            amount: row.amount || row.Amount || "",
            description: row.description || row.Description || "",
          }));

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
              await dispatch(getAllAccountingData());
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center uppercase flex items-center justify-center gap-2">
        Customer Details
        <CiViewList className="text-purple-600" size={32} />
      </h1>
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white uppercase cursor-pointer w-full sm:w-auto"
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
          className="w-full sm:w-auto lg:mr-10 sm:ml-3 cursor-pointer flex items-center gap-2"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FiRefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <Separator />
      <div>
        <AccountingCart
          accountingData={accountingData}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Accounting;
