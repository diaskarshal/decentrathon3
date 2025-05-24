import { $authHost } from "./index";

export const createDrone = async (droneData) => {
  const { data } = await $authHost.post("api/drone", droneData);
  return data;
};

export const getMyDrones = async () => {
  const { data } = await $authHost.get("api/drone/my");
  return data;
};

export const getAllDrones = async () => {
  const { data } = await $authHost.get("api/drone");
  return data;
};

export const getDrone = async (id) => {
  const { data } = await $authHost.get(`api/drone/${id}`);
  return data;
};

export const updateDrone = async (id, droneData) => {
  const { data } = await $authHost.put(`api/drone/${id}`, droneData);
  return data;
};

export const deleteDrone = async (id) => {
  const { data } = await $authHost.delete(`api/drone/${id}`);
  return data;
};
