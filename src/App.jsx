import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/loginPage/loginPage';

import Rooms from './pages/rooms/rooms';
import Updates from './pages/updates/updates';
import Calendar from './pages/calendar/calendar';
import ResetPassword from './pages/resetPassword/resetPassword';
import ForgotPassword from './pages/forgotPassword/forgotPassword';
import Configurations from './pages/configurations/configurations';
import ProtectedRoute from './infraestructure/components/ProtectedRoute';
import ListCustomerPage from './pages/listCustomerPage/listCustomerPage';
import CalendarReadOnly from './pages/calendarReadOnly/calendarReadOnly';

function App() {
    const role = useSelector((state) => state?.auth?.user?.role);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/esqueci-senha" element={<ForgotPassword />} />
                <Route path="/redefinir-senha" element={<ResetPassword />} />
                <Route path="/calendario" element={<CalendarReadOnly />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Calendar />} />
                    <Route path="/membros" element={<ListCustomerPage />} />
                    <Route path="/salas" element={<Rooms />} />
                    <Route path="/updates" element={<Updates />} />
                    {role === 'ADMINISTRATOR' && <Route path="/configuracoes" element={<Configurations />} />}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
