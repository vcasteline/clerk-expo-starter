import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../types";
import { styles } from "../components/Styles";
import ClassCard from "../components/ClassCard";
import InstructorCard from "../components/InstructorCard";

export default function InstructorsScreen({
  navigation,
  route,
}: RootStackScreenProps<"Instructors">) {
  const { signIn, setSession, isLoaded } = useSignIn();
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
  const instructorImage = require("../assets/images/instructor-1.jpg");

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <Text style={{ ...styles.titleText, color: "white" }}>Instructors</Text>
      </View>

      <View style={stylesHere.dashboard}>
        <ScrollView>
          <InstructorCard
            name="Valentina Casteline"
            category="reggaeton"
            image={instructorImage}
          />
          <InstructorCard
            name="Valentina Casteline"
            category="reggaeton"
            image={instructorImage}
          />
          <InstructorCard
            name="Valentina Casteline"
            category="reggaeton"
            image={instructorImage}
          />
          <InstructorCard
            name="Valentina Casteline"
            category="reggaeton"
            image={instructorImage}
          />
        </ScrollView>
      </View>

      {/* fetch the instructors */}
    </View>
  );
}
