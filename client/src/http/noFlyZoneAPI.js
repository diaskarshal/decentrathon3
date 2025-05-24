import { $authHost } from "./index";

export const createNoFlyZone = async (zoneData) => {
  const { data } = await $authHost.post("api/noflyzone", zoneData);
  return data;
};

export const getAllNoFlyZones = async () => {
  const { data } = await $authHost.get("api/noflyzone");
  return data;
};

export const getNoFlyZone = async (id) => {
  const { data } = await $authHost.get(`api/noflyzone/${id}`);
  return data;
};

export const updateNoFlyZone = async (id, zoneData) => {
  const { data } = await $authHost.put(`api/noflyzone/${id}`, zoneData);
  return data;
};

export const deleteNoFlyZone = async (id) => {
  const { data } = await $authHost.delete(`api/noflyzone/${id}`);
  return data;
};
