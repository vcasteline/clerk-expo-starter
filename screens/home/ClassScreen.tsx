import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import {
  devolverCreditoClase,
  updateBookingStatus,
} from "../../services/GlobalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClassScreen({
  navigation,
  route,
}: RootStackScreenProps<"Class">) {
  const { bookingData, userData } = route.params;

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
  const usuarioId = userData?.id;
  const clasesDisponibles = userData?.clasesDisponibles;
  const classData = bookingData?.attributes?.class?.data?.attributes;
  const instructor = classData?.instructor?.data?.attributes;
  const instructorImage = instructor?.fotoPerfil?.data?.attributes?.url;
  const room =
    bookingData?.attributes?.class?.data?.attributes?.room?.data?.attributes
      ?.roomNumber;
  const bicycle =
    bookingData?.attributes?.bicycle?.data?.attributes?.bicycleNumber;
  const convertedFecha = convertDate(bookingData?.attributes?.fechaHora);
  const horaRedondeadaInicio = redondearHora(classData?.horaInicio);
  const horaRedondeadaFin = redondearHora(classData?.horaFin);

  const handleCancelRide = async () => {
    try {
      const userId = usuarioId;
      const token = await AsyncStorage.getItem("userToken");
      const bookingId = bookingData.id;

      if (!userId || !token) {
        throw new Error("No se pudo obtener la información del usuario");
      }

      const result: any = await devolverCreditoClase(
        userId,
        token,
        async () => {
          // Esta función se ejecutará si el usuario decide cancelar sin reembolso
          await updateBookingStatus(bookingId, "cancelled", token);
          // Aquí puedes agregar cualquier otra lógica necesaria para la cancelación sin reembolso
        }
      );

      if (result?.success) {
        // La cancelación fue exitosa y se devolvió el crédito
        await updateBookingStatus(bookingId, "cancelled", token);
        Alert.alert(
          "Éxito",
          "La reserva ha sido cancelada y el crédito ha sido devuelto."
        );
      } else if (result?.message === "Cancelado sin devolución de crédito") {
        // El usuario decidió cancelar sin reembolso
        Alert.alert(
          "Cancelación completada",
          "La reserva ha sido cancelada sin devolución de crédito."
        );
        // navigation.navigate("HomeStack");
      } else {
        // El usuario decidió no cancelar
        Alert.alert(
          "Cancelación abortada",
          "No se ha realizado ningún cambio en tu reserva."
        );
      }

      // Actualizar la interfaz de usuario o navegar a otra pantalla si es necesario
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      Alert.alert(
        "Error",
        "No se pudo cancelar la reserva. Por favor, inténtalo de nuevo."
      );
    }
  };

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
      marginTop: 5,
      marginRight: 3,
    },
    boxBig: {
      backgroundColor: "#282828",
      padding: 20,
      borderRadius: 30,
      marginTop: 20,
    },
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 10,
      paddingBottom: 40,
      width: "100%",
      height: "100%",
      justifyContent: "flex-start",
      backgroundColor: "#000",
    },
    containerInside: {
      flex: 1,
      //   backgroundColor: "#3D4AF5",
      backgroundColor: "#141414",
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
      borderColor: "black",
      borderWidth: 2,
      marginBottom: 16,
      marginTop: 16,
    },
    classHeading: {
      marginLeft: 50,
    },
  });

  const onBackPress = () => navigation.pop();
  return (
    <View style={stylesHere.containerInside}>
      <View style={{ ...styles.heading, marginLeft: 20, marginBottom: 0 }}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          alignItems: "center",
          width: "100%",
          paddingRight: 0,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            ...styles.subtitle,
            color: "white",
            marginBottom: 4,
            fontWeight: "500",
          }}
        >
          {instructor.nombreCompleto}
        </Text>
        <Text style={{ ...styles.titleText, marginBottom: 6, color: "white" }}>
          {classData.nombreClase}
        </Text>
        <View style={styles.flex}>
          <View style={stylesHere.tag}>
            <Text style={styles.paragraph}>{instructor.estilo}</Text>
          </View>
        </View>
      </View>
      <View style={stylesHere.dashboard}>
        <View>
          <View style={{ alignItems: "center", marginTop: 0, width: "100%" }}>
            <View
              style={{
                ...styles.spaceBet,
                alignItems: "center",
                marginTop: 0,
                width: "100%",
              }}
            >
              <Text
                style={{
                  ...styles.paragraph,
                  color: "white",
                  fontWeight: "400",
                }}
              >
                Día
              </Text>
              <Text
                style={{
                  ...styles.paragraph,
                  color: "white",
                  fontWeight: "400",
                }}
              >
                {classData.diaDeLaSemana} - {convertedFecha}
              </Text>
            </View>
            <View
              style={{
                ...styles.spaceBet,
                alignItems: "center",
                marginTop: 0,
                width: "100%",
              }}
            >
              <Text
                style={{
                  ...styles.paragraph,
                  color: "white",
                  fontWeight: "400",
                }}
              >
                Hora
              </Text>
              <Text
                style={{
                  ...styles.paragraph,
                  color: "white",
                  fontWeight: "400",
                }}
              >
                {horaRedondeadaInicio} - {horaRedondeadaFin}
              </Text>
            </View>
            <View
              style={{
                ...styles.spaceBet,
                alignItems: "center",
                marginTop: 0,
                width: "100%",
              }}
            >
              <Text
                style={{
                  ...styles.paragraph,
                  color: "white",
                  fontWeight: "400",
                }}
              >
                Tu bici
              </Text>
              <Text
                style={{
                  ...styles.paragraph,
                  color: "white",
                  fontWeight: "400",
                }}
              >
                {bicycle}
              </Text>
            </View>
          </View>
          <View style={stylesHere.boxBig}>
            <View
              style={{
                alignItems: "center",
                marginTop: 0,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginBottom: 10,
                  paddingHorizontal: 20,
                }}
              >
                Recuerda que puedes cancelar tu clase hasta 12 horas antes de la
                clase reservada. Caso contrario perderás el crédito de ese
                booking. {"\n"}{"\n"} Por respeto a nuestros coaches y a nuestros riders
                pedimos puntualidad ya que no podemos interrumpir la sesión en
                curso. Ten presente que <Text style={{fontWeight: "bold"}}>tu bici será liberada 4 minutos antes de
                que inicie la clase.</Text> {"\n"}{"\n"}Para que todos disfrutemos de la sesión no
                se permite el uso de teléfonos celulares dentro del estudio. {"\n"}{"\n"}Por
                seguridad, los créditos no son transferibles.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              ...styles.primaryButton,
              backgroundColor: "#282828",
              marginTop: 10,
            }}
            onPress={handleCancelRide}
          >
            <Text style={{ ...styles.paragraph, color: "white" }}>
              {" "}
              Cancelar Ride
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
