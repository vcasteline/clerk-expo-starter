import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../types";
import { styles } from "../components/Styles";
import ClassCard from "../components/ClassCard";
import InstructorCard from "../components/InstructorCard";
import BottomNav from "../navigation/BottomNav";

export default function HomeScreen({
  navigation, route
}: RootStackScreenProps<"Home">) {
  const { signIn, setSession, isLoaded } = useSignIn();
  const onSchedulePress = () => navigation.replace("Schedule");
  const onInstructorPress = () => navigation.replace("Instructors");
  const instructorImage = require("../assets/images/instructor-1.jpg");

  const stylesHere = StyleSheet.create({
    container: {
      padding: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    rides: {
        flex:1,
        marginBottom:38 
    },
    instructors:{
        flex:2
    },
    logoImage: {
      width: 100,
      resizeMode: "contain",
      justifyContent: "flex-start",
    },
    iconImage: {
      width: 28,
      height: 28,
      resizeMode: "contain",
      marginTop: -5,
      marginLeft: 3,
    },
    heading: {
      display: "flex",
      justifyContent: "flex-start",
      textAlign: "left",
      width: "100%",
      marginLeft: 60,
      marginBottom: 20,
    },
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 28,
      paddingBottom: 40,
      width: "100%",
      height: 600,
      justifyContent: "center",
      backgroundColor: "#fff",
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
      textAlign: "center",
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
  });
  return (
    <View style={styles.containerInside}>
      <View style={stylesHere.heading}>
        <Image
          style={stylesHere.logoImage}
          source={require("../assets/images/volta-logo-white.png")}
        />
      </View>
      <View style={styles.center}>
        <View style={styles.box}>
          <View style={styles.spaceBet}>
            <Text style={stylesHere.boxTitle}>Ride Legacy</Text>
            <Image
              style={stylesHere.iconImage}
              source={require("../assets/images/fire-icon.png")}
            />
          </View>

          <Text style={stylesHere.boxContent}>17</Text>
          <Text style={stylesHere.boxContentBottom}>Rides completed</Text>
        </View>
        <View style={styles.box}>
          <View style={styles.spaceBet}>
            <Text style={stylesHere.boxTitle}>Your Classes</Text>
            <Image
              style={stylesHere.iconImage}
              source={require("../assets/images/wheel-icon.png")}
            />
          </View>

          <Text style={stylesHere.boxContent}>12</Text>
          <Text style={stylesHere.boxContentBottom}>Available</Text>
        </View>
      </View>

      <View style={stylesHere.dashboard}>
        <View style={stylesHere.rides}>
          <View style={styles.spaceBet}>
            <Text style={styles.titleText}>Upcoming Rides</Text>
            <TouchableWithoutFeedback onPress={onSchedulePress}>
              <Text style={styles.titleText}>&#8594;</Text>
            </TouchableWithoutFeedback>
          </View>
          <View>
            {/* <Text style={styles.paragraph}>No booked rides</Text> */}
            <ClassCard date="Feb 20" className="Rider Rythm" time="20:30" instructor="Sofis Chang" spots={20}/>
            <ClassCard date="Feb 20" className="Rider Rythm" time="20:30" instructor="Sofis Chang" spots={20}/>

          </View>
        </View>
        <View style={stylesHere.instructors}>
          <View style={styles.spaceBet}>
            <Text style={styles.titleText}>Instructors</Text>
            <TouchableWithoutFeedback onPress={onInstructorPress}>
              <Text style={styles.titleText}>&#8594;</Text>
            </TouchableWithoutFeedback>
          </View>
          <ScrollView horizontal={true}>
            <InstructorCard name="Sofia Chang" category="fast" image={instructorImage}/>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}