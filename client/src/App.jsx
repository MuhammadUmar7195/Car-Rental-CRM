import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import Login from "./components/auth/Login";
import Home from "./Pages/Home/Home";
import Rental from "./Pages/Rental/Rental";
import Fleet from "./Pages/Fleet/Fleet";
import Customer from "./Pages/Customer/Customer";
import Inventory from "./Pages/Inventory/Inventory";
import Service from "./Pages/Services/Service";
import Register from "./components/auth/Register";

import { Toaster } from "sonner";
import ProtectedRoute from "./Routes/ProtectedRoute";
import ForgetPassword from "./components/auth/ForgetPassword";
import Accounting from "./Pages/Accounting/Accounting";
import FleetOwner from "./Pages/FleetOwner/FleetOwner";
import Payment from "./Pages/Payment/payment";
import Setting from "./Pages/Setting/Setting";
import Navbar from "./components/Common/Navbar";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <Navbar />
                <ForgetPassword />
              </>
            }
          />
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
            <Route path="accounting" element={<Accounting />} />
            <Route path="fleet-owner" element={<FleetOwner />} />
            <Route path="payment-dues" element={<Payment />} />
            <Route path="service" element={<Service />} />
            <Route path="setting" element={<Setting />} />
          </Route>
          {/* Global catch-all route to redirect to login */}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
