import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/Layouts/DashboardLayout";
import Login from "./components/auth/Login";
import Home from "./Pages/Home/Home";
import Fleet from "./Pages/Fleet/Fleet";
import Customer from "./Pages/Customer/Customer";
import Inventory from "./Pages/Inventory/Inventory";
import { Toaster } from "sonner";
import Register from "./components/auth/Register";
import ProtectedRoute from "./Routes/ProtectedRoute";
import ForgetPassword from "./components/auth/ForgetPassword";
import Accounting from "./Pages/Accounting/Accounting";
import FleetOwner from "./Pages/FleetOwner/FleetOwner";
import Payment from "./Pages/Payment/payment";
import Navbar from "./components/Common/Navbar";
import SingleFleetDetail from "./Pages/Fleet/SingleFleetDetail";
import EditFleetPage from "./Pages/Fleet/EditFleetPage";
import EditCustomerPage from "./Pages/Customer/EditCustomerPage";
import SingleCustomerDetail from "./Pages/Customer/SingleCustomerDetail";
import RentalFlow from "./Pages/Rental/RentalFlow";
import RentalHistory from "./Pages/Rental/RentalHistory";
import SingleInventoryDetail from "./Pages/Inventory/SingleInventoryDetail";
import EditInventory from "./Pages/Inventory/EditInventory";
import POS from "./Pages/POS/POS";
import POSHistory from "./Pages/POS/POSHistory";
import Footer from "./components/Common/Footer";

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
                <Footer/>
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <Register />
                <Footer/>
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <Navbar />
                <ForgetPassword />
                <Footer/>
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
            //All rental routes
            <Route path="rental" element={<RentalFlow />} />
            <Route path="rental-history" element={<RentalHistory />} />
            
            //All Fleet Routes
            <Route path="fleet" element={<Fleet />} />
            <Route path="fleet/:id" element={<SingleFleetDetail />} />
            <Route path="fleet/edit/:id" element={<EditFleetPage />} />

            //All Customer Routes
            <Route path="customer" element={<Customer />} />
            <Route path="customer/:id" element={<SingleCustomerDetail />} />
            <Route path="customer/edit/:id" element={<EditCustomerPage />} />

            //All Inventory Routes
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/:id" element={<SingleInventoryDetail />} />
            <Route path="inventory/edit/:id" element={<EditInventory />} />

            //POS routes
            <Route path="pos" element={<POS />} />
            <Route path="pos/history" element={<POSHistory />} />

            //Bank CSV upload logic 
            <Route path="accounting" element={<Accounting />} />

            //Payment dues 
            <Route path="payments/:id" element={<Payment />} />

            //Fleet Owner
            <Route path="fleet-owner" element={<FleetOwner />} />
          </Route>
          {/* Global catch-all route to redirect to login */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Login />
                <Footer/>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
