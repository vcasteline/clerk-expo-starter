import React, { useEffect, useState } from "react";
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
import { User } from "../../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../../services/AuthService";

export default function RideHistoryScreen({
  navigation,
  route,
}: RootStackScreenProps<"RideHistory">) {
  const [user, setUser] = useState<User>();

  const stylesHere = StyleSheet.create({
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 30,
      paddingBottom: 40,
      width: "100%",
      height: "75%",
      justifyContent: "flex-start", // Cambia "center" a "flex-start"
      backgroundColor: "#fff",
    },
  });
  const onBackPress = () => navigation.popToTop();

  const convertDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    // Verifica si la fecha es válida
    const parsedDate = Date.parse(date);
    if (!isNaN(parsedDate)) {
      // Si la fecha es válida, formatéala
      const formattedDate = new Date(date).toLocaleDateString("en-US", options);
      return formattedDate;
    } else {
      // Si la fecha es inválida, devuelve un mensaje de error o un valor por defecto
      return "Fecha inválida";
    }
  };

  function redondearHora(hora: string) {
    const [horas, minutos] = hora.split(":");
    const minutosRedondeados = Math.round(Number(minutos) / 5) * 5;
    const nuevaHora = `${horas}:${minutosRedondeados
      .toString()
      .padStart(2, "0")}`;
    return nuevaHora;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const userData = await getMe(token);
          setUser(userData);
          // console.log(userData.past_bookings[1].fechaHora);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
          Historial de Rides
        </Text>
      </View>

      <View style={styles.centerToLeft}>
        <Text style={styles.description}>
          Registro de tu historia en Volta.
        </Text>
      </View>
      <View style={stylesHere.dashboard}>
        <ScrollView>
          {user?.past_bookings?.map((past_booking) => {
            if (past_booking.class) {
              const horaInicio = past_booking.class?.horaInicio;
              const horaInicioRedondeada = horaInicio
                ? redondearHora(horaInicio)
                : "";
              const fechaFormateada = convertDate(
                past_booking?.fechaHora
              );

              return (
                <ClassCard
                  key={past_booking.id}
                  onPress={null}
                  image={null}
                  date={fechaFormateada}
                  className={past_booking.class?.nombreClase}
                  time={horaInicioRedondeada}
                  instructor={past_booking.class?.instructor?.nombreCompleto}
                  spots={null}
                  isPastClass={true}
                />
              );
            } else {
              // Manejar el caso cuando past_bbooking.class no existe
              const fechaFormateada = convertDate(
                past_booking?.attributes?.fechaHora
              );
              return (
                <ClassCard
                  key={past_booking.id}
                  onPress={null}
                  image={null}
                  date={fechaFormateada}
                  className="Clase no disponible"
                  time="Esta clase ya no existe"
                  instructor="probablemente fue eliminada"
                  spots={null}
                  isPastClass={true}
                />
              );
            }
          })}
        </ScrollView>
      </View>

      {/* fetch the instructors */}
    </View>
  );
}
