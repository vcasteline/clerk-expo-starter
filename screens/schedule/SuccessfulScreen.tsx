import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import InstructorCard from "../../components/InstructorCard";
import { getInstructors } from "../../services/GlobalApi";
import { Instructor } from "../../interfaces";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessfulScreen({
  navigation,
  route,
}: RootStackScreenProps<"Successful">) {
  const [instructors, setInstructors] = useState<Instructor[]>([]); // Especifica el tipo de estado como Instructor[]

  const stylesHere = StyleSheet.create({
    tag: {
      backgroundColor: "#F6FD91",
      borderRadius: 30,
      borderColor: "black",
      borderWidth: 1,
      height: 30,
      width: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 0,
      marginRight: 3,
    },
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: "10%",
      paddingBottom: 40,
      width: "100%",
      height: "90%",
      justifyContent: "flex-start",
      backgroundColor: "#fff",
    },
    containerInside: {
      flex: 1,
      //   backgroundColor: "#3D4AF5",
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 0,
      padding:30
    },
    box: {
      backgroundColor: "#EDF3FF",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: 24,
      padding: 30,
      height: 125,
      width: 183,
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
      //color: "rgba(255, 255, 255, 0.8)",
    },
    boxContentBottomTwo: {
      textAlign: "left",
      fontSize: 15,
      //color: "white",
    },
    instructorImage: {
      marginLeft: 0,
      width: 300,
      height: 154,
      borderRadius: 10,
      borderColor: "black",
      borderWidth: 2,
      marginBottom: 16,
      marginTop: 16,
    },
    classHeading: {
      //marginLeft: 50,
      alignItems: "center",
    },
  });

  useEffect(() => {
    getInstructors()
      .then((response) => {
        const instructorsData = response.data.data;
        setInstructors(instructorsData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onSeeMorePress = () => navigation.popToTop();
  return (
    <View style={stylesHere.containerInside}>
      <View style={{ ...stylesHere.classHeading }}>
        <View style={{marginBottom:20}}>
           <Ionicons name={"checkmark-circle-outline"} size={60} color={"#F6FD91"} />

        </View>
          {/* <Image style={{width:150, height:150}} source={require('../../assets/images/woman-wheel.png')}/> */}
        {/* <Ionicons name={"bicycle-outline"} size={80} color={"#F6FD91"} /> */}

        <Text style={{ ...styles.titleText, color: "white" }}>
          Clase Reservada
        </Text>
        <Text style={{ fontSize: 17, color: "white" }}>
          Preparate para ride con Sofia
        </Text>
      </View>
      <View style={{alignItems:'flex-start', marginTop:30}}>
        <View style={{ ...styles.center, alignItems: "center", marginTop: 10 }}>
          <Ionicons name="calendar" color={"#F6FD91"} size={24} />
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            Wed, Feb 21
          </Text>
        </View>
        <View style={{ ...styles.center, alignItems: "center", marginTop: 10 }}>
          <Ionicons name="time" color={"#F6FD91"} size={24} />
          <Text style={{ ...styles.paragraph, color: "white", fontWeight: "400"  }}>
            9:00AM - 10:00AM
          </Text>
        </View>
        <View style={{ ...styles.center, alignItems: "center", marginTop: 10 }}>
          <Ionicons name="bicycle" color={"#F6FD91"} size={24} />
          <Text style={{ ...styles.paragraph, color: "white" , fontWeight: "400" }}>10</Text>
        </View>
        <View style={{ ...styles.center, alignItems: "center", marginTop: 10 }}>
          <Ionicons name="person" color={"#F6FD91"} size={24} />
          <Text style={{ ...styles.paragraph, color: "white", fontWeight: "400"  }}>
            Sofia Chang
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onSeeMorePress} style={{...styles.primaryButton, marginTop: 40, backgroundColor: '#282828'}}>
        <Text style={styles.primaryButtonText}>Ver más clases</Text>
      </TouchableOpacity>
     
    </View>
  );
}
