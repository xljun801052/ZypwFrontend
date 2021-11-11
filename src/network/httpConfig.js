import axios from "axios";

/*
 *  The project's global network configuration.
 **/

// step-0: configure the timeout and gateway address.
axios.defaults.baseURL = "http://localhost:12019/api";
axios.defaults.timeout = 5000;

//step-1: sort out request data.
axios.defaults.transformRequest = function(data) {
  data = JSON.stringify(data);
  return data;
};

// step-2: configure the request interceptor.
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error.response);
  }
);

// step-3: configure the response interceptor.
axios.interceptors.response.use(
  response => {
    if (response.data.resultCode == "404") {
      console.log("response-interceptor encounters a 404 exception!");
    } else {
      return response;
    }
  },
  error => {
    return Promise.reject(error.response);
  }
);

export default axios;