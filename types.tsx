import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Instructor } from "./interfaces";

// ...

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: undefined;
  Main: undefined;
  BikeSelection: undefined;
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
  SettingsProfile: undefined;
  RideHistory: undefined;
  ProfileStack: undefined;
  VerifyCode: undefined;
  Class: undefined;
};
export type RootTabParamList = {
  HomeStack: undefined;
  ScheduleStack: undefined;
  ProfileStack: undefined;
  InstructorStack: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
