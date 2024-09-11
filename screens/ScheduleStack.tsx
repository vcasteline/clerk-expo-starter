import React from 'react';
import ScheduleScreen from './schedule/ScheduleScreen';
import BikeSelectionScreen from './schedule/BikeSelectionScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackScreenProps } from '../types';
import BuyRidesScreen from './schedule/BuyRidesScreen';
import SuccessfulScreen from './schedule/SuccessfulScreen';
import PurchaseSummaryScreen from './schedule/PurchaseSummaryScreen';
import PaymentMethodScreen from './profile/PaymentMethodScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function ScheduleStack({
  }: RootStackScreenProps<"ScheduleStack">) {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="BikeSelection" component={BikeSelectionScreen} />
      <Stack.Screen name="BuyRides" component={BuyRidesScreen} />
      <Stack.Screen name="PurchaseSummary" component={PurchaseSummaryScreen} />  
      <Stack.Screen name="Successful" component={SuccessfulScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
    </Stack.Navigator>
  );
};
