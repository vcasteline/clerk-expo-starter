import axios from "axios";
import { Booking } from "../interfaces";
import { Alert } from "react-native";
const API_URL = process.env.EXPO_PUBLIC_BASE_URL;

const AxioInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_API_KEY,
  },
});

export const getClasses = () => AxioInstance.get("/classes?populate=*");
export const getClassesScheduleScreen = () =>
  AxioInstance.get(
    "/classes?populate[instructor][populate]=nombreCompleto,fotoPerfil&populate[room][populate]=roomNumber,bicycles"
  );
export const getInstructors = () => AxioInstance.get("/instructors?populate=*");
export const getBookings = () => AxioInstance.get("/bookings?populate=*");
export const getPurchaseRides = () =>
  AxioInstance.get("/purchase-rides?populate=*");

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
    bicycles: bookingData.bicycles,
    user: bookingData.user,
    bookingStatus: bookingData.bookingStatus,
    fechaHora: bookingData.fechaHora,
    guest: bookingData.guest
  };

  try {
    const response = await axios.post(
      `${API_URL}/bookings`,
      { data: formattedBookingData },
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

export const updateUserClases = async (
  userId: any,
  clasesDisponibles: any,
  token: any
) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      {
        clasesDisponibles,
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

export const createGuest = async (guestData: { nombreCompleto: string; email: string }, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/guests`,
      { data: guestData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUserBookings = async (token: string, userId: number) => {
  try {
    const response = await axios.get(
      `${API_URL}/bookings?populate[class][populate][instructor][populate]=*&populate[bicycles][populate]=*&populate[guest][populate]=*&filters[user][id][$eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data as Booking[];
  } catch (error) {
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: number,
  status: string,
  token: string
) => {
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

export const reservarClaseYActualizarPaquete = async (
  userId: number,
  token: string
) => {
  try {
    const ahora = new Date();

    // Obtener paquetes del usuario ordenados por fecha de expiración (los que expiran primero van primero)
    const paquetesResponse = await axios.get(
      `${API_URL}/purchased-ride-packs?filters[user][id][$eq]=${userId}&sort=fechaExpiracion:asc`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const paquetes = paquetesResponse.data.data;

    // Encontrar el primer paquete no expirado con clases disponibles
    const paqueteAActualizar = paquetes.find((p: any) => {
      const fechaExpiracion = new Date(p.attributes.fechaExpiracion);
      return (
        fechaExpiracion > ahora &&
        p.attributes.clasesOriginales > p.attributes.clasesUtilizadas
      );
    });

    if (paqueteAActualizar) {
      // Actualizar el paquete
      await axios.put(
        `${API_URL}/purchased-ride-packs/${paqueteAActualizar.id}`,
        {
          data: {
            clasesUtilizadas:
              paqueteAActualizar.attributes.clasesUtilizadas + 1,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar clasesDisponibles del usuario
      const userResponse = await axios.get(
        `${API_URL}/users/${userId}?fields[0]=clasesDisponibles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const nuevasClasesDisponibles = Math.max(
        (userResponse.data.clasesDisponibles || 0) - 1,
        0
      );
      await axios.put(
        `${API_URL}/users/${userId}`,
        { clasesDisponibles: nuevasClasesDisponibles },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        success: true,
        message: "Clase reservada y paquete actualizado con éxito",
      };
    } else {
      throw new Error("No hay clases disponibles en ningún paquete válido");
    }
  } catch (error) {
    console.error("Error en reservarClaseYActualizarPaquete:", error);
    throw error;
  }
};

export const devolverCreditoClase = async (
  userId: number | undefined,
  token: string,
  bookingId: number,
  onCancelWithoutRefund: () => void
) => {
  try {
    if (userId === undefined) {
      throw new Error("Usuario no definido");
    }

    const paquetesResponse = await axios.get(
      `${API_URL}/purchased-ride-packs?filters[user][id][$eq]=${userId}&sort=fechaExpiracion:asc`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const paquetes = paquetesResponse.data.data;
    const fechaActual = new Date();

    const paqueteAActualizar = paquetes.find(
      (p: {
        attributes: {
          clasesUtilizadas: number;
          fechaExpiracion: string | number | Date;
        };
      }) =>
        p.attributes.clasesUtilizadas > 0 &&
        new Date(p.attributes.fechaExpiracion) > new Date()
    );
    console.log("Paquete a actualizar:", paqueteAActualizar);

    if (paqueteAActualizar) {
      // Devolver un crédito
      await axios.put(
        `${API_URL}/purchased-ride-packs/${paqueteAActualizar.id}`,
        {
          data: {
            clasesUtilizadas: paqueteAActualizar.attributes.clasesUtilizadas - 1,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar clasesDisponibles del usuario
      const userResponse = await axios.get(
        `${API_URL}/users/${userId}?fields[0]=clasesDisponibles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const nuevasClasesDisponibles = userResponse.data.clasesDisponibles + 1;
      await axios.put(
        `${API_URL}/users/${userId}`,
        { clasesDisponibles: nuevasClasesDisponibles },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { success: true, message: "Clase cancelada y crédito devuelto exitosamente" };
    } else {
      return new Promise((resolve) => {
        Alert.alert(
          "¿Estás seguro?",
          "No tienes créditos válidos para devolver. Si cancelas ahora, no recibirás ningún reembolso. ¿Deseas continuar?",
          [
            {
              text: "Sí, cancelar",
              style: "default",
              onPress: () => {
                onCancelWithoutRefund();
                resolve({ success: false, message: "Cancelado sin devolución de crédito" });
              },
            },
            {
              text: "No",
              style: "cancel",
              onPress: () => resolve({ success: false, message: "Cancelación abortada" }),
            },
          ]
        );
      });
    }
  } catch (error) {
    console.error("Error al cancelar la clase y devolver el crédito:", error);
    throw error;
  }
};

const calcularFechaExpiracion = (fechaCompra: string | number | Date, diasDuracion: number) => {
  const fechaInicio = new Date(fechaCompra);
  let fechaExpiracion: Date;

  if (diasDuracion === 0) {
    // Calcular el último día del mes actual
    fechaExpiracion = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, 0);
  } else {
    fechaExpiracion = new Date(fechaInicio);
    fechaExpiracion.setDate(fechaExpiracion.getDate() + diasDuracion);
  }

  // Establecer la hora a 23:59:59.999
  fechaExpiracion.setHours(23, 59, 59, 999);
  return fechaExpiracion;
};

export const comprarPaquete = async (userId: any, numeroDeClases: any, diasDuracion: any, token: any) => {
  try {
    const fechaCompra = new Date();
    const fechaExpiracion = calcularFechaExpiracion(fechaCompra, diasDuracion);

    const response = await axios.post(`${API_URL}/purchased-ride-packs`, {
      data: {
        user: userId,
        numeroDeClases,
        clasesOriginales: numeroDeClases,
        clasesUtilizadas: 0,
        fechaCompra,
        fechaExpiracion,
        contabilizado: false
      }
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Actualizar clasesDisponibles del usuario
    const userResponse = await axios.get(`${API_URL}/users/${userId}?fields[0]=clasesDisponibles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const nuevasClasesDisponibles = (userResponse.data.clasesDisponibles || 0) + numeroDeClases;
    await axios.put(`${API_URL}/users/${userId}`, 
      { clasesDisponibles: nuevasClasesDisponibles },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error("Error al comprar paquete:", error);
    throw error;
  }
};