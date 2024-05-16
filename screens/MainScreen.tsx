import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootTabParamList, RootStackParamList, RootStackScreenProps } from "../types";
import BottomNav from "../navigation/BottomNav";
import { StatusBar } from "react-native";

const MainStack = createNativeStackNavigator<RootTabParamList>();

export default function MainScreen({
    navigation,
    route,
  }: RootStackScreenProps<"Main">) {
  return (
    <>
      <StatusBar translucent/>
      <BottomNav/>
    </>
    
  );
};
