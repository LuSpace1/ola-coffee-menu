import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});


export const getMenu = async (category, search) => {
  const params = {};
  

  if (category && category !== 'Todos') {
    params.category = category;
  }
  

  if (search) {
    params.search = search;
  }
  
  const response = await api.get('/products', { params });
  return response.data;
};


export const toggleStock = async (id) => {
  const response = await api.patch(`/products/${id}/toggle`);
  return response.data;
};


export const saveItem = async (item) => {
  if (item.id) {
    const { id, ...data } = item;
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  } else {

    const response = await api.post('/products', item);
    return response.data;
  }
};


export const deleteItem = async (id) => {
  await api.delete(`/products/${id}`);
};


export const login = async (password) => {
  const response = await api.post('/login', { password });
  return response.data;
};