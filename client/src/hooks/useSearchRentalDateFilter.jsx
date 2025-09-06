import { useState } from "react";
import axios from "axios";

const useSearchRentalDateFilter = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setRentals([]);
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/search-by-date`,
        {
          params: { startDate, endDate },
          withCredentials: true,
        }
      );
      setRentals(res.data.rentals || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch rentals.");
    } finally {
      setLoading(false);
    }
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    rentals,
    loading,
    error,
    handleSearch,
  };
};

export default useSearchRentalDateFilter;