import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import Login from "./Pages/auth/Login";
import Home from "./Pages/Home/Home";
import Rental from "./Pages/Rental/Rental";
import Fleet from "./Pages/Fleet/Fleet";
import Customer from "./Pages/Customer/Customer";
import Inventory from "./Pages/Inventory/Inventory";
import Service from "./Pages/Services/Service";
import Register from "./Pages/auth/Register";
import { Toaster } from "sonner";
import ProtectedRoute from "./Routes/ProtectedRoute";
import ForgetPassword from "./Pages/auth/ForgetPassword";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="rental" element={<Rental />} />
            <Route path="fleet" element={<Fleet />} />
            <Route path="customer" element={<Customer />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="service" element={<Service />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
