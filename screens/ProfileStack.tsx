import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackScreenProps } from '../types';
import SafeMyProfileScreen from './profile/MyProfileScreen';
import SettingsProfileScreen from './profile/SettingsProfileScreen';
import RideHistoryScreen from './profile/RideHistory';

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
    </Stack.Navigator>
  );
};
