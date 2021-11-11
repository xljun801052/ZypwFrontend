import axios from "./httpConfig";

axios.interceptors.request.use(
  config => {
    config.url = "/homepage";
    config.headers.access_token = window.localStorage.getItem("access_token");
    return config;
  },
  error => {
    return Promise.reject(error.response);
  }
);
export default axios;
