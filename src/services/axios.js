import axios from "axios";

const BASE_URL = import.meta.env.VITE_URLAPI;
// const BASE_URL = "http://10.89.240.85:5000/api/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { accept: "application/json" },
});

const sheets = {
  // Novos endpoints alinhados à API fornecida
  getItems: (config) => api.get(`items`, config),
  getItemById: (idItem) => api.get(`items/${idItem}`),
  filterItems: (data) => api.post(`items/filter`, data),
  createItem: (itemData) => api.post(`items`, itemData),
  updateItemQuantity: (idItem, payload) => api.put(`items/${idItem}/quantity`, payload),
  deleteItem: (idItem) => api.delete(`items/${idItem}`),

  getTransactions: () => api.get(`transactions`),
  getTransactionsByItem: (idItem) => api.get(`transactions/item/${idItem}`),

  // Lista de marcas (endpoint adicionado na API)
  getBrands: () => api.get(`items/brands`),

  // Outros recursos auxiliares (categorias, técnico, imagem) - mantidos
  getLocations: () => api.get("location"),
  postImage: (itemId, formData) => api.post(`item/image/${itemId}`, formData),
  createCategory: (data) => api.post("category", data),
  createLocation: (data) => api.post("location", data),
  getCategories: () => api.get("category"),
  getTechnicalSpecs: () => api.get(`technicalSpec/`),
  createTechnicalSpec: (technicalSpecKey) => api.post(`technicalSpec/`, technicalSpecKey),

  // Backward-compatible aliases (mantêm compatibilidade com código existente)
  getItens: (config) => api.get(`items`, config),
  getItensID: (id_item) => api.get(`items/${id_item}`),
  filterItens: (data) => api.post(`items/filter`, data),
  postAddItem: (itemData) => api.post(`items`, itemData),
  CreateLot: (lot, idLot) => api.put(`items/${idLot}/quantity`, lot),
};

export default sheets;
