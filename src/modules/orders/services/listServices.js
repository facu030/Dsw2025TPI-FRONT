import { instance } from '../../shared/api/axiosInstance';

export const listOrders = async (
  search = '',
  status = 'all',
  pageNumber = 1,
  pageSize = 10
) => {
  const params = {
    pageNumber,
    pageSize,
  };

  if (search && search.trim() !== '') {
    params.search = search.trim();
  }

  // Si decides volver a usar el filtro de estado, descomenta esto:
  if (status && status !== 'all') {
     params.status = status;
  }

  const queryString = new URLSearchParams(params).toString();

  // 👇 CORRECCIÓN AQUÍ: Quitamos "/admin"
  // Antes: /api/orders/admin? ...
  // Ahora: /api/orders? ...
  const response = await instance.get(`/api/orders?${queryString}`);

  return { data: response.data, error: null };
};