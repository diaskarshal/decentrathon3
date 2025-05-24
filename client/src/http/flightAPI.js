import { $authHost, $host } from "./index";

export const createFlight = async (flightData) => {
  const { data } = await $authHost.post("api/flight", flightData);
  return data;
};

export const getMyFlights = async () => {
  const { data } = await $authHost.get("api/flight/my");
  return data;
};

export const getAllFlights = async () => {
  const { data } = await $authHost.get("api/flight");
  return data;
};

export const getFlight = async (id) => {
  const { data } = await $authHost.get(`api/flight/${id}`);
  return data;
};

export const approveFlight = async (id) => {
  const { data } = await $authHost.post(`api/flight/${id}/approve`);
  return data;
};

export const finishFlight = async (id) => {
  const { data } = await $authHost.post(`api/flight/${id}/finish`);
  return data;
};

export const updateFlight = async (id, flightData) => {
  const { data } = await $authHost.put(`api/flight/${id}`, flightData);
  return data;
};

export const deleteFlight = async (id) => {
  const { data } = await $authHost.delete(`api/flight/${id}`);
  return data;
};
