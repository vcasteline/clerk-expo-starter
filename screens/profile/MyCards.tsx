import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { isDinersCard, verifyDinersCard } from "../../services/PaymentService";

export default function MyCardsScreen({
  route,
  navigation,
}: RootStackScreenProps<"MyCards">) {
  const { userId, email, username } = route.params;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      setLoading(true);
      const authToken = await getNuveiAuthToken();
      const response = await axios.get(
        "https://ccapi-stg.paymentez.com/v2/card/list",
        {
          params: { uid: username },
          headers: { "Auth-Token": authToken },
        }
      );
      setCards(response.data.cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar las tarjetas. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCards().then(() => setRefreshing(false));
  }, []);

  const getCardTypeImage = (cardType: string) => {
    switch (cardType.toLowerCase()) {
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

  const getOTPFromUser = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      Alert.prompt(
        "Verificación OTP",
        "Por favor, ingrese el código OTP que recibió:",
        [
          {
            text: "Cancelar",
            onPress: () => reject(new Error("OTP cancelado")),
            style: "cancel"
          },
          {
            text: "Verificar",
            onPress: (otp: string | undefined) => {
              if (otp) {
                resolve(otp);
              } else {
                reject(new Error("OTP inválido"));
              }
            }
          }
        ],
        "plain-text"
      );
    });
  };

  const deleteCard = async (cardToken: string, cardType: string) => {
    try {
      const authToken = await getNuveiAuthToken();
  
      // if (cardType == "di") {
      //   const otp = getOTPFromUser();
      //   await verifyDinersCard(authToken, cardToken, username, otp );
      // }
  
      await axios.post(
        "https://ccapi-stg.paymentez.com/v2/card/delete/",
        {
          card: { token: cardToken },
          user: { id: username },
        },
        {
          headers: { "Auth-Token": authToken },
        }
      );
  
      setCards(cards.filter((card: any) => card.token !== cardToken));
      Alert.alert("Éxito", "Tarjeta eliminada correctamente");
    } catch (error) {
      console.error("Error deleting card:", error);
      Alert.alert("Error", "No se pudo eliminar la tarjeta");
    }
  };

  type CardItem = {
    type: string;
    number: string;
    expiry_month: string;
    expiry_year: string;
    token: string;
  };
  const renderCard = ({ item }: { item: CardItem }) => (
    <View style={stylesHere.cardItem}>
      <Image
        source={getCardTypeImage(item.type)}
        style={stylesHere.cardTypeImage}
      />
      <View style={stylesHere.cardDetails}>
        <Text style={stylesHere.cardNumber}>**** **** **** {item.number}</Text>
        <Text style={stylesHere.cardExpiry}>
          Exp: {item.expiry_month}/{item.expiry_year}
        </Text>
      </View>
      <View style={stylesHere.cardActions}>
        <TouchableOpacity onPress={() => deleteCard(item.token, item.type )}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={stylesHere.container}>
      <View style={stylesHere.headingAndButtons}>
        <View style={{ ...styles.heading, marginLeft: 0, marginBottom: 20 }}>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={30} color={"white"} />
          </TouchableWithoutFeedback>
        </View>
        <Text style={{ ...styles.titleText, color: "white" }}>
          Mis Tarjetas
        </Text>
        <View style={{marginBottom:20}}>
          <Text style={styles.description}>
            Añade o borra tus métodos de pago.
          </Text>
        </View>
      </View>

      <View style={stylesHere.dashboard}>
        {loading ? (
          <Text style={stylesHere.loadingText}>Cargando tarjetas...</Text>
        ) : (
          <FlatList
            data={cards}
            renderItem={renderCard}
            keyExtractor={(item) => item.token}
            ListEmptyComponent={
              <Text style={stylesHere.emptyText}>
                No tienes tarjetas guardadas
              </Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("PaymentMethod", { username, userId, email })
          }
        >
          <Text style={styles.primaryButtonText}>+ Agregar nueva tarjeta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 75,
    backgroundColor: "black",
  },
  headingAndButtons: {
    paddingHorizontal: 24,
  },
  dashboard: {
    borderRadius: 30,
    padding: 18,
    marginTop: 0,
    paddingBottom: 90,
    width: "100%",
    height: "82%",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  cardTypeImage: {
    width: 50,
    height: 30,
    marginRight: 15,
  },
  cardDetails: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardExpiry: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultIcon: {
    marginRight: 10,
  },
  setDefaultText: {
    color: "blue",
    marginRight: 15,
  },
});