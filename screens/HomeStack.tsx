import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackScreenProps } from '../types';
import HomeScreen from './home/HomeScreen';
import ClassScreen from './home/ClassScreen';
import InstructorScreen from './instructors/InstructorScreen';
import NextRidesScreen from './home/NextRides';
import BikeSelectionScreen from './schedule/BikeSelectionScreen';
import SuccessfulScreen from './schedule/SuccessfulScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function HomeStack({
  }: RootStackScreenProps<"HomeStack">) {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Class" component={ClassScreen} />
      <Stack.Screen name="Instructor" component={InstructorScreen} />
      <Stack.Screen name="NextRides" component={NextRidesScreen} />
      <Stack.Screen name="BikeSelection" component={BikeSelectionScreen} />
      <Stack.Screen name="Successful" component={SuccessfulScreen} />

    </Stack.Navigator>
  );
};
