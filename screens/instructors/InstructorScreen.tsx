import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../components/Styles";
import { RootStackScreenProps } from "../../types";

export default function InstructorScreen({
  navigation,
  route,
}: RootStackScreenProps<"Instructor">) {
  
  const onBackPress = () => navigation.popToTop();


  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
        <Text style={{ ...styles.titleText, color: "white" }}>Instructor Name</Text>
      </View>
      <View style={stylesHere.dashboard}>
        
      </View>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  dashboard: {
    borderRadius: 30,
    padding: 24,
    marginTop: 30,
    paddingBottom: 40,
    width: "100%",
    height: 630,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bikeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  bikeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  selectedBikeButton: {
    backgroundColor: "#42a5f5",
  },
  unavailableBikeButton: {
    backgroundColor: "#bdbdbd",
  },
  bikeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  instructorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  instructorName: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: "#42a5f5",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
