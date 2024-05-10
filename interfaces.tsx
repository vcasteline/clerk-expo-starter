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
  nombre: string;
  apellido: string;
  birthday: Date;
}

export interface Booking {
  id: number;
  class: Class;
  bicycle: Bicycle;
  paymentStatus: "Pending" | "Paid" | "Cancelled";
  user: User;
  fechaHora: Date;
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
    isBooked: boolean;
    room: Room;
  };
}

export interface Room {
    id: number;
    attributes: {
    roomNumber: number;
    bicycles: {
      data: Bicycle[]
    };
  };
}
