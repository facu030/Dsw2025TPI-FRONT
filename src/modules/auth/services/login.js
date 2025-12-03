import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    // mejor con / delante, pero 'api/...' también funciona
    const response = await instance.post('/api/auth/login', {
      username,      // mismo nombre que en Swagger
      password,
    });

    // tu backend devuelve { token, user }
    return {
      data: response.data.token,   // devolvemos SOLO el token
      error: null,
    };
  } catch (error) {
    // formato típico de error en tu back: { error: "...", status: 400, type: "..." }
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
