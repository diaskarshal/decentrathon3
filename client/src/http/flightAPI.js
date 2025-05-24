import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

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