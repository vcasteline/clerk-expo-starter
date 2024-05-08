import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import InstructorCard from "../../components/InstructorCard";
import { getInstructors } from "../../services/GlobalApi";

// Define la interfaz para el objeto de instructor
interface Instructor {
  id: number;
  attributes: {
    nombreCompleto: string;
    estilo: string;
    fotoPerfil: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export default function InstructorsScreen({
  navigation,
  route,
}: RootStackScreenProps<"Instructors">) {
  const { signIn, setSession, isLoaded } = useSignIn();
  const [instructors, setInstructors] = useState<Instructor[]>([]); // Especifica el tipo de estado como Instructor[]

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

  const onInstructorPress = () => navigation.push("Instructor");

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <Text style={{ ...styles.titleText, color: "white" }}>Instructors</Text>
      </View>
      <View style={stylesHere.dashboard}>
        <ScrollView>
          {instructors.map((instructor) => {
            return (
              <InstructorCard
                key={instructor.id}
                onPress={onInstructorPress}
                name={instructor.attributes.nombreCompleto}
                category={instructor.attributes.estilo}
                image={{
                  uri: process.env.EXPO_PUBLIC_IMG_URL + instructor.attributes.fotoPerfil.data.attributes.url
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
