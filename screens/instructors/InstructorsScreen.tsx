import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import InstructorCard from "../../components/InstructorCard";
import { getInstructors } from "../../services/GlobalApi";
import { Instructor } from "../../interfaces";
import SpinningLogo from "../../components/SpinningLogo";

export default function InstructorsScreen({
  navigation,
  route,
}: RootStackScreenProps<"Instructors">) {
  const { signIn, setSession, isLoaded } = useSignIn();
  const [instructors, setInstructors] = useState<Instructor[]>([]); // Especifica el tipo de estado como Instructor[]
  const [loading, setLoading] = useState(true);

  const stylesHere = StyleSheet.create({
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 30,
      paddingBottom: 40,
      width: "100%",
      height: "100%",
      justifyContent: "flex-start",
      backgroundColor: "#fff",
    },
  });

  useEffect(() => {
    getInstructors()
      .then((response) => {
        const instructorsData = response.data.data;
        setInstructors(instructorsData);
      })
      .finally(() => {
        setLoading(false);
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

  return loading ? (
    <View style={styles.loadingScreen}>
      <SpinningLogo />
    </View>
  ) : (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <Text style={{ ...styles.titleText, color: "white" }}>
          Instructores
        </Text>
      </View>
      <View style={styles.centerToLeft}>
        <Text style={styles.description}>
          Conoce a tus instructores. A dar la Volta!
        </Text>
      </View>
      <View style={stylesHere.dashboard}>
        <ScrollView>
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
  );
}
