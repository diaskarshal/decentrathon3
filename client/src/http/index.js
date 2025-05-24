import axios from "axios";

const $host = axios.create({//does not require auth
  baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({//requires auth, header authorizaiton will be added automatically
  baseURL: process.env.REACT_APP_API_URL,
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