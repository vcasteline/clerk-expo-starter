import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootTabParamList, RootStackParamList, RootStackScreenProps } from "../types";
import HomeScreen from "../screens/HomeScreen";
import ScheduleScreen from "./schedule/ScheduleScreen";
import InstructorsScreen from "../screens/InstructorsScreen";
import BottomNav from "../navigation/BottomNav";

const MainStack = createNativeStackNavigator<RootTabParamList>();

export default function MainScreen({
    navigation,
    route,
  }: RootStackScreenProps<"Main">) {
  return (
    <BottomNav/>
  );
};
