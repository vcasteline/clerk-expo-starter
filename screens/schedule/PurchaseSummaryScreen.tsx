import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../types";
import {
  getTokenizedCards,
  processNuveiPayment,
  updateUserCredits,
} from "../../services/PaymentService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { PurchaseRides } from "../../interfaces";
import axios from "axios";
import { getMe } from "../../services/AuthService";

const { height } = Dimensions.get("window");

type PurchaseSummaryScreenProps = RootStackScreenProps<"PurchaseSummary"> & {
  route: {
    params: {
      selectedPackage: PurchaseRides;
    };
  };
};

export default function PurchaseSummaryScreen({
  navigation,
  route,
}: PurchaseSummaryScreenProps) {
  const { selectedPackage } = route.params;
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const onBackPress = () => navigation.pop();

  const getCardTypeName = (cardType: string) => {
    switch (cardType?.toLowerCase()) {
      case "vi":
        return "Visa";
      case "mc":
        return "MasterCard";
      case "ax":
        return "American Express";
      case "di":
        return "Diners Club";
      default:
        return cardType;
    }
  };

  const getCardTypeImage = (cardType: string) => {
    switch (cardType?.toLowerCase()) {
      case "vi":
        return require("../../assets/images/visa.jpg");
      case "mc":
        return require("../../assets/images/mastercard.png");
      case "ax":
        return require("../../assets/images/amex.svg");
      case "di":
        return require("../../assets/images/diners.png");
      default:
        return require("../../assets/images/splash.png");
    }
  };

  const getNuveiAuthToken = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/nuvei/auth-token`
      );
      return response.data.token;
    } catch (error) {
      console.error("Error obtaining Nuvei auth token:", error);
      throw error;
    }
  };

  const fetchCards = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de usuario");
      }

      const userData = await getMe(token);
      setUser(userData);

      if (!userData.username) {
        throw new Error("No se pudo obtener el username del usuario");
      }

      const authToken = await getNuveiAuthToken();

      const response = await axios.get(
        "https://ccapi-stg.paymentez.com/v2/card/list",
        {
          params: { uid: userData.username },
          headers: { "Auth-Token": authToken },
        }
      );
      // console.log("Response data:", response.data); // Log de la respuesta completa
      setCards(response.data.cards);
      if (response.data.cards.length > 0) {
        setSelectedCard(response.data.cards[0]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching cards:",
          error.response?.data || error.message
        );
        Alert.alert(
          "Error",
          `No se pudieron cargar las tarjetas: ${
            error.response?.data?.error || error.message
          }`
        );
      } else {
        console.error("Unexpected error:", error);
        Alert.alert(
          "Error",
          "Ocurrió un error inesperado al cargar las tarjetas."
        );
      }
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const username = user?.username;
  const userId = user?.id;
  const email = user?.email;

  const handleAddCard = () => {
    navigation.navigate("PaymentMethod", { username, userId, email });
    toggleModal();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCards();
    });
    return unsubscribe;
  }, [navigation]);

  const handleBuyPackage = async () => {
    if (!selectedCard) {
      Alert.alert(
        "Error",
        "Por favor selecciona o añade una tarjeta para continuar."
      );
      return;
    }

    try {
      if (!username) {
        Alert.alert("Error", "No se pudo obtener el token de usuario.");
        return;
      }

      // console.log("Selected package:", selectedPackage);
      // console.log("Selected card:", selectedCard);

      const price = selectedPackage.attributes.precio;
      const vat = price * 0.15;
      const precioFinal = price + vat;

      const paymentResult = await processNuveiPayment(
        username,
        `paquete # ${selectedPackage.id}`,
        selectedCard.token,
        precioFinal,
        selectedPackage.attributes.nombre,
        vat,
        email
      );

      // console.log("Payment result:", paymentResult);

      if (
        paymentResult.transaction &&
        paymentResult.transaction.status === "success"
      ) {
        try {
          const token = await AsyncStorage.getItem("userToken");
          if (!token) {
            throw new Error("No se encontró el token de usuario");
          }

          await updateUserCredits(
            token,
            selectedPackage.attributes.numeroDeRides,
            user.id
          );
          Alert.alert(
            "Éxito",
            `Has comprado ${selectedPackage.attributes.nombre}.`
          );

          navigation.reset({
            index: 0,
            routes: [{ name: "MyProfile" }],
          });
          navigation.navigate("Home" as never);
        } catch (error) {
          console.error("Error al actualizar créditos:", error);
          Alert.alert(
            "Advertencia",
            "El pago se procesó correctamente, pero hubo un problema al actualizar tus créditos. Por favor, contacta a soporte."
          );
        }
      } else {
        Alert.alert(
          "Error",
          "No se pudo procesar el pago. Por favor, intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      if (axios.isAxiosError(error)) {
        console.error("Payment error response:", error.response?.data);
        console.error("Payment error status:", error.response?.status);
        console.error("Payment error headers:", error.response?.headers);
      }
      Alert.alert(
        "Error",
        "Ocurrió un error al procesar el pago. Por favor, intenta más tarde."
      );
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    Animated.timing(rotateAnim, {
      toValue: showModal ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const price = selectedPackage.attributes.precio;
  const vat = price * 0.15;
  const precioFinal = price + vat;

  return (
    <SafeAreaView style={stylesHere.container}>
      <View style={stylesHere.header}>
        <TouchableOpacity onPress={onBackPress} style={stylesHere.backButton}>
          <Ionicons name="chevron-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={stylesHere.headerTitle}>Resumen de Compra</Text>
      </View>

      <View style={stylesHere.content}>
        <ScrollView contentContainerStyle={stylesHere.scrollContent}>
          <View style={stylesHere.infoContainer}>
            <Text style={stylesHere.sectionTitle}>Nombre:</Text>
            <Text style={stylesHere.sectionContent}>
              {selectedPackage.attributes.nombre}
            </Text>

            <Text style={stylesHere.sectionTitle}># de clases:</Text>
            <Text style={stylesHere.sectionContent}>
              {selectedPackage.attributes.numeroDeRides}
            </Text>

            {/* <Text style={stylesHere.sectionTitle}>Precio:</Text>
            <Text style={stylesHere.sectionContent}>
              ${selectedPackage.attributes.precio} 
            </Text> */}

            <Text style={stylesHere.sectionTitle}>
              Precio Final (includido IVA):
            </Text>
            <Text style={stylesHere.sectionContent}>${precioFinal}</Text>

            <Text style={stylesHere.sectionTitle}>Método de Pago:</Text>
            <TouchableOpacity
              style={stylesHere.paymentButton}
              onPress={toggleModal}
            >
              <Image
                source={getCardTypeImage(selectedCard?.type)}
                style={stylesHere.cardTypeImage2}
              />
              <Text style={[stylesHere.paymentButtonText, { flex: 1, marginLeft: 10 }]}>
                {selectedCard
                  ? `${getCardTypeName(selectedCard?.type)} **** ${
                      selectedCard?.number
                    }`
                  : "Seleccionar tarjeta"}
              </Text>
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Ionicons name="chevron-down-outline" size={24} color="black" />
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View style={stylesHere.buyButtonContainer}>
            <TouchableOpacity
              style={stylesHere.buyButton}
              onPress={handleBuyPackage}
            >
              <Text style={stylesHere.buyButtonText}>Comprar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={stylesHere.modalContainer}>
          <View style={stylesHere.modalContent}>
            {cards.length > 0 ? (
              <View>
                {cards.map((card) => (
                  <TouchableOpacity
                    key={card.token}
                    style={[
                      stylesHere.cardOption,
                      selectedCard?.token === card.token &&
                        stylesHere.selectedCard,
                    ]}
                    onPress={() => {
                      setSelectedCard(card);
                      toggleModal();
                    }}
                  >
                    <View style={stylesHere.cardContent}>
                      <Image
                        source={getCardTypeImage(card.type)}
                        style={stylesHere.cardTypeImage}
                      />
                      <View style={stylesHere.cardTextContent}>
                        <Text style={stylesHere.cardTypeName}>
                          {getCardTypeName(card.type)}
                        </Text>
                        <Text style={stylesHere.cardNumber}>
                          **** {card.number}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text>No hay tarjetas guardadas</Text>
            )}
            <TouchableOpacity
              style={[stylesHere.modalOption, stylesHere.addCardOption]}
              onPress={handleAddCard}
            >
              <Text style={stylesHere.addCardText}>+ Añadir tarjeta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={stylesHere.closeModalButton}
              onPress={toggleModal}
            >
              <Text style={stylesHere.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const stylesHere = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  infoContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  paymentButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 20,
  },
  paymentButtonText: {
    fontSize: 16,
  },
  buyButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 70,
    paddingTop: 10,
  },
  buyButton: {
    backgroundColor: "black",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalOptionText: {
    fontSize: 16,
  },
  addCardOption: {
    borderBottomWidth: 0,
  },
  addCardText: {
    color: "blue",
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedCard: {
    borderColor: "blue",
    backgroundColor: "#e6e6ff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTypeImage: {
    width: 40,
    height: 25,
    marginRight: 10,
    resizeMode: "contain",
  },
  cardTypeImage2: {
    width: 40,
    height: 25,
    marginRight: 0,
    resizeMode: "contain",
  },
  cardTextContent: {
    flexDirection: "column",
  },
  cardTypeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardNumber: {
    fontSize: 14,
    color: "#666",
  },
});
