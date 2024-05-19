import axios from "axios";
import { Booking } from "../interfaces";
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
export const getBookings = () => AxioInstance.get("/bookings?populate=*");

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

export const reserveBike = async (bookingData: any, token: any) => {
  const formattedBookingData = {
    class: bookingData.class,
    bicycle: bookingData.bicycle,
    user: bookingData.user,
    bookingStatus: bookingData.bookingStatus,
    fechaHora: bookingData.fechaHora
  };

try {
    const response = await axios.post(`${API_URL}/bookings`, { data: formattedBookingData }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserClases = async (userId: any, clasesDisponibles: any, token: any) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, {
      clasesDisponibles,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserBookings = async (token: string, userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/bookings?populate[class][populate][instructor][populate]=*&populate[bicycle][populate]=*&filters[user][id][$eq]=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data as Booking[];
  } catch (error) {
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: number, status: string, token: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/bookings/${bookingId}`,
      {
        data: {
          bookingStatus: status,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};