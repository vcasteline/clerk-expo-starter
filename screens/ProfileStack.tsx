import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, RootStackScreenProps } from "../types";
import SafeMyProfileScreen from "./profile/MyProfileScreen";
import SettingsProfileScreen from "./profile/SettingsProfileScreen";
import RideHistoryScreen from "./profile/RideHistory";
import BuyRidesScreen from "./schedule/BuyRidesScreen";
import ChangePasswordScreen from "./profile/ChangePasswordScreen";
import PaymentMethodScreen from "./profile/PaymentMethodScreen";
import PurchaseSummaryScreen from "./schedule/PurchaseSummaryScreen";
import MyCardsScreen from "./profile/MyCards";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function ProfileStack(
  {}: RootStackScreenProps<"ProfileStack">,
  { setIsSignedIn }: { setIsSignedIn: (isSignedIn: boolean) => void }
) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MyProfile" component={SafeMyProfileScreen} />
      <Stack.Screen name="SettingsProfile" component={SettingsProfileScreen} />
      <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
      <Stack.Screen name="BuyRides" component={BuyRidesScreen} />
      <Stack.Screen name="PurchaseSummary" component={PurchaseSummaryScreen} />  
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="MyCards" component={MyCardsScreen} />



      {/* <Stack.Screen name="SignIn" component={SignInScreen} /> */}
    </Stack.Navigator>
  );
}
