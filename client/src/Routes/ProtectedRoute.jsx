import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state?.auth);
  
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check (if role is required)
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
