import { instance } from '../../shared/api/axiosInstance';

function useAuth() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAuthenticated = !!token;

  // login
  const signin = async (username, password) => {
    try {
      const { data } = await instance.post('/api/auth/login', {
        username,
        password,
      });

      // desestructuramos solo token y use
      const { token, user } = data; 
      
      // sacamos el role de adentro del objeto user
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

  // signup
  const signup = async (username, email, password) => {
    try {
      const { data } = await instance.post('/api/auth/register', {
        username,
        email,
        password,
      });

   
      const { token, user } = data;
      
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
  
 // signout
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