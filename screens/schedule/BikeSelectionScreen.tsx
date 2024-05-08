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
    { id: 7, available: false },
    { id: 8, available: true },
    { id: 9, available: true },
    { id: 10, available: true },
    { id: 11, available: false },
    { id: 12, available: true },
    { id: 13, available: false },
    { id: 14, available: true },
    { id: 15, available: false },
    { id: 16, available: true },
    { id: 17, available: true },
    { id: 18, available: true },
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
      <View style={styles.center}>
        <View style={stylesHere.box}>
          <View style={styles.spaceBet}>
            <Ionicons name="calendar" color={"#F6FD91"} size={28} />
          </View>
          <Text style={stylesHere.boxContentBottom}>Date & Time</Text>
          <Text style={stylesHere.boxContentBottomTwo}>21 WED - 9:00AM</Text>
        </View>
        <View style={stylesHere.box}>
          <View style={styles.spaceBet}>
            <Ionicons name="person" color={"#F6FD91"} size={28} />
          </View>
          <Text style={stylesHere.boxContentBottom}>Instructor</Text>
          <Text style={stylesHere.boxContentBottomTwo}>Sofia Chang</Text>
        </View>
      </View>
      <View style={stylesHere.dashboard}>
        <Text style={styles.subtitle}>Select Bike</Text>
        <View style={stylesHere.legendContainer}>
          <View style={stylesHere.legendItem}>
            <View style={[stylesHere.colorBox, stylesHere.selectedColor]} />
            <Text style={stylesHere.legendText}>Selected</Text>
          </View>
          <View style={stylesHere.legendItem}>
            <View style={[stylesHere.colorBox, stylesHere.availableColor]} />
            <Text style={stylesHere.legendText}>Available</Text>
          </View>
          <View style={stylesHere.legendItem}>
            <View style={[stylesHere.colorBox, stylesHere.unavailableColor]} />
            <Text style={stylesHere.legendText}>Unavailable</Text>
          </View>
        </View>
        <View style={stylesHere.bikeGrid}>{bikes.map(renderBikeButton)}</View>
        <Image
          source={{
            uri: "https://utfs.io/f/dd4fb05a-682a-49d6-b708-d847325c3bd8-4jboq.jpg",
          }}
          style={stylesHere.instructorImage}
        />
        <Text style={stylesHere.instructorName}>Sofia Chang</Text>
        <View style={stylesHere.bottomContainer}>
          <Ionicons name="bicycle" color={"black"} size={28} />
          <Text style={stylesHere.bikeNumber}>
            {selectedBike || "Select Bike"}
          </Text>
          <TouchableOpacity
            style={selectedBike ? stylesHere.reserveButton : stylesHere.reserveButtonDisabled}
            onPress={() => console.log(`Reserved bike ${selectedBike}`)}
            disabled={!selectedBike}
          >
            <Text style={stylesHere.reserveButtonText}>Reserve Bike</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  box: {
    backgroundColor: "#141414",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 24,
    padding: 30,
    height: 135,
    width: 175,
  },
  boxTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginBottom: 24,
  },
  boxContent: {
    textAlign: "center",
    color: "white",
    fontSize: 40,
    marginBottom: 7,
    fontWeight: "800",
  },
  boxContentBottom: {
    textAlign: "left",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  boxContentBottomTwo: {
    textAlign: "left",
    fontSize: 15,
    color: "white",
  },
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginTop: -5,
    marginLeft: 3,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  bikeNumber: {
    fontSize: 16,
    marginHorizontal: 10
  },
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
  selectedBikeButton: {
    backgroundColor: "#3D4AF5",
    color: "white",
  },
  bikeButton: {
    width: 35,
    height: 45,
    borderRadius: 8,
    backgroundColor: "#CDDDFC",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  unavailableBikeButton: {
    backgroundColor: "#D8D8D8",
  },
  bikeButtonText: {
    fontSize: 18,
    // color: "white"
  },
  instructorImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  instructorName: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: "70%",
    alignSelf: "center",
  },
  reserveButtonDisabled: {
    backgroundColor: "#CDCDCD",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: "70%",
    alignSelf: "center",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    //fontWeight: "bold",
  },
  legendContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedColor: {
    backgroundColor: "#3D4AF5",
  },
  availableColor: {
    backgroundColor: "#CDDDFC",
  },
  unavailableColor: {
    backgroundColor: "#D8D8D8",
  },
  legendText: {
    fontSize: 14,
  },
});
