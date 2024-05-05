import React from "react";
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../types";
import { styles } from "../components/Styles";
import ClassCard from "../components/ClassCard";

export default function ScheduleScreen({
  navigation,route
}: RootStackScreenProps<"Schedule">) {
  const { signIn, setSession, isLoaded } = useSignIn();
  const stylesHere = StyleSheet.create({
    dashboard: {
        borderRadius: 30,
        padding: 24,
        marginTop: 75,
        paddingBottom: 40,
        width: "100%",
        height: 800,
        justifyContent: "center",
        backgroundColor: "#fff",
    }
  });
  return (
    <View style={styles.containerInside}>
        <Text style={{...styles.titleText, color:"white"}}>Schedule</Text>
        <View style={stylesHere.dashboard}>

        </View>
      {/* Schedule/fetch classes */}
    </View>
  );
}
