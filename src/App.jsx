import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { SidebarProvider } from "./context/SidebarContext";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoutes from "../src/utils/PrivateRoutes";
import RoleBaseRoutes from "../src/utils/RoleBaseRoutes"
import Customer from "./pages/customer/Customer";
import LoanSummary from "./pages/customer/LoanSummary";
import Finance from "./pages/Finance/Finance";
import ChatBot from "./components/chabot/Chatbot";

function App() {

  return (
    <BrowserRouter>
   
    <SidebarProvider>
    <Routes>
      <Route path="/" element={<Navigate to="/admin-dashboard" />} />
      <Route path="/login" element={<Login />} />  
      <Route path="/admin-dashboard" element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          } />
          <Route path="/customer" element={<Customer/>} />
          <Route path="/loan-summary/:id" element={<LoanSummary/>} />
          <Route path="/finance" element={<Finance/>} />
    </Routes>
    </SidebarProvider>
  
    </BrowserRouter>
  )
}

export default App
