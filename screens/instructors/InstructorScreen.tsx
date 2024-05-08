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
import CalendarStrip from "react-native-calendar-strip";


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
        <Text style={{ ...styles.titleText, color: "white" }}>Sofia's Profile</Text>
      </View>
      <View style={stylesHere.dashboard}>
      <View style={stylesHere.containerHere}>
      <View style={stylesHere.instructorInfo}>
        <Image
          source={{ uri: 'https://utfs.io/f/bf77a67e-af87-47f1-92c3-c129615e27c0-4nhplr.jpg' }} // Reemplaza con la URL de la imagen del instructor
          style={stylesHere.instructorImage}
        />
        <View style={stylesHere.instructorDetails}>
          <Text style={stylesHere.instructorName}>Sofia Chang</Text>
          <Text style={stylesHere.instructorSpecialty}>Drum & Bass</Text>
          <View style={stylesHere.ratingContainer}>
            <Text style={stylesHere.ratingText}>5+ years</Text>
            <Text style={stylesHere.ratingText}>4.8 ★</Text>
          </View>
        </View>
      </View>

      <Text style={stylesHere.sectionTitle}>About Instructor</Text>
      <Text style={stylesHere.description}>
        I'm believe in the power of pushing limits and breaking through personal barriers. My philosophy centers around the idea that true.
      </Text>

      <Text style={stylesHere.sectionTitle}>Upcoming Classes</Text>
      {/* Renderiza tu componente de calendario aquí */}
      <View style={{width: "100%", marginTop: 8}}>
        <CalendarStrip
            numDaysInWeek={7}
            style={{ height: 100, paddingTop: 6, paddingBottom: 0 }}
            daySelectionAnimation={{
              type: "background",
              duration: 200,
              highlightColor: "#F6FD91",
            }}
            highlightDateNumberStyle={{ color: "black" }}
            highlightDateNameStyle={{ color: "black" }}
            calendarHeaderStyle={{color: 'black', alignItems: 'flex-start', textAlign:'left'}}
            calendarHeaderContainerStyle={{ display:'flex', width: '100%'}}
            dateNumberStyle={{color: 'black'}}
            dateNameStyle={{color: 'black'}}
            />
      </View>
    </View>
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
  containerHere: {
    flex: 1,
    padding: 16,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  instructorDetails: {
    flex: 1,
  },
  instructorName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructorSpecialty: {
    fontSize: 16,
    color: 'gray',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
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
