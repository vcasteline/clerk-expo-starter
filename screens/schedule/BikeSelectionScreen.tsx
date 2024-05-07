import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";

export default function BikeSelectionScreen({
  navigation,
  route,
}: RootStackScreenProps<"BikeSelection">) {
  const [selectedBike, setSelectedBike] = useState(null);

  const bikes = [
    { id: 1, available: true },
    { id: 2, available: true },
    { id: 3, available: false },
    { id: 4, available: true },
    { id: 5, available: false },
    { id: 6, available: true },
    // ... rest of the bikes
  ];

  const handleBikeSelect = (bikeId: any) => {
    setSelectedBike(bikeId);
  };

  const renderBikeButton = (bike: any) => {
    const isSelected = selectedBike === bike.id;
    const buttonStyle = [
      stylesHere.bikeButton,
      isSelected && stylesHere.selectedBikeButton,
      !bike.available && stylesHere.unavailableBikeButton,
    ];

    return (
      <TouchableOpacity
        key={bike.id}
        style={buttonStyle}
        onPress={() => bike.available && handleBikeSelect(bike.id)}
        disabled={!bike.available}
      >
        <Text style={stylesHere.bikeButtonText}>{bike.id}</Text>
      </TouchableOpacity>
    );
  };
  const onBackPress = () => navigation.popToTop();

  // const instructorImage = require("../../assets/images/instructor-1.jpg");

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
        <Text style={{ ...styles.titleText, color: "white" }}>Select Bike</Text>
      </View>
      <View style={stylesHere.dashboard}>
        <View style={stylesHere.bikeGrid}>{bikes.map(renderBikeButton)}</View>
        <Image
          source={{ uri: "https://example.com/instructor-image.jpg" }}
          style={styles.instructorImage}
        />
        <Text style={stylesHere.instructorName}>Sofia Chang</Text>
        <TouchableOpacity
          style={stylesHere.reserveButton}
          onPress={() => console.log(`Reserved bike ${selectedBike}`)}
          disabled={!selectedBike}
        >
          <Text style={stylesHere.reserveButtonText}>Reserve Bike</Text>
        </TouchableOpacity>
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
