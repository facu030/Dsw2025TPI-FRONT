import { instance } from '../../shared/api/axiosInstance';

function useAuth() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isAuthenticated = !!token;

  const signin = async (username, password) => {
    try {
      const { data } = await instance.post('/api/auth/login', {
        username,
        password,
      });

      const { token, user } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', user.userName);
      localStorage.setItem('role', user.role);

      return {
        error: null,
        role: user.role,
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

  const signout = (redirectTo = '/') => {
    localStorage.clear();
    window.location.href = redirectTo;
  };

  return {
    signin,
    signout,
    isAuthenticated,
    role,
  };
}

export default useAuth;