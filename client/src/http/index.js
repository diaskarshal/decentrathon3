import axios from "axios";

const $host = axios.create({
  baseURL: "http://localhost:5000",
});

const $authHost = axios.create({
  baseURL: "http://localhost:5000",
});

const authInterceptor = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };