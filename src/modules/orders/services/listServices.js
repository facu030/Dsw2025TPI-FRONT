// src/orders/services/listServices.js
import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async (
  search = '',
  status = 'all',   // lo dejamos en la firma, pero NO lo usamos
  pageNumber = 1,
  pageSize = 10
) => {
  // armamos un objeto solo con los params válidos
  const params = {
    pageNumber,
    pageSize,
  };

  // solo mandamos search si tiene algo
  if (search && search.trim() !== '') {
    params.search = search.trim();
  }

  // 👇 YA NO MANDAMOS STATUS AL BACKEND
  // if (status && status !== 'all') {
  //   params.status = status;
  // }

  const queryString = new URLSearchParams(params).toString();

  const response = await instance.get(`/api/orders/admin?${queryString}`);

  return { data: response.data, error: null };
};
