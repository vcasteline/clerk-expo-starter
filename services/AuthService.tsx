import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("userToken"); // Eliminar el token
    return true; // Indica éxito
  } catch (error) {
    console.error("Error al cerrar la sesión:", error);
    return false; // Indica fracaso
  }
};

export const changePassword = async (currentPassword: string, password: string, passwordConfirmation: string, token: string) => {
  const passwordData = {
    currentPassword,
    password,
    passwordConfirmation
  };
  try {
    const response = await axios.post(
      `${API_URL}/auth/change-password`,
      passwordData,
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
export const registerUser = async (userData: {
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  email: string;
  birthday: Date;
  telefono: string;
  clasesDisponibles: number;
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/local/register`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (identifier: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/local`, {
      identifier: identifier,
      password: password,
    });
    const { jwt } = response.data;
    if (jwt) {
      await AsyncStorage.setItem("userToken", jwt);
      return true;
    }
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (
  userData: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
  },
  userId: any,
  token: string
) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (
  code: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      code,
      password,
      passwordConfirmation,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/me?populate[0]=bookings&populate[1]=past_bookings&populate[2]=past_bookings.class&populate[3]=past_bookings.class.instructor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
