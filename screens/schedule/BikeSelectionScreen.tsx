import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import {
  Bicycle,
  Booking,
  BookingData,
  Guest,
  SuccessfulScreenParams,
} from "../../interfaces";
import {
  getBookings,
  getClassBicycles,
  getUserBookings,
  reservarClaseYActualizarPaquete,
  reserveBike,
  updateBookingStatus,
} from "../../services/GlobalApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../../services/AuthService";

export default function BikeSelectionScreen({
  navigation,
  route,
}: RootStackScreenProps<"BikeSelection">) {
  const { instructor, convertedDate, rawDate, time, timeFin, classId, dia } =
    route.params;
  const [selectedBike, setSelectedBike] = useState<number | null>(null);
  const [selectedGuestBike, setSelectedGuestBike] = useState<number | null>(
    null
  );
  const [guestAdded, setGuestAdded] = useState(false);
  const [bicycles, setBicycles] = useState<Bicycle[]>([]);
  const [classBookings, setClassBookings] = useState<Booking[]>([]);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
  const [guestInfo, setGuestInfo] = useState<Guest>({
    nombreCompleto: "",
    email: "",
  });

  useEffect(() => {
    getClassBicycles(classId)
      .then((response) => {
        const classBicycles =
          response.data.attributes.room.data.attributes.bicycles.data;
        setBicycles(classBicycles);
      })
      .catch((error) => {
        console.error(error);
      });

    getBookings()
      .then((response) => {
        const bookings = response.data.data;
        setClassBookings(bookings);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [classId]);

  const handleBikeSelect = (bikeNum: number, bikeId: number) => {
    if (selectedBike === bikeNum) {
      setSelectedBike(null);
    } else if (selectedGuestBike === bikeNum) {
      setSelectedGuestBike(null);
    } else if (!selectedBike) {
      setSelectedBike(bikeNum);
    } else if (guestAdded && !selectedGuestBike) {
      setSelectedGuestBike(bikeNum);
    }
  };

  const renderBikeButton = (bike: Bicycle) => {
    const isSelected = selectedBike === bike.attributes.bicycleNumber;
    const isGuestSelected = selectedGuestBike === bike.attributes.bicycleNumber;
    const isBikeBooked = classBookings.some((booking) =>
      booking.attributes.bicycles.data.some(
        (bookedBike: { attributes: { bicycleNumber: number } }) =>
          bookedBike.attributes.bicycleNumber ===
            bike.attributes.bicycleNumber &&
          booking.attributes.class?.data.id === classId &&
          booking.attributes.bookingStatus === "completed"
      )
    );
    const buttonStyle = [
      stylesHere.bikeButton,
      isSelected && stylesHere.selectedBikeButton,
      isGuestSelected && stylesHere.selectedGuestBikeButton,
      isBikeBooked && stylesHere.unavailableBikeButton,
    ];

    return (
      <TouchableOpacity
        key={bike.id}
        style={buttonStyle}
        onPress={() => handleBikeSelect(bike.attributes.bicycleNumber, bike.id)}
        disabled={isBikeBooked}
      >
        <Text
          style={[
            stylesHere.bikeButtonText,
            (isSelected || isGuestSelected) &&
              stylesHere.selectedBikeButtonText,
          ]}
        >
          {bike.attributes.bicycleNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleAddGuestConfirm = () => {
    if (!guestInfo.nombreCompleto || !guestInfo.email) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos para el invitado."
      );
      return;
    }
    setIsGuestModalVisible(false);
    setGuestAdded(true);
    // Habilitar la selección de la bicicleta del invitado
    setSelectedGuestBike(null);
  };

  const onBikeReservePress = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const userData = await getMe(token);
        const fechaHora = `${rawDate}${time}:00.000Z`;

        const requiredClasses = selectedGuestBike ? 2 : 1;
        if (userData.clasesDisponibles >= requiredClasses) {
          const bookingData: any = {
            class: classId,
            bicycles: selectedGuestBike
              ? [selectedBike, selectedGuestBike]
              : [selectedBike],
            bookingStatus: "completed",
            user: userData.id,
            fechaHora: fechaHora,
            guest: selectedGuestBike ? guestInfo : undefined,
          };
          const userBookings = await getUserBookings(token, userData.id);
          // Verificar si el usuario ya ha reservado la misma clase anteriormente
          const hasUserBookedClass =
            userBookings.length > 0 &&
            userBookings.some(
              (booking) =>
                booking.attributes.class.data.id === classId &&
                booking.attributes.bookingStatus === "completed"
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

          const bookingResponse = await reserveBike(bookingData, token);
          await updateBookingStatus(
            bookingResponse.data.id,
            "completed",
            token
          );
          if (requiredClasses == 2) {
            const res = await reservarClaseYActualizarPaquete(userData.id, token);
            
          }
          await reservarClaseYActualizarPaquete(userData.id, token);

          navigation.navigate("Successful", {
            instructor: instructor.name,
            date: convertedDate,
            startTime: time,
            endTime: timeFin,
            bicycleNumber: selectedBike,
            dayOfWeek: dia,
            guestBicycleNumber: selectedGuestBike,
          } as SuccessfulScreenParams);
        } else {
          navigation.navigate("BuyRides");
        }
      }
    } catch (error) {
      console.error("Error al reservar la bicicleta:", error);
      Alert.alert(
        "Error",
        "No se pudo completar la reserva. Por favor, inténtalo de nuevo."
      );
      //buy rides navigation
    }
  };

  const onBackPress = () => navigation.popToTop();

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
          marginVertical: 5,
        }}
      >
        <Text style={{ ...styles.titleText, color: "white" }}>
          Selecciona tu Bici
        </Text>
      </View>

      <View style={styles.center}>
        <View style={stylesHere.box}>
          <View style={styles.spaceBet}>
            <Ionicons name="calendar" color={"#F6FD91"} size={20} />
          </View>
          <Text style={stylesHere.boxContentBottom}>Día y Hora</Text>
          <Text style={stylesHere.boxContentBottomTwo}>
            {convertedDate} - {time}
          </Text>
        </View>
        <View style={stylesHere.box}>
          <View style={styles.spaceBet}>
            <Ionicons name="person" color={"#F6FD91"} size={20} />
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
        <Image
          source={{ uri: instructor.image }}
          style={stylesHere.instructorImage}
        />
        <Text style={stylesHere.instructorName}>{instructor.name}</Text>
        <View style={stylesHere.bikeGrid}>
          {bicycles.map((bike) => renderBikeButton(bike))}
        </View>

        <View style={stylesHere.bottomContainer}>
          <View style={stylesHere.guestContainer}>
            <TouchableOpacity
              style={[
                stylesHere.addGuestButton,
                guestAdded && stylesHere.addGuestButtonDisabled,
              ]}
              onPress={() => setIsGuestModalVisible(true)}
              disabled={guestAdded}
            >
              <Ionicons
                name="person-add"
                size={15}
                color={guestAdded ? "gray" : "black"}
              />
              <Text
                style={[
                  stylesHere.addGuestButtonText,
                  guestAdded && stylesHere.addGuestButtonTextDisabled,
                ]}
              >
                {guestAdded ? "Añadido" : "Invitado"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedBike &&
                (!guestAdded || (guestAdded && selectedGuestBike))
                  ? stylesHere.reserveButton
                  : stylesHere.reserveButtonDisabled
              }
              onPress={onBikeReservePress}
              disabled={!selectedBike || (guestAdded && !selectedGuestBike)}
            >
              <Text style={stylesHere.reserveButtonText}>Reservar Bici</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={isGuestModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={stylesHere.modalContainer}>
          <View style={stylesHere.modalContent}>
            <Text
              style={{
                ...styles.subtitle,
                textAlign: "center",
                marginBottom: 25,
              }}
            >
              Añadir invitado
            </Text>
            <Text style={styles.label}>NOMBRE COMPLETO</Text>
            <View style={styles.inputView}>
              <TextInput
                autoCapitalize="none"
                value={guestInfo.nombreCompleto}
                style={styles.textInput}
                placeholder="Nombre completo..."
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setGuestInfo({ ...guestInfo, nombreCompleto: text })
                }
              />
            </View>
            <Text style={styles.label}>EMAIL</Text>
            <View style={styles.inputView}>
              <TextInput
                autoCapitalize="none"
                value={guestInfo.email}
                style={styles.textInput}
                placeholder="Email..."
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setGuestInfo({ ...guestInfo, email: text })
                }
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAddGuestConfirm}
            >
              <Text style={styles.primaryButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setIsGuestModalVisible(false)}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  box: {
    backgroundColor: "#141414",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 24,
    padding: 20,
    height: 115,
    width: 175,
  },
  boxTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginBottom: 24,
  },
  selectedGuestBikeButton: {
    backgroundColor: "#3D4AF5",
    color: "white",
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
  guestContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
  },
  addGuestButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  addGuestButtonTextDisabled: {
    color: "gray",
  },
  guestName: {
    marginLeft: 10,
    marginBottom: 3,
    fontSize: 14,
    color: "black",
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
    height: "100%",
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
    marginBottom: 0,
  },
  selectedBikeButton: {
    backgroundColor: "#3D4AF5",
    color: "white",
  },
  bikeButton: {
    width: 34,
    height: 32,
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
    color: "white",
  },
  instructorImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  instructorName: {
    fontSize: 14,
    alignSelf: "center",
    marginBottom: 10,
  },
  // reserveButton: {
  //   backgroundColor: "black",
  //   paddingVertical: 15,
  //   paddingHorizontal: 30,
  //   borderRadius: 15,
  //   width: "70%",
  //   alignSelf: "center",
  // },
  // reserveButtonDisabled: {
  //   backgroundColor: "#CDCDCD",
  //   paddingVertical: 15,
  //   paddingHorizontal: 30,
  //   borderRadius: 15,
  //   width: "60%",
  //   alignSelf: "center",
  // },
  reserveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    //fontWeight: "bold",
  },
  legendContainer: {
    marginTop: 5,
    marginBottom: 0,
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

  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCancelButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: "black",
    fontSize: 18,
  },

  // Ajuste para el grid de bicicletas en el modal
  bikeGridModal: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },

  // Ajuste para el bottomContainer
  bottomContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },

  // Estilos para el botón de añadir invitado
  addGuestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 20,
  },
  addGuestButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "black",
  },

  // Ajuste para el botón de reserva
  reserveButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: "70%",
    alignSelf: "center",
    marginLeft: 10,
  },
  reserveButtonDisabled: {
    backgroundColor: "#CDCDCD",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: "70%",
    alignSelf: "center",
    marginLeft: 10,
  },
});
