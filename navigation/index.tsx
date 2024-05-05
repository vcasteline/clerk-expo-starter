/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { ClerkLoaded, useUser } from "@clerk/clerk-expo";
import * as SplashScreen from "expo-splash-screen";
import HomeScreen from "../screens/HomeScreen";
import InstructorsScreen from "../screens/InstructorsScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import BottomNav from "./BottomNav";

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Read more about the protected routes pattern in React Native
 *
 * https://reactnavigation.org/docs/auth-flow
 */
const RootNavigator = () => {
  const { isSignedIn, isLoaded } = useUser();

  React.useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  return (
    <ClerkLoaded>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isSignedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Home" }}
            />
            <Stack.Screen
              name="Schedule"
              component={ScheduleScreen}
              options={{ title: "Schedule" }}
            />
             <Stack.Screen
              name="Instructors"
              component={InstructorsScreen}
              options={{ title: "Instructors" }}
            />
          </>
          
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ title: "Welcome" }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ title: "Sign In" }}
            />
            <Stack.Screen
              name="VerifyCode"
              component={VerifyCodeScreen}
              options={{ title: "Sign Up" }}
            />
          </>
        )}
      </Stack.Navigator>
    </ClerkLoaded>
  );
};
