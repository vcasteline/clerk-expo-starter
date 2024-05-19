import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import ClassCard from "../../components/ClassCard";
import { Ionicons } from "@expo/vector-icons";

export default function RideHistoryScreen({
  navigation,
  route,
}: RootStackScreenProps<"RideHistory">) {
  const stylesHere = StyleSheet.create({
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 30,
      paddingBottom: 40,
      width: "100%",
      height: 630,
      justifyContent: "flex-start", // Cambia "center" a "flex-start"
      backgroundColor: "#fff",
    },
  });
  const instructorImage = require("../../assets/images/instructor-1.jpg");
  const onBackPress = () => navigation.popToTop();

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          ...styles.flex,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          marginLeft: 60,
          marginTop: 10,
        }}
      >
        <Text style={{ ...styles.titleText, color: "white" }}>
          Historial de Rides
        </Text>
      </View>

      <View style={styles.centerToLeft}>
        <Text style={styles.description}>
          Registro de tu historia en Volta.
        </Text>
      </View>
      <View style={stylesHere.dashboard}>
        <ScrollView>
          <ClassCard
            onPress={null}
            image={null}
            date="Feb 20"
            className="Rider Rythm"
            time="20:30"
            instructor="Valentina Casteline"
            spots={20}
          />
        </ScrollView>
      </View>

      {/* fetch the instructors */}
    </View>
  );
}
