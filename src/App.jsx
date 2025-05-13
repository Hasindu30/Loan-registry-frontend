import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { SidebarProvider } from "./context/SidebarContext";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoutes from "../src/utils/PrivateRoutes";
import RoleBaseRoutes from "../src/utils/RoleBaseRoutes"

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
    </Routes>
    </SidebarProvider>
   
    </BrowserRouter>
  )
}

export default App
