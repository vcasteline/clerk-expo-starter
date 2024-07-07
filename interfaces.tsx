export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  password: string;
  resetPasswordToken: string;
  confirmationToken: string;
  confirmed: boolean;
  blocked: boolean;
  role: "Authenticated" | "Public";
  clasesDisponibles: number;
  bookings: Booking[];
  past_bookings: Booking[];
  nombre: string;
  apellido: string;
  birthday: Date;
}

export interface Booking {
  fechaHora: any;
  class: any;
  id: number;
  attributes: {
    bicycles: any;
    class: ClassThroughBookings;
    bicycle: BicycleThroughBookings;
    bookingStatus: "refunded" | "completed" | "cancelled";
    user: User;
    fechaHora: string;
    guest?: Guest;
    guestBicycle?: BicycleThroughBookings;
  };
}

export interface PurchaseRides {
  id: number;
  attributes: {
    diasDeExpiracion: any;
    numeroDeRides: number;
    precio: number;
    esUnPack: boolean;
  };
}

export interface Class {
  id: number;
  attributes: {
    nombreClase: string;
    horaInicio: string;
    horaFin: string;
    diaDeLaSemana:
      | "Lunes"
      | "Martes"
      | "Miércoles"
      | "Jueves"
      | "Viernes"
      | "Sábado"
      | "Domingo";
    instructor: {
      data: Instructor;
    };
    room: {
      data: Room;
    };
  };
}

export interface ClassThroughBookings {
  data: {
    id: number;
    attributes: {
      nombreClase: string;
      horaInicio: string;
      horaFin: string;
      diaDeLaSemana:
        | "Lunes"
        | "Martes"
        | "Miércoles"
        | "Jueves"
        | "Viernes"
        | "Sábado"
        | "Domingo";
      instructor: {
        data: Instructor;
      };
      room: {
        data: Room;
      };
    };
  };
}

export interface Instructor {
  id: number;
  attributes: {
    nombreCompleto: string;
    estilo: string;
    bio: string;
    fotoPerfil: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export interface Bicycle {
  id: number;
  attributes: {
    bicycleNumber: number;
    room: Room;
  };
}

export interface BicycleThroughBookings {
  data: {
    id: number;
    attributes: {
      bicycleNumber: number;
      room: Room;
    };
  };
}

export interface Room {
  id: number;
  attributes: {
    roomNumber: number;
    bicycles: {
      data: Bicycle[];
    };
  };
}

export interface Guest {
  nombreCompleto: string;
  email: string;
}

export interface BookingData {
  class: number;
  bicycle: (number | null) [];
  bookingStatus: "refunded" | "completed" | "cancelled";
  user: number;
  fechaHora: string;
  guest?: Guest;
}

export interface SuccessfulScreenParams {
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  bicycleNumber: number | null;
  dayOfWeek: string;
  guestBicycleNumber: number | null;
}