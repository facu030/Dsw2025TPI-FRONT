import { instance } from '../../shared/api/axiosInstance';

export const register = async (username, email, password) => {
  try {
    const response = await instance.post('/api/auth/register', {
      username,
      email,
      password,
    });

    // El back devuelve
    const { token, user, role } = response.data;

    return {
      data: { token, user, role },
      error: null,
    };
  } catch (error) {
    console.log('REGISTER ERROR RAW:', error);
    console.log('REGISTER ERROR DATA:', error.response?.data);

    return {
      data: null,
      error,
    };
  }
};