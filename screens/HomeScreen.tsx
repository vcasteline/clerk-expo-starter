import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../types";
import { styles } from "../components/Styles";
import ClassCard from "../components/ClassCard";
import InstructorCard from "../components/InstructorCard";
import { log } from "../logger";
import { getClasses, getInstructors, getUsers } from "../services/GlobalApi";
import { Ionicons } from "@expo/vector-icons";
import { Instructor, User } from "../interfaces";


export default function HomeScreen({
  navigation,
  route,
}: RootStackScreenProps<"Home">) {
  const { signIn, setSession, isLoaded } = useSignIn();
  const { getToken, signOut } = useAuth();
  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err: any) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  const onClassPress = () => navigation.push("Class");
  const onSchedulePress = () => navigation.replace("Schedule");
  const onInstructorPress = (instructor: Instructor) => {
navigation.navigate<'Instructor'>('Instructor', { instructorData: instructor });};  
  const [instructors, setInstructors] = useState<Instructor[]>([]); 
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getInstructors()
      .then((response) => {
        const instructorsData = response.data.data;
        setInstructors(instructorsData);
      })
      .catch((error) => {
        console.error(error);
      });

      getUsers()
      .then((response) => {
        const usersData = response.data;
        setUsers(usersData);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

  users.map((user) => {
    console.log(user.bookings);
    console.log(user.clasesDisponibles);
  });


  const stylesHere = StyleSheet.create({
    container: {
      padding: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    rides: {
      // flex: 1,
      marginBottom: 10,
    },
    ridesSection: {
      marginBottom: 0,
    },
    instructors: {
      // flex: 3,
    },
    logoImage: {
      width: 90,
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
      marginBottom: 6,
    },
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 28,
      paddingBottom: 40,
      width: "100%",
      height: 600,
      justifyContent: "flex-start",
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
      fontSize: 30,
      marginTop: 0,
      marginBottom: 7,
      fontWeight: "800",
    },
    boxContentBottom: {
      textAlign: "center",
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
    containerInside: {
      flex: 1,
      backgroundColor: "#000000",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 70,
    },
    iconBg: {
      backgroundColor: "#3D4AF5",
      borderRadius: 50,
      padding: 10,
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
  return (
    <View style={stylesHere.containerInside}>
      <View style={stylesHere.heading}>
        <Image
          style={stylesHere.logoImage}
          source={require("../assets/images/volta-logo-white.png")}
        />
      </View>
      <View style={styles.center}>
        <View style={styles.box}>
          <View style={styles.spaceBet}>
            <Text style={stylesHere.boxTitle}>Rides Lifetime</Text>
            {/* <View style={stylesHere.iconBg}>
              <Ionicons name="flame" color={"white"} size={15} />
            </View> */}
            <Image
              style={stylesHere.iconImage}
              source={require("../assets/images/fire-icon.png")}
            />
          </View>

          <Text style={stylesHere.boxContent}>17</Text>
          <Text style={stylesHere.boxContentBottom}>
            Rides Completados
          </Text>
        </View>
        <View style={styles.box}>
          <View style={styles.spaceBet}>
            <Text style={stylesHere.boxTitle}>Tus Clases</Text>
            <Image
              style={stylesHere.iconImage}
              source={require("../assets/images/wheel-icon.png")}
            />
          </View>

          <Text style={stylesHere.boxContent}>12</Text>
          <Text style={stylesHere.boxContentBottom}>Disponibles</Text>
        </View>
      </View>

      <View style={stylesHere.dashboard}>
        <View style={stylesHere.rides}>
          <View style={styles.spaceBet}>
            <Text style={styles.titleText}>Proximos Rides</Text>
            <TouchableWithoutFeedback onPress={onSchedulePress}>
              <Text style={styles.titleText}>&#8594;</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={stylesHere.ridesSection}>
            <View>
              <Text
                style={{
                  ...styles.subtitle,
                  textAlign: "center",
                  marginTop: 40,
                  marginBottom: 10,
                  color: "#3D4AF5",
                  fontWeight:'400'
                }}
              >
                No has reservado ningun ride, has click en el horario para ver clases disponibles.
              </Text>
              <Ionicons
                style={{ textAlign: "center", marginBottom: 40 }}
                name="sad-outline"
                color={"#3D4AF5"}
                size={25}
              />
            </View>

            <ClassCard
              onPress={onClassPress}
              image={null}
              date="Feb 20"
              className="Rider Rythm"
              time="20:30"
              instructor="Sofis Chang"
              spots={20}
            />
            {/* <ClassCard
              onPress={onClassPress}
              image={null}
              date="Feb 20"
              className="Rider Rythm"
              time="20:30"
              instructor="Sofis Chang"
              spots={20}
            />
            <ClassCard
              onPress={onClassPress}
              image={null}
              date="Feb 20"
              className="Rider Rythm"
              time="20:30"
              instructor="Sofis Chang"
              spots={20}
            /> */}
          </View>
        </View>
        <View style={stylesHere.instructors}>
          <View style={styles.spaceBet}>
            <Text style={styles.titleText}>Instructores</Text>
            <TouchableWithoutFeedback>
              <Text style={styles.titleText}>&#8594;</Text>
            </TouchableWithoutFeedback>
          </View>
          <ScrollView horizontal={true}>
          {instructors.map((instructor) => {
            return (
              <InstructorCard
                key={instructor.id}
                onPress={() => onInstructorPress(instructor)}
                name={instructor.attributes.nombreCompleto}
                category={instructor.attributes.estilo}
                image={{
                  uri:
                    process.env.EXPO_PUBLIC_IMG_URL +
                    instructor.attributes.fotoPerfil.data.attributes.url,
                }}
              />
            );
          })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
