import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await instance.post('/api/auth/login', { username, password });

    // El back devuelve
    const { token, user, role } = response.data;

    return {
      data: { token, user, role },
      error: null,
    };
  } catch (error) {
    console.log('LOGIN ERROR RAW:', error);
    console.log('LOGIN ERROR DATA:', error.response?.data);

    const backendMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Usuario y/o contraseña no son correctos';

    return {
      data: null,
      error: {
        frontendErrorMessage: backendMessage,
      },
    };
  }
};
