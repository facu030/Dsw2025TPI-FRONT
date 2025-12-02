// src/modules/orders/services/listServices.js
import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async ({
  status = 'all',
  search = '',
  pageNumber = 1,
  pageSize = 10,
} = {}) => {
  try {
    // Ahora usamos el endpoint liviano para el dashboard
    const response = await instance.get('/api/orders/admin', {
      params: {
        status,
        search,
        pageNumber,
        pageSize,
      },
    });

    // El back devuelve: { orderItems: [...], total: X }
    return { data: response.data, error: null };
  } catch (error) {
    // Si el back devuelve 204 No Content -> lo tratamos como lista vacía
    if (error.response?.status === 204) {
      return {
        data: { orderItems: [], total: 0 },
        error: null,
      };
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
