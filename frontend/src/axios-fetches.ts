import axios from "axios";

// const CancelToken = axios.CancelToken;
// export let cancel;

const instance = axios.create({
  baseURL: "https://spgwas.waslitbre.org/api",
  // baseURL: "https://pgwas.dev/api",
});
console.log("runned");
const authUser = localStorage.getItem("user");

let token = "";

if (authUser) {
  token = JSON.parse(authUser).accessToken;
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
    // Edit request config before it is sent
    const authUser = localStorage.getItem("user");
    let token = "";
    if (authUser) {
      token = JSON.parse(authUser).accessToken;
    }
    request.headers.common["Authorization"] = `Bearer ${token}`;
    return request;
  },
  (error) => {
    console.log(error?.response?.data);
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

export default instance;
