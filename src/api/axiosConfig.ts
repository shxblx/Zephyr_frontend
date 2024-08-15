import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Api = axios.create({ baseURL: BASE_URL, withCredentials: true });

const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();

  window.location.href = "/login";
};

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default Api;
