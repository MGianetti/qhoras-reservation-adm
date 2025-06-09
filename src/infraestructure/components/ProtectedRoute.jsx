import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = localStorage.getItem("token_qhoras_reservation");
  const { isLoading, user } = useSelector((state) => state.auth);

  // Se não tiver token, redireciona pro login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>
      Carregando…
    </div>;
  }

  if (
    allowedRoles.length > 0 &&
    (!user?.role || !allowedRoles.includes(user.role))
  ) {
    // redireciona para home (ou página de “sem acesso”)
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
