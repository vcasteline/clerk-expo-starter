import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "../screens/onboarding/SignUpScreen";
import SignInScreen from "../screens/onboarding/SignInScreen";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import MainScreen from "../screens/MainScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../utils/UserContext";
import EnterNameScreen from "../screens/onboarding/EnterNameScreen";
import EnterDOBScreen from "../screens/onboarding/EnterDOB";
import EnterNumberScreen from "../screens/onboarding/EnterNumber";
import { AuthContext } from "../utils/AuthContext";

export default function Navigation() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [auth, setAuth] = React.useState({ isSignedIn: false });

  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    number: "",
    email: "",
    password: "",
  });

  React.useEffect(() => {
    const checkUserSignedIn = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setAuth({ isSignedIn: !!token });
        SplashScreen.hideAsync();
      } catch (e) {
        console.log("Failed to load the token");
      }
    };
  
    checkUserSignedIn();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AuthContext.Provider value={{ auth, setAuth }}>
        <NavigationContainer linking={LinkingConfiguration}>
          <RootNavigator isSignedIn={isSignedIn} />
        </NavigationContainer>
      </AuthContext.Provider>
    </UserContext.Provider>
  );
}

interface RootNavigatorProps {
  isSignedIn: boolean;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC<RootNavigatorProps> = () => {
  const { auth } = React.useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {auth.isSignedIn ? (
        <>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ title: "Main" }}
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
            name="EnterName"
            component={EnterNameScreen}
            options={{ title: "Enter Name" }}
          />
          <Stack.Screen
            name="EnterDOB"
            component={EnterDOBScreen}
            options={{ title: "Enter DOB" }}
          />
          <Stack.Screen
            name="EnterNumber"
            component={EnterNumberScreen}
            options={{ title: "Enter Number" }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: "Sign In" }}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ title: "Main" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
