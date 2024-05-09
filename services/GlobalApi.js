import axios from "axios";

const AxioInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_API_KEY,
  },
});

export const getClasses = () => AxioInstance.get("/classes?populate=*");
export const getClassesScheduleScreen = () => AxioInstance.get("/classes?populate[instructor][populate]=nombreCompleto,fotoPerfil&populate[room][populate]=roomNumber,bicycles");
export const getInstructors = () => AxioInstance.get("/instructors?populate=*");
export const getUsers = () => AxioInstance.get("/users?populate=*");