/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from 'expo-linking';

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Welcome: {
            screens: {
              WelcomeScreen: "Welcome",
            },
          },
          SignUp: {
            screens: {
              SignUpScreen: "SignUp",
            },
          },
          SignIn: {
            screens: {
              SignInScreen: "SignIn",
            },
          },
          Home: {
            screens: {
              HomeScreen: "Home",
            },
          },
          Schedule: {
            screens: {
              ScheduleScreen: "Schedule",
            },
          },
          Instructors: {
            screens: {
              InstructorsScreen: "Instructors",
            },
          }
        },
      },
    },
  },
};

export default linking;
