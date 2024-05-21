import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { updateBookingStatus, updateUserClases } from "../../services/GlobalApi";
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
  const room = bookingData?.attributes?.class?.data?.attributes?.room?.data?.attributes?.roomNumber;
  const bicycle = bookingData?.attributes?.bicycle?.data?.attributes?.bicycleNumber;
  const convertedFecha = convertDate(bookingData?.attributes?.fechaHora);
  const horaRedondeadaInicio = redondearHora(classData?.horaInicio);
  const horaRedondeadaFin = redondearHora(classData?.horaFin);

  const handleCancelRide = async () => {
    try {
      const userId = usuarioId;
      const token = await AsyncStorage.getItem("userToken");
  
      if (clasesDisponibles !== undefined && token) {
        // Incrementar el valor de clasesDisponibles
        const nuevasClasesDisponibles = clasesDisponibles + 1;
  
        // Hacer la solicitud PUT para actualizar clasesDisponibles
        const response = await updateUserClases(userId, nuevasClasesDisponibles, token);
  
        console.log("Clases disponibles actualizadas:", response.clasesDisponibles);
        // Puedes realizar acciones adicionales después de la actualización exitosa
  
        // Actualizar el estado del booking a "Refunded"
        await updateBookingStatus(bookingData.id, "refunded", token);
  
        // Navegar al HomeScreen después de cancelar el ride
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error al actualizar clases disponibles:", error);
      // Manejar el error de forma adecuada
    }
  };

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
      borderRadius: 30,
      padding: 24,
      marginTop: 0,
      paddingBottom: 40,
      width: "100%",
      height: "100%",
      justifyContent: "flex-start",
      backgroundColor: "#000",
    },
    containerInside: {
      flex: 1,
    //   backgroundColor: "#3D4AF5",
    backgroundColor:"#141414",
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

  const onBackPress = () => navigation.pop();
  return (
    <View style={stylesHere.containerInside}>
      <View style={{ ...styles.heading, marginLeft: 20, marginBottom: 10 }}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
      </View>
      <View style={stylesHere.classHeading}>
        <Text style={{...styles.subtitle, color:"white", marginBottom:4, fontWeight:"500"}}>{instructor.nombreCompleto}</Text>
        <Text style={{ ...styles.titleText, marginBottom: 6, color:"white" }}>
          {classData.nombreClase}
        </Text>
        <View style={styles.flex}>
          <View style={stylesHere.tag}>
            <Text style={styles.paragraph}>{instructor.estilo}</Text>
          </View>
 
        </View>
       
      </View>
      <View style={{...styles.center, alignItems: 'center', width:'100%', gap:0}}>
          <Image
          source={{
            uri: `${process.env.EXPO_PUBLIC_IMG_URL}${instructorImage}`,
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
              <Text style={stylesHere.boxContentBottomTwo}>{classData.diaDeLaSemana} - {convertedFecha}</Text>
            </View>
            <View style={stylesHere.box}>
              <View style={styles.spaceBet}>
                <Ionicons name="time" color={"#F6FD91"} size={28} />
              </View>
              <Text style={stylesHere.boxContentBottom}>Hora</Text>
              <Text style={stylesHere.boxContentBottomTwo}>{horaRedondeadaInicio} - {horaRedondeadaFin}</Text>
            </View>
          </View>
          <View style={{ ...styles.center, marginTop: 10 }}>
            <View style={stylesHere.box}>
              <View style={styles.spaceBet}>
                <Ionicons name="bicycle" color={"#F6FD91"} size={28} />
              </View>
              <Text style={stylesHere.boxContentBottom}>Tu Bici</Text>
              <Text style={stylesHere.boxContentBottomTwo}># {bicycle}</Text>
            </View>
            <View style={stylesHere.box}>
              <View style={styles.spaceBet}>
                <Ionicons name="person" color={"#F6FD91"} size={28} />
              </View>
              <Text style={stylesHere.boxContentBottom}>Instructor</Text>
              <Text style={stylesHere.boxContentBottomTwo}>{instructor.nombreCompleto}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ ...styles.primaryButton, backgroundColor: "#282828" }}
            onPress={handleCancelRide}
          >
            <Text style={{...styles.paragraph, color:'white'}}> Cancelar Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
