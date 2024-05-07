import axios from "axios";

const BASE_URL = "http://192.168.1.107:1337/api";
const API_KEY = "04336990711690dd80bd92683981defdc740c21a3b620dccf6bc6d12ec38e75bfd9aa8c7c5e3cb1ab1f7b9495944dab9f885c2e4cf9be620bc6be888b4aa9137e6fa137c08104163b968d4ebafa10dfbd91e18555ecd30c272d52a81942f53aa5795c4f16f5b65070c1d7e166ab3eaab93d0c992f4dd18b5f3c95cc55c9c261d";

const AxioInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: "Bearer " + API_KEY,
  },
});

export const getClasses = () => AxioInstance.get("/classes");
export const getInstructors = () => AxioInstance.get("/instructors?populate=*");