import { instance } from '../../shared/api/axiosInstance';

function useAuth() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAuthenticated = !!token;

  // --- LOGIN ---
  const signin = async (username, password) => {
    try {
      const { data } = await instance.post('/api/auth/login', {
        username,
        password,
      });

      // 1 Desestructuramos solo token y user (porque role viene dentro de user)
      const { token, user } = data; 
      
      // 2 Sacamos el role de adentro del objeto user
      const role = user.role; 

      localStorage.setItem('token', token);
      localStorage.setItem('username', user.userName);
      localStorage.setItem('role', role);

      return {
        error: null,
        role,
      };
    } catch (err) {
      return {
        error: {
          frontendErrorMessage:
            err?.response?.data?.message ||
            'Usuario o contraseña incorrectos',
        },
        role: null,
      };
    }
  };

  // --- SIGNUP ---
  const signup = async (username, email, password) => {
    try {
      const { data } = await instance.post('/api/auth/register', {
        username,
        email,
        password,
      });

      // 1 Igual que en login, el rol viene adentro de user
      const { token, user } = data;
      
      // 2 sacamos el rol correctamente
      const role = user.role;

      localStorage.setItem('token', token);
      localStorage.setItem('username', user.userName);
      localStorage.setItem('role', role);

      return {
        error: null,
        role,
      };
    } catch (err) {
      return {
        error: {
          frontendErrorMessage:
            err?.response?.data?.message ||
            'No se pudo registrar el usuario',
        },
        role: null,
      };
    }
  };
  
 // --- SIGNOUT ---
  const signout = (redirectTo = '/') => {
    localStorage.clear();
    window.location.href = redirectTo;
  };

  return {
    signin,
    signup,
    signout,
    isAuthenticated,
    role,
  };
}

export default useAuth;