import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { i18n } from '@lingui/core';

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

export const ROUTE_MAP = {
    pt: {
        home: '/',
        members: '/membros',
        rooms: '/salas',
        settings: '/configuracoes',
        forgotPass: '/esqueci-senha',
        resetPass: '/redefinir-senha',
        calendarPub: '/calendario'
    },
    en: {
        home: '/',
        members: '/clients',
        rooms: '/rooms',
        settings: '/settings',
        forgotPass: '/forgot-password',
        resetPass: '/reset-password',
        calendarPub: '/calendar'
    }
};

function App() {
    const role = useSelector((state) => state?.auth?.user?.role);
    const langRoutes = ROUTE_MAP[i18n.locale] ?? ROUTE_MAP.en;

    return (
        <Router>
            <Routes>
                <Route path={langRoutes.forgotPass} element={<ForgotPassword />} />
                <Route path={langRoutes.resetPass} element={<ResetPassword />} />
                <Route path={langRoutes.calendarPub} element={<CalendarReadOnly />} />

                <Route element={<ProtectedRoute />}>
                    <Route path={langRoutes.home} element={<Calendar />} />
                    <Route path={langRoutes.members} element={<ListCustomerPage />} />
                    <Route path={langRoutes.rooms} element={<Rooms />} />
                    {role === 'ADMINISTRATOR' && <Route path={langRoutes.settings} element={<Configurations />} />}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
