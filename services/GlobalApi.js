import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_BASE_URL;

const AxioInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_API_KEY,
  },
});

export const getClasses = () => AxioInstance.get("/classes?populate=*");
export const getClassesScheduleScreen = () => AxioInstance.get("/classes?populate[instructor][populate]=nombreCompleto,fotoPerfil&populate[room][populate]=roomNumber,bicycles");
export const getInstructors = () => AxioInstance.get("/instructors?populate=*");

// export const getUsers = () => AxioInstance.get("/users?populate=*");

export const getClassBicycles = async (classId: number) => {
  try {
    const response = await AxioInstance.get(
      `${API_URL}/classes/${classId}?populate[room][populate]=bicycles`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};