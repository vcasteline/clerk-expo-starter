import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackScreenProps } from '../types';
import SafeMyProfileScreen from './profile/MyProfileScreen';
import SettingsProfileScreen from './profile/SettingsProfileScreen';
import RideHistoryScreen from './profile/RideHistory';
import BuyRidesScreen from './schedule/BuyRidesScreen';
import ChangePasswordScreen from './profile/ChangePasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function ProfileStack({
  }: RootStackScreenProps<"ProfileStack">) {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MyProfile" component={SafeMyProfileScreen} />
      <Stack.Screen name="SettingsProfile" component={SettingsProfileScreen} />
      <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
      <Stack.Screen name="BuyRides" component={BuyRidesScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

    </Stack.Navigator>
  );
};
