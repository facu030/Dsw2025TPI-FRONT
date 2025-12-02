// src/modules/orders/services/listServices.js
import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async () => {
  try {
    // El endpoint según Swagger es /api/orders (sin /admin)
    const response = await instance.get('/api/orders');

    // Supongo que devuelve una lista de órdenes directamente (array).
    // Si después ves que devuelve { orders: [], total: X }, lo ajustamos.
    return { data: response.data, error: null };
  } catch (error) {
    // Si el back devuelve 204 No Content -> lo tratamos como lista vacía
    if (error.response?.status === 204) {
      return { data: [], error: null };
    }

    return {
      data: null,
      error: {
        frontendErrorMessage:
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Error al obtener las órdenes',
      },
    };
  }
};
