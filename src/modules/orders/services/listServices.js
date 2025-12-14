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


  const queryString = new URLSearchParams(params).toString();

  const response = await instance.get(`/api/orders/admin?${queryString}`);

  return { data: response.data, error: null };
};


export const getOrderById = async (id) => {
  const response = await instance.get(`/api/orders/${id}`);
  return { data: response.data, error: null };
};

