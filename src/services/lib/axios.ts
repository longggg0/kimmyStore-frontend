// import { getAcessToken } from "@/utils/tokenStorage";
// import axios from "axios";

// const apiUrl = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: apiUrl,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = getAcessToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// api.interceptors.response.use((response) => {
//   return response.data;
// });

// export default api;