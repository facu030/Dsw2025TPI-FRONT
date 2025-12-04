import { instance } from '../../shared/api/axiosInstance';

export const getProductsClient = async ({
  page = 1,
  pageSize = 12,
  search = '',
  status = 'enabled',  
} = {}) => {
  const response = await instance.get('api/products', {
    params: {
      status,                 
      search: search || null,
      pageNumber: page,
      pageSize,
    },
  });

  const { productItems, total } = response.data;

  return {
    items: productItems ?? [],
    total: total ?? 0,
  };
};


export const getProductByIdClient = async (id) => {
  const { data } = await instance.get(`api/products/${id}`);
  return data;
};