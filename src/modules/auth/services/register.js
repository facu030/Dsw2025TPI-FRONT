import { instance } from '../../shared/api/axiosInstance';

export const register = async (username, email, password) => {
  try {
    const response = await instance.post('api/auth/register', {
      username,
      email,
      password,
    });

    // el back devuelve { token, user, role }
    return { data: response.data.token, error: null };
  } catch (error) {
    console.log('REGISTER ERROR RAW:', error);
    console.log('REGISTER ERROR DATA:', error.response?.data); 
    return { data: null, error };
  }
};