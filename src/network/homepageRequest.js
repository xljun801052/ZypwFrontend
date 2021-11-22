import globalNetworkConfig from "./httpConfig";
import axios from "axios";

const moduleRequestPrefix = "/homepage";
let token = window.localStorage.getItem("access_token");

const homepageAxiosInstance = axios.create({
  baseURL: globalNetworkConfig.baseURL + moduleRequestPrefix,
  timeout: globalNetworkConfig.timeout,
  headers: {
    "Current-Module": "Homepage",
    "Current-Requester": "XLYS",
    "access_token": token
  }
});

// homepageAxiosInstance.interceptors.request.use(
//   res => {
//     console.log(res);
//   },
//   error => {
//     return Promise.reject(error.response);
//   }
// );

export default homepageAxiosInstance;
