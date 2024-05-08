import { NativeStackScreenProps } from "@react-navigation/native-stack";

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
  Home: undefined;
  ScheduleStack: undefined;
  Schedule: undefined;
  Instructor: undefined;
  InstructorStack: undefined;
  Instructors: undefined;
  MyProfile: undefined;
  SettingsProfile: undefined;
  ProfileStack: undefined;
  VerifyCode: undefined;
};
export type RootTabParamList = {
  Home: undefined;
  ScheduleStack: undefined;
  ProfileStack: undefined;
  InstructorStack: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
