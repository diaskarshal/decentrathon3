import axios from "axios";

const $host = axios.create({//does not require auth
  baseURL: "http://localhost:5000",
});

const $authHost = axios.create({//requires auth, header authorizaiton will be added automatically
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