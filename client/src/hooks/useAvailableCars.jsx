import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useAvailableCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null); 

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fleet/get-car-status?status=Available`,
        { withCredentials: true }
      );
      setCars(response.data.fleets || []);
    } catch (err) {
      setCars([]);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch cars.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return {
    cars,
    loading,
    error,
    refetch: fetchCars,
  };
};

export default useAvailableCars;
