// src/orders/services/listServices.js
import { instance } from '../../shared/api/axiosInstance';

/**
 * Obtiene listado paginado de órdenes para el dashboard admin.
 * Llama a GET /api/orders/admin
 */
export const listOrders = async (
  search = '',
  status = 'all',   // lo dejamos en la firma por si en el futuro lo usamos
  pageNumber = 1,
  pageSize = 10
) => {
  const params = {
    pageNumber,
    pageSize,
  };

  // solo mandamos search si tiene algo
  if (search && search.trim() !== '') {
    params.search = search.trim();
  }

  // 👇 status ya no se usa en el back:
  // if (status && status !== 'all') {
  //   params.status = status;
  // }

  const queryString = new URLSearchParams(params).toString();

  const response = await instance.get(`/api/orders/admin?${queryString}`);

  return { data: response.data, error: null };
};

/**
 * Obtiene el detalle completo de una orden por Id.
 * Llama a GET /api/orders/{id}
 */
export const getOrderById = async (id) => {
  const response = await instance.get(`/api/orders/${id}`);
  return { data: response.data, error: null };
};
