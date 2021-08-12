import axios from "axios";

// const CancelToken = axios.CancelToken;
// export let cancel;

const instance = axios.create({
  baseURL: "http://spgwas.waslitbre.org/api",
  // baseURL: "http://localhost:5000/api/v1",
});

const authUser = localStorage.getItem("authuser");

let token = "";

if (authUser) {
  token = JSON.parse(authUser).token;
}

instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// instance.defaults.withCredentials = true;

// Can add interceptors here
// interceptors: functions defined globally
// useful for setting common headers
// Logging responses
// Global handling of errors
// Executed for every request in any component leaving the app and every
//response returned

instance.interceptors.request.use(
  (request) => {
    // Edit request config
    console.log("Sending request...");
    return request;
  },
  (error) => {
    console.log(error.response.data);
    return Promise.reject(error);
  }
);

// Set interceptors differently for responses
instance.interceptors.response.use(
  (response) => {
    // Edit response config
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setHeaders = () => {
  const authUser = localStorage.getItem("authuser");

  let token = "";

  if (authUser) {
    token = JSON.parse(authUser).token;
  }

  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default instance;
