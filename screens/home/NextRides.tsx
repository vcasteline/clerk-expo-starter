import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import ClassCard from "../../components/ClassCard";
import { Ionicons } from "@expo/vector-icons";
import { Booking } from "../../interfaces";

export default function NextRidesScreen({
  navigation,
  route,
}: RootStackScreenProps<"NextRides">) {
    const { user, bookings} = route.params;
  const stylesHere = StyleSheet.create({
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 30,
      paddingBottom: 40,
      width: "100%",
      height: 630,
      justifyContent: "flex-start", // Cambia "center" a "flex-start"
      backgroundColor: "#fff",
    },
  });
  const instructorImage = require("../../assets/images/instructor-1.jpg");
  const onBackPress = () => navigation.pop();
  const convertDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate;
  };
  function redondearHora(hora: string) {
    const [horas, minutos] = hora.split(":");
    const minutosRedondeados = Math.round(Number(minutos) / 5) * 5;
    const nuevaHora = `${horas}:${minutosRedondeados
      .toString()
      .padStart(2, "0")}`;
    return nuevaHora;
  }
  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          ...styles.flex,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          marginLeft: 60,
          marginTop: 10,
        }}
      >
        <Text style={{ ...styles.titleText, color: "white" }}>
          Próximos Rides
        </Text>
      </View>

      <View style={styles.centerToLeft}>
        <Text style={styles.description}>
          Los rides para los que estas registrado.
        </Text>
      </View>
      <View style={stylesHere.dashboard}>
        <ScrollView>
        {bookings.filter(
                    (booking: Booking) =>
                      booking.attributes.bookingStatus === "completed"
                  ).length === 0 ? (
                <View>
                  <Text
                    style={{
                      ...styles.subtitle,
                      textAlign: "center",
                      marginTop: 40,
                      marginBottom: 10,
                      color: "#3D4AF5",
                      fontWeight: "400",
                    }}
                  >
                    No has reservado ningún ride, haz click en el horario para
                    ver clases disponibles.
                  </Text>
                  <Ionicons
                    style={{ textAlign: "center", marginBottom: 40 }}
                    name="sad-outline"
                    color={"#3D4AF5"}
                    size={25}
                  />
                </View>
              ) : (
                bookings
                  .sort(
                    (a, b) =>
                      new Date(a.attributes.fechaHora).getTime() -
                      new Date(b.attributes.fechaHora).getTime()
                  )
                  .filter(
                    (booking: Booking) =>
                      booking.attributes.bookingStatus === "completed"
                  )
                  .map((booking: Booking) => {
                    const usuarioId = user?.id;
                    const clasesDisponibles = user?.clasesDisponibles;
                    const classData =
                      booking?.attributes?.class?.data?.attributes;
                    const instructor = classData?.instructor?.data?.attributes;
                    const instructorImage =
                      instructor?.fotoPerfil?.data?.attributes?.url;
                    const room =
                      booking?.attributes?.class?.data?.attributes?.room?.data
                        ?.attributes?.roomNumber;
                    const bicycle =
                      booking?.attributes?.bicycle?.data?.attributes
                        ?.bicycleNumber;
                    const convertedFecha = convertDate(
                      booking?.attributes?.fechaHora
                    );
                    const horaRedondeadaInicio = redondearHora(
                      classData?.horaInicio
                    );
                    const horaRedondeadaFin = redondearHora(classData?.horaFin);
                    return (
                      <ClassCard
                        key={booking.id}
                        onPress={() =>
                          navigation.navigate("Class", {
                            bookingData: booking,
                            userData: user,
                          })
                        }
                        image={null}
                        date={convertedFecha}
                        className={classData?.nombreClase || ""}
                        time={`${horaRedondeadaInicio} - ${horaRedondeadaFin}`}
                        instructor={instructor?.nombreCompleto || ""}
                        spots={null}
                        isPastClass={false}
                      />
                    );
                  })
              )}
        </ScrollView>
      </View>

      {/* fetch the instructors */}
    </View>
  );
}
