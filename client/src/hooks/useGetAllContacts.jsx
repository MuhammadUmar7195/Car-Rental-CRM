import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useGetAllContacts = () => {
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContact = useCallback(async () => {
    setLoading(true);
    setError(null); 

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/contact/get`,
        { withCredentials: true }
      );
      setContact(response.data.contacts || []);
    } catch (err) {
      setContact([]);

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
    fetchContact();
  }, [fetchContact]);

  return {
    contact,
    loading,
    error,
    refetch: fetchContact,
  };
};

export default useGetAllContacts;
