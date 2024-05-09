import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackScreenProps } from '../types';
import HomeScreen from './HomeScreen';
import ClassScreen from './ClassScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function HomeStack({
  }: RootStackScreenProps<"HomeStack">) {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Class" component={ClassScreen} />
    </Stack.Navigator>
  );
};
