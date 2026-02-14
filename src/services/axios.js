import axios from "axios";

const BASE_URL = import.meta.env.VITE_URLAPI;
// const BASE_URL = "http://10.89.240.85:5000/api/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { accept: "application/json" },
});

const sheets = {
  
  getItens: (config) => api.get(`items/`, config),
  getItensID: (id_item) => api.get(`item/${id_item}/details`, id_item),
  getLocations: () => api.get("location"),
  getTransactions: () => api.get(`transactions/`),
  CreateLot: (lot, idLot) => api.put(`lot/quantity/${idLot}`, lot),
  filterItens: (data) => api.post(`items/filter`, data),
  postImage: (itemId, formData) => {

    return api.post(`item/image/${itemId}`, formData);
  },
  createCategory: (data) => api.post("category", data),
  createLocation: (data) => api.post("location", data),
  getCategories: () => api.get("category"),
  getTechnicalSpecs: () => api.get(`technicalSpec/`),
  createTechnicalSpec: (technicalSpecKey) =>
    api.post(`technicalSpec/`, technicalSpecKey),
  postAddItem: (itemData) => api.post(`/item`, itemData),
  deleteItem: (idItem) => api.delete(`item/${idItem}`),
};

export default sheets;
