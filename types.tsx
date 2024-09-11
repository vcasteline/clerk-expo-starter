import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Instructor, Booking, User, PurchaseRides } from "./interfaces";

// ...

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: undefined;
  Main: undefined;
  BikeSelection: {
    instructor: {
      name: string;
      image: string;
    };
    convertedDate: any;
    rawDate: string;
    time: any;
    timeFin: any;
    classId: number;
    className: string;
    dia: string;
  };
  Successful: {
    instructor: string;
    date: string;
    startTime: string;
    endTime: string;
    bicycleNumber: any;
    dayOfWeek: string;
    guestBicycleNumber: any;
    guestName: any;
  };
  PurchaseSummary: { selectedPackage: PurchaseRides };
  BuyRides: undefined;
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  HomeStack: undefined;
  Home: undefined;
  ScheduleStack: undefined;
  Schedule: undefined;
  Instructors: undefined;
  Instructor: { instructorData: Instructor };
  InstructorStack: undefined;
  MyProfile: undefined;
  EnterName: undefined;
  EnterDOB: undefined;
  EnterNumber: undefined;
  SettingsProfile: undefined;
  RideHistory: undefined;
  PaymentMethod: {
    username: string;
    userId: string;
    email: string;
  };
  MyCards: {
    username: string;
    userId: string;
    email: string;
  }
  ProfileStack: undefined;
  VerifyCode: undefined;
  Class: {
    bookingData: Booking;
    userData?: User;
  };
  ChangePassword: undefined;
  NextRides: {
    user: User | undefined;
    bookings: Booking[];
  }
};
export type RootTabParamList = {
  HomeStack: undefined;
  ScheduleStack: undefined;
  ProfileStack: undefined;
  InstructorStack: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
