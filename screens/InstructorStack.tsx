import React from 'react';
import ScheduleScreen from './schedule/ScheduleScreen';
import BikeSelectionScreen from './schedule/BikeSelectionScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackScreenProps } from '../types';
import InstructorsScreen from './instructors/InstructorsScreen';
import InstructorScreen from './instructors/InstructorScreen';
import BuyRidesScreen from './schedule/BuyRidesScreen';
import PurchaseSummaryScreen from './schedule/PurchaseSummaryScreen';
import PaymentMethodScreen from './profile/PaymentMethodScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function InstructorStack({
  }: RootStackScreenProps<"InstructorStack">) {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Instructors" component={InstructorsScreen} />
      <Stack.Screen name="Instructor" component={InstructorScreen} />
      <Stack.Screen name="BikeSelection" component={BikeSelectionScreen} />
      <Stack.Screen name="BuyRides" component={BuyRidesScreen} />
      <Stack.Screen name="PurchaseSummary" component={PurchaseSummaryScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />

    </Stack.Navigator>
  );
};
