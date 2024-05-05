import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: undefined;
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Home: undefined;
  Schedule: undefined;
  Instructors: undefined;
  MyProfile: undefined;
  VerifyCode: undefined;
};
export type RootTabParamList = {
  Home: undefined;
  Schedule: undefined;
  MyProfile: undefined;
  Instructors: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
