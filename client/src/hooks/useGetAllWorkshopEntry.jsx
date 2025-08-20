import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useGetAllWorkshopEntry = () => {
  const [workshop, setWorkshop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkshop = useCallback(async () => {
    setLoading(true);
    setError(null); 

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/workshop/get`,
        { withCredentials: true }
      );
      setWorkshop(response.data.appointments || []);
    } catch (err) {
      setWorkshop([]);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch workshop.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkshop();
  }, [fetchWorkshop]);

  return {
    workshop,
    loading,
    error,
    refetch: fetchWorkshop,
  };
};

export default useGetAllWorkshopEntry;
