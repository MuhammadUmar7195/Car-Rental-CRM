import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { logout } from "@/store/Slices/auth.slice";

const useAutoLogoutGlobal = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const dispatch = useDispatch();

  // Function to check if user session is valid
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/check-session`,
        { withCredentials: true }
      );
      return response.data.isAuthenticated;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return false;
    }
  };

  // Auto logout when cookies expire
  useEffect(() => {
    if (user?.role) {
      const interval = setInterval(async () => {
        const isAuthenticated = await checkAuthStatus();
        if (!isAuthenticated) {
          dispatch(logout());
          toast.error("Session expired. Please login again.");
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  // Axios interceptor to handle 401 responses globally
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && user?.role) {
          dispatch(logout());
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user, dispatch]);
};

export default useAutoLogoutGlobal;
