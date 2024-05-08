import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootTabParamList, RootStackParamList, RootStackScreenProps } from "../types";
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
