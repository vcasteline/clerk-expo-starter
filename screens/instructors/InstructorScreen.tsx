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
import { Class } from "../../interfaces";

export default function InstructorScreen({
  navigation,
  route,
}: RootStackScreenProps<"Instructor">) {
  const { instructorData } = route.params;
  // const onClassPress = () => navigation.navigate("BikeSelection");

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

  const [convertedDate, setConvertedDate] = useState("");
  const [rawDate, setRawDate] = useState(Object);
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  const convertDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    setConvertedDate(formattedDate);
  };

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

  const getFilteredClassesAndDate = (date: any) => {
    getFilteredClasses(date, instructorData.attributes.nombreCompleto);
    convertDate(date);
    setRawDate(date);
  };

  function redondearHoraHelp(hora: string) {
    const [horas, minutos, segundos, milisegundos] = hora.split(":");
    const minutosRedondeados = Math.round(Number(minutos) / 5) * 5;
    return {
      horas: Number(horas),
      minutos: minutosRedondeados,
    };
  }
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
            </View>
          </View>

          <Text style={stylesHere.sectionTitle}>Acerca del Instructor</Text>
          <Text style={stylesHere.description}>
            {instructorData.attributes.bio}
          </Text>

          <Text style={stylesHere.sectionTitle}>Próximas Classes</Text>
          <View style={{ width: "100%", marginTop: 8 }}>
            <CalendarStrip
              leftSelector={[]}
              rightSelector={[]}
              numDaysInWeek={7}
              style={{ height: 100, paddingTop: 6, paddingBottom: 0 }}
              daySelectionAnimation={{
                type: "background",
                duration: 200,
                highlightColor: "#F6FD91",
              }}
              onDateSelected={(date) => getFilteredClassesAndDate(date)}
              highlightDateNumberStyle={{ color: "black" }}
              highlightDateNameStyle={{ color: "black" }}
              calendarHeaderStyle={{
                color: "black",
                alignItems: "flex-start",
                fontSize: 16,
              }}
              dateNumberStyle={{ color: "black" }}
              dateNameStyle={{ color: "black" }}
            />
            <ScrollView>
              {filteredClasses.length == 0 ? (
                <View>
                  <Text
                    style={{
                      ...styles.paragraph,
                      fontWeight: "normal",
                      textAlign: "center",
                      color: "#3D4AF5",
                      marginTop: 40,
                    }}
                  >
                    {`No hay clases de ${instructorData.attributes.nombreCompleto.substring(
                      0,
                      instructorData.attributes.nombreCompleto.indexOf(" ")
                    )} en este día`}
                  </Text>
                  <Ionicons
                    style={{ textAlign: "center", marginTop: 10 }}
                    name="sad-outline"
                    color={"#3D4AF5"}
                    size={20}
                  />
                </View>
              ) : (
                filteredClasses.map((classItem) => {
                  const classDate = new Date(rawDate);
                  const { horas, minutos } = redondearHoraHelp(
                    classItem.attributes.horaInicio
                  );

                  classDate.setHours(horas, minutos, 0, 0);

                  const currentDate = new Date();

                  const isPastClass = classDate < currentDate;
                  return (
                    <ClassCard
                      key={classItem.id}
                      onPress={() =>
                        navigation.navigate("BikeSelection", {
                          instructor: {
                            name: classItem.attributes.instructor.data
                              .attributes.nombreCompleto,
                            image:
                              process.env.EXPO_PUBLIC_IMG_URL +
                              classItem.attributes.instructor.data.attributes
                                .fotoPerfil.data.attributes.url,
                          },
                          convertedDate: convertedDate ? convertedDate : null,
                          rawDate: rawDate.toISOString().slice(0, 11),
                          time: redondearHora(classItem.attributes.horaInicio),
                          timeFin: redondearHora(classItem.attributes.horaFin),
                          classId: classItem.id,
                          className: classItem.attributes.nombreClase,
                          dia: classItem.attributes.diaDeLaSemana,
                        })
                      }
                      date={convertedDate}
                      className={classItem.attributes.nombreClase}
                      time={redondearHora(classItem.attributes.horaInicio)}
                      instructor={
                        classItem.attributes.instructor.data.attributes
                          .nombreCompleto
                      }
                      spots={null}
                      image={undefined}
                      isPastClass={isPastClass}
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
    marginTop: 20,
    paddingBottom: 40,
    width: "100%",
    height: "100%",
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
