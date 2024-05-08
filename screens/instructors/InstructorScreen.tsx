import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../components/Styles";
import { RootStackScreenProps } from "../../types";
import CalendarStrip from "react-native-calendar-strip";
import { getClassesScheduleScreen } from "../../services/GlobalApi";
import ClassCard from "../../components/ClassCard";

interface Class {
  id: number;
  attributes: {
    nombreClase: string;
    horaInicio: string;
    horaFin: string;
    diaDeLaSemana:
      | "Lunes"
      | "Martes"
      | "Miércoles"
      | "Jueves"
      | "Viernes"
      | "Sábado"
      | "Domingo";
    instructor: {
      data: Instructor;
    };
  };
}

interface Instructor {
  id: number;
  attributes: {
    nombreCompleto: string;
    fotoPerfil: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

export default function InstructorScreen({
  navigation,
  route,
}: RootStackScreenProps<"Instructor">) {
  const { instructorData } = route.params;
  const onClassPress = () => navigation.push("BikeSelection");

  const onBackPress = () => navigation.popToTop();

  useEffect(() => {
    getClassesScheduleScreen()
      .then((response: { data: { data: any } }) => {
        const allClasses = response.data.data;
        setClasses(allClasses);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

  const getDayOfWeek = (dateString: string): string => {
    const daysOfWeek = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  };

  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  const getFilteredClasses = (date: any, instructorName: string) => {
    const diaSelecionado = getDayOfWeek(date);
    const filtered = classes.filter(
      (clase: Class) =>
        clase.attributes.diaDeLaSemana === diaSelecionado &&
        clase.attributes.instructor.data.attributes.nombreCompleto ===
          instructorName
    );
    setFilteredClasses(filtered);
  };

  function redondearHora(hora: string) {
    const [horas, minutos] = hora.split(":");
    const minutosRedondeados = Math.round(Number(minutos) / 5) * 5;
    return `${horas}:${minutosRedondeados.toString().padStart(2, "0")}`;
  }

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
        <Text style={{ ...styles.titleText, color: "white" }}>
          {instructorData.attributes.nombreCompleto.substring(
            0,
            instructorData.attributes.nombreCompleto.indexOf(" ")
          )}
          's Profile
        </Text>
      </View>
      <View style={stylesHere.dashboard}>
        <View style={stylesHere.containerHere}>
          <View style={stylesHere.instructorInfo}>
            <Image
              source={{
                uri:
                  process.env.EXPO_PUBLIC_IMG_URL +
                  instructorData.attributes.fotoPerfil.data.attributes.url,
              }}
              style={stylesHere.instructorImage}
            />
            <View style={stylesHere.instructorDetails}>
              <Text style={stylesHere.instructorName}>
                {instructorData.attributes.nombreCompleto}
              </Text>
              <Text style={stylesHere.instructorSpecialty}>
                {instructorData.attributes.estilo}
              </Text>
              <View style={stylesHere.ratingContainer}>
                {/* <Text style={stylesHere.ratingText}>5+ years</Text> */}
                {/* <Text style={stylesHere.ratingText}>4.8 ★</Text> */}
              </View>
            </View>
          </View>

          <Text style={stylesHere.sectionTitle}>About Instructor</Text>
          <Text style={stylesHere.description}>
            {instructorData.attributes.bio}
          </Text>

          <Text style={stylesHere.sectionTitle}>Upcoming Classes</Text>
          <View style={{ width: "100%", marginTop: 8 }}>
            <CalendarStrip
              numDaysInWeek={7}
              style={{ height: 100, paddingTop: 6, paddingBottom: 0 }}
              daySelectionAnimation={{
                type: "background",
                duration: 200,
                highlightColor: "#F6FD91",
              }}
              onDateSelected={(date) =>
                getFilteredClasses(
                  date,
                  instructorData.attributes.nombreCompleto
                )
              }
              highlightDateNumberStyle={{ color: "black" }}
              highlightDateNameStyle={{ color: "black" }}
              calendarHeaderStyle={{
                color: "black",
                alignItems: "flex-start",
                textAlign: "left",
              }}
              calendarHeaderContainerStyle={{ display: "flex", width: "100%" }}
              dateNumberStyle={{ color: "black" }}
              dateNameStyle={{ color: "black" }}
            />
            <ScrollView>
              {filteredClasses.length == 0 ? (
                <Text>No classes this day</Text>
              ) : (
                filteredClasses.map((classItem) => {
                  // console.log(classItem.attributes);

                  return (
                    <ClassCard
                      key={classItem.id}
                      onPress={onClassPress}
                      image={{
                        uri:
                          process.env.EXPO_PUBLIC_IMG_URL +
                          classItem.attributes.instructor.data.attributes
                            .fotoPerfil.data.attributes.url,
                      }}
                      date={null}
                      className={classItem.attributes.nombreClase}
                      time={redondearHora(classItem.attributes.horaInicio)}
                      instructor={
                        classItem.attributes.instructor.data.attributes
                          .nombreCompleto
                      }
                      spots={null}
                    />
                  );
                })
              )}
            </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
  },
  instructorSpecialty: {
    fontSize: 16,
    color: "gray",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
