import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  //si no esta log al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // si esta pero no es admin al home
  if (role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  // 3) Está log y es admin va al dashboard y sus hijos
  return children;
}

export default ProtectedRoute;