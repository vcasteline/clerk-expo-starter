import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { Bicycle, Booking } from "../../interfaces";
import { getBookings, getClassBicycles, getUserBookings, reserveBike, updateBookingStatus, updateUserClases } from "../../services/GlobalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../../services/AuthService";


export default function BikeSelectionScreen({
  navigation,
  route,
}: RootStackScreenProps<"BikeSelection">) {
  const { instructor, convertedDate, rawDate, time, timeFin, classId, dia } = route.params;
  const [selectedBike, setSelectedBike] = useState(null);
  const [bikeId, setBikeId] = useState(null);
  const [bicycles, setBicycles] = useState<Bicycle[]>([]);
  const [classBookings, setClassBookings] = useState<Booking[]>([]);


  useEffect(() => {
    getClassBicycles(classId)
      .then((response) => {
        const classBicycles = response.data.attributes.room.data.attributes.bicycles.data;
        setBicycles(classBicycles);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [classId]);

  useEffect(() => {
    getBookings()
      .then((response) => {
        const bookings = response.data.data;
        setClassBookings(bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [classId]);

  const handleBikeSelect = (bikeNum: any, bikeIdentification: any) => {
    setSelectedBike(bikeNum);
    setBikeId(bikeIdentification);
  };

  const renderBikeButton = (bike: Bicycle) => {
    const isSelected = selectedBike === bike.attributes.bicycleNumber;
    if (classBookings) {
      const isBikeBooked = classBookings.length > 0 && classBookings.some(
        (booking) =>
          booking.attributes.bicycle.data.attributes.bicycleNumber === bike.attributes.bicycleNumber &&
          booking.attributes.class.data.id === classId &&
          booking.attributes.bookingStatus === "completed"
      );
    
    const buttonStyle = [
      stylesHere.bikeButton,
      isSelected && stylesHere.selectedBikeButton,
      isBikeBooked && stylesHere.unavailableBikeButton,
    ];
  
    return (
      <TouchableOpacity
        key={bike.id}
        style={buttonStyle}
        onPress={() => !isBikeBooked && handleBikeSelect(bike.attributes.bicycleNumber, bike.id)}
        disabled={false}
      >
        <Text style={isSelected && stylesHere.selectedBikeButtonText}>
          {bike.attributes.bicycleNumber}
        </Text>
      </TouchableOpacity>
    );
  };

    // Si classBookings no está definido, renderizar el botón sin la verificación de isBikeBooked
  const buttonStyle = [
    stylesHere.bikeButton,
    isSelected && stylesHere.selectedBikeButton,
  ];
  
  return (
    <TouchableOpacity
      key={bike.id}
      style={buttonStyle}
      onPress={() => handleBikeSelect(bike.attributes.bicycleNumber, bike.id)}
    >
      <Text style={isSelected && stylesHere.selectedBikeButtonText}>
        {bike.attributes.bicycleNumber}
      </Text>
    </TouchableOpacity>
  );
}



  const onBackPress = () => navigation.popToTop();
  
  const onBikeReservePress = async (classBookings: any) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const userData = await getMe(token);
        const fechaHora = `${rawDate}${time}:00.000Z`;
  
        // Verificar si el usuario tiene clases disponibles
        if (userData.clasesDisponibles > 0) {
          // Verificar si la bicicleta seleccionada ya está reservada para la clase
          const isBikeBooked = classBookings.length > 0 && classBookings.some(
            (booking: any) =>
            booking.attributes.bicycle.data.attributes.bicycleNumber === selectedBike &&
            booking.attributes.class.data.id === classId &&
            booking.attributes.bookingStatus === "completed"
          );
  
          if (isBikeBooked) {
            console.log("La bicicleta seleccionada ya está reservada para esta clase");
            // Manejar el caso cuando la bicicleta ya está reservada
            return;
          }
  
          // Obtener todas las reservas del usuario
          const userBookings = await getUserBookings(token, userData.id);
  
          // Verificar si el usuario ya ha reservado la misma clase anteriormente
          const hasUserBookedClass = userBookings.length > 0 && userBookings.some(
            (booking) => 
            booking.attributes.class.data.id === classId &&
            booking.attributes.bookingStatus === 'completed'
          );
  
          if (hasUserBookedClass) {
            Alert.alert(
              "Ya tienes bici",
              "Ya has reservado esta clase anteriormente",
              [
                {
                  text: "Listo",
                  style: "default",
                },
              ]
            );
            // Manejar el caso cuando el usuario ya ha reservado la misma clase
            return;
          }
  
          // Realizar el POST request para reservar la bicicleta
          const bookingResponse = await reserveBike({
            class: classId,
            bicycle: bikeId,
            bookingStatus: "completed",
            user: userData.id,
            fechaHora: fechaHora,
          }, token);
  
          // Restar una clase disponible al usuario
          await updateUserClases(userData.id, userData.clasesDisponibles - 1, token);
  
          // Actualizar el estado del booking a "completed"
          await updateBookingStatus(bookingResponse.data.id, "completed", token);
  
          navigation.navigate('Successful', {
            instructor: instructor.name,
            date: convertedDate,
            startTime: time,
            endTime: timeFin,
            bicycleNumber: bikeId,
            dayOfWeek: dia
          });
        } else {
          console.log("No tienes clases disponibles");
          // Manejar el caso cuando el usuario no tiene clases disponibles
          navigation.navigate("BuyRides");
        }
      }
    } catch (error) {
      console.error("Error al reservar la bicicleta:", error);
      // Manejar el error de reserva
    }
  };
  // const onBikeReservePress = () => navigation.navigate("BuyRides");

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
      </View>
      <View style={{...styles.flex, flexDirection: "row",
    justifyContent: "flex-start", width:'100%', marginLeft:60, marginVertical:10}}>
      <Text style={{ ...styles.titleText, color: "white" }}>Selecciona tu Bici</Text>

      </View>

      <View style={styles.center}>
        <View style={stylesHere.box}>
          <View style={styles.spaceBet}>
            <Ionicons name="calendar" color={"#F6FD91"} size={28} />
          </View>
          <Text style={stylesHere.boxContentBottom}>Día y Hora</Text>
          <Text style={stylesHere.boxContentBottomTwo}>{convertedDate} - {time}</Text>
        </View>
        <View style={stylesHere.box}>
          <View style={styles.spaceBet}>
            <Ionicons name="person" color={"#F6FD91"} size={28} />
          </View>
          <Text style={stylesHere.boxContentBottom}>Instructor</Text>
          <Text style={stylesHere.boxContentBottomTwo}>{instructor.name}</Text>
        </View>
      </View>
      <View style={stylesHere.dashboard}>
        {/* <Text style={styles.subtitle}>Select Bike</Text> */}
        <View style={stylesHere.legendContainer}>
          <View style={stylesHere.legendItem}>
            <View style={[stylesHere.colorBox, stylesHere.selectedColor]} />
            <Text style={stylesHere.legendText}>Tu selección</Text>
          </View>
          <View style={stylesHere.legendItem}>
            <View style={[stylesHere.colorBox, stylesHere.availableColor]} />
            <Text style={stylesHere.legendText}>Disponible</Text>
          </View>
          <View style={stylesHere.legendItem}>
            <View style={[stylesHere.colorBox, stylesHere.unavailableColor]} />
            <Text style={stylesHere.legendText}>Ocupada</Text>
          </View>
        </View>
        <View style={stylesHere.bikeGrid}>
          {bicycles.map(renderBikeButton)}
        </View>
        <Image
          source={{ uri: instructor.image }}
          style={stylesHere.instructorImage}
        />
        <Text style={stylesHere.instructorName}>{instructor.name}</Text>
        <View style={stylesHere.bottomContainer}>
          <Ionicons name="bicycle" color={"black"} size={28} />
          <Text style={stylesHere.bikeNumber}>
            {selectedBike || "# Bici"}
          </Text>
          <TouchableOpacity
            style={selectedBike ? stylesHere.reserveButton : stylesHere.reserveButtonDisabled}
            onPress={onBikeReservePress}
            disabled={!selectedBike}
          >
            <Text style={stylesHere.reserveButtonText}>Reservar Bici</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  box: {
    backgroundColor: "#141414",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 24,
    padding: 30,
    height: 135,
    width: 175,
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
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginTop: -5,
    marginLeft: 3,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  bikeNumber: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  dashboard: {
    borderRadius: 30,
    padding: 24,
    marginTop: 20,
    paddingBottom: 40,
    width: "100%",
    height: 630,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  selectedBikeButton: {
    backgroundColor: "#3D4AF5",
    color: "white",
  },
  bikeButton: {
    width: 35,
    height: 45,
    borderRadius: 8,
    backgroundColor: "#CDDDFC",
    justifyContent: "center",
    alignItems: "center",
    margin: 7,
  },
  unavailableBikeButton: {
    backgroundColor: "#D8D8D8",
  },
  bikeButtonText: {
    fontSize: 18,
  },
  selectedBikeButtonText: {
    fontSize: 18,
    color: "white"
  },
  instructorImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  instructorName: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 10,
  },
  reserveButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: "70%",
    alignSelf: "center",
  },
  reserveButtonDisabled: {
    backgroundColor: "#CDCDCD",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: "60%",
    alignSelf: "center",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    //fontWeight: "bold",
  },
  legendContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedColor: {
    backgroundColor: "#3D4AF5",
  },
  availableColor: {
    backgroundColor: "#CDDDFC",
  },
  unavailableColor: {
    backgroundColor: "#D8D8D8",
  },
  legendText: {
    fontSize: 14,
  },
});
