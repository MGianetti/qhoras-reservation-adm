import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/loginPage/loginPage";

import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import ListCustomerPage from "./pages/listCustomerPage/listCustomerPage";
import Calendar from "./pages/calendar/calendar";
import Rooms from "./pages/rooms/rooms";
import Configurations from "./pages/configurations/configurations";
import ResetPassword from "./pages/resetPassword/resetPassword";
import ProtectedRoute from "./infraestructure/components/ProtectedRoute";
import Updates from "./pages/updates/updates";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="/" element={<Calendar />} />
        <Route path="/membros" element={<ListCustomerPage />} />
        <Route path="/salas" element={<Rooms />} />
        <Route path="/updates" element={<Updates />} />
        {/* <Route path="/financeiro" element={<Financeiro />} /> */}
        <Route path="/configuracoes" element={<Configurations />} />
        <Route element={<ProtectedRoute />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
