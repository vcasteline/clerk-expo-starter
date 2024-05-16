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

export default function ClassScreen({
  navigation,
  route,
}: RootStackScreenProps<"Class">) {
  const [instructors, setInstructors] = useState<Instructor[]>([]); // Especifica el tipo de estado como Instructor[]

  const stylesHere = StyleSheet.create({
    tag: {
      backgroundColor: "#F6FD91",
      borderRadius: 30,
      borderColor:'black',
      borderWidth:1,
      height: 30,
      width: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 0,
      marginRight:3,
    },
    dashboard: {
      //borderRadius: 30,
      padding: 24,
      marginTop: 0,
      paddingBottom: 40,
      width: "100%",
      height: 440,
      justifyContent: "flex-start",
      backgroundColor: "#000",
    },
    containerInside: {
      flex: 1,
    //   backgroundColor: "#3D4AF5",
    backgroundColor:"white",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      paddingTop: 75,
    },
    box: {
      backgroundColor: "#141414",
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
      color: "rgba(255, 255, 255, 0.8)",
    },
    boxContentBottomTwo: {
      textAlign: "left",
      fontSize: 15,
      color: "white",
    },
    instructorImage: {
      marginLeft: 0,
      width: 300,
      height: 154,
      borderRadius: 10,
      borderColor:'black',
      borderWidth:2,
      marginBottom: 16,
      marginTop: 16,
    },
    classHeading: {
      marginLeft: 50,
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

  const onInstructorPress = (instructor: Instructor) => {
    navigation.navigate<"Instructor">("Instructor", {
      instructorData: instructor,
    });
  };
  const onBackPress = () => navigation.popToTop();
  return (
    <View style={stylesHere.containerInside}>
      <View style={{ ...styles.heading, marginLeft: 20, marginBottom: 10 }}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"black"} />
        </TouchableWithoutFeedback>
        {/* <Text style={{ ...styles.titleText }}>Clase</Text> */}
      </View>
      <View style={stylesHere.classHeading}>
        <Text style={{...styles.subtitle, color:"black", marginBottom:4, fontWeight:"500"}}>Sofia Chang</Text>
        <Text style={{ ...styles.titleText, marginBottom: 6, color:"black" }}>
          Rider Rythm
        </Text>
        <View style={styles.flex}>
          <View style={stylesHere.tag}>
            <Text style={styles.paragraph}>Flamenco</Text>
          </View>
          <View style={stylesHere.tag}>
            <Text style={styles.paragraph}>Fast Paced</Text>
          </View>
        </View>
       
      </View>
      <View style={{...styles.center, alignItems: 'center', width:'100%', gap:0}}>
          <Image
            source={{
              uri: "https://utfs.io/f/bf77a67e-af87-47f1-92c3-c129615e27c0-4nhplr.jpg",
            }}
            style={{...stylesHere.instructorImage, marginLeft:0}}
          />
          {/* <Text style={{fontSize:17, ...styles.half, marginLeft:10}}>All Set! Listo para ride con Sofia.</Text> */}
        </View>
      <View style={stylesHere.dashboard}>
        <View>
          <View style={styles.center}>
            <View style={stylesHere.box}>
              <View style={styles.spaceBet}>
                <Ionicons name="calendar" color={"#F6FD91"} size={28} />
              </View>
              <Text style={stylesHere.boxContentBottom}>Fecha</Text>
              <Text style={stylesHere.boxContentBottomTwo}>WED, FEB 21</Text>
            </View>
            <View style={stylesHere.box}>
              <View style={styles.spaceBet}>
                <Ionicons name="time" color={"#F6FD91"} size={28} />
              </View>
              <Text style={stylesHere.boxContentBottom}>Hora</Text>
              <Text style={stylesHere.boxContentBottomTwo}>9:00AM-10:00AM</Text>
            </View>
          </View>
          <View style={{ ...styles.center, marginTop: 10 }}>
            <View style={stylesHere.box}>
              <View style={styles.spaceBet}>
                <Ionicons name="bicycle" color={"#F6FD91"} size={28} />
              </View>
              <Text style={stylesHere.boxContentBottom}>Tu Bici</Text>
              <Text style={stylesHere.boxContentBottomTwo}># 10</Text>
            </View>
            <View style={stylesHere.box}>
              <View style={styles.spaceBet}>
                <Ionicons name="person" color={"#F6FD91"} size={28} />
              </View>
              <Text style={stylesHere.boxContentBottom}>Instructor</Text>
              <Text style={stylesHere.boxContentBottomTwo}>Sofia Chang</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ ...styles.primaryButton, backgroundColor: "#282828" }}
          >
            <Text style={{...styles.paragraph, color:'white'}}> Cancelar Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
