import axios from "axios";

const AxioInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_API_KEY,
  },
});

export const getClasses = () => AxioInstance.get("/classes");
export const getInstructors = () => AxioInstance.get("/instructors?populate=*");