import axios from "axios";
const api = axios.create({
  baseURL: process.env.STRAPI_LOCAL_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Content-Type": `multipart/form-data`,
  },
});
export default api;
