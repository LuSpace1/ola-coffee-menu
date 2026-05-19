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


export const renameCategory = async (oldName, newName) => {
  const response = await api.put('/categories/rename', null, {
    params: { old_name: oldName, new_name: newName }
  });
  return response.data;
};


export const login = async (password) => {
  const response = await api.post('/login', { password });
  return response.data;
};

// --- SISTEMA DE SEGURIDAD Y RECUPERACIÓN ---

export const requestRecovery = async () => {
  try {
    const response = await api.post('/request-recovery');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "No se pudo solicitar la recuperación");
  }
};

export const verifyPinAndChangePassword = async (pin, new_password) => {
  try {
    const response = await api.post('/verify-pin', { pin, new_password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Error al verificar PIN y cambiar contraseña");
  }
};

export const updateRecoveryEmail = async (new_email) => {
  try {
    const response = await api.put('/config/email', { new_email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Error al actualizar correo");
  }
};

export const checkHasEmail = async () => {
  try {
    const response = await api.get('/config/has-email');
    return response.data;
  } catch (error) {
    return { hasEmail: false, email: null };
  }
};