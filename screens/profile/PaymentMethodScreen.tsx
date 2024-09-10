import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";

interface FormField {
  label: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
}

const FormInput: React.FC<FormField> = ({
  label,
  placeholder,
  value,
  onChange,
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputView}>
      <TextInput
        autoCapitalize="none"
        value={value}
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="gray"
        onChangeText={onChange}
      />
    </View>
  </>
);

export default function PaymentMethodScreen({
  route,
  navigation,
}: RootStackScreenProps<"PaymentMethod">) {
  const { username, email, userId } = route.params;
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

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

  const tokenizeCard = async (
    authToken: string,
    userData: any,
    cardData: any
  ) => {
    try {
      const response = await axios.post(
        "https://ccapi-stg.paymentez.com/v2/card/add",
        {
          user: userData,
          card: cardData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": authToken,
          },
        }
      );
      return response.data.card;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error Response:", error.response?.data);
        console.error("Error Status:", error.response?.status);
        console.error("Error Headers:", error.response?.headers);
      }
      throw error;
    //   Alert.alert(
    //     "Error tokenizing card",
    //     error instanceof Error ? error.message : "An unknown error occurred"
    //   );
    }
  };

  const handleTokenizeCard = async () => {
    try {
      const authToken = await getNuveiAuthToken();
      console.log("Auth Token:", authToken);
  
      const [expiryMonth, expiryYear] = expiryDate.split("/");
  
      const userData = {
        id: username,
        email: email,
      };
  
      const cardData = {
        number: cardNumber.replace(/\s/g, ""),
        holder_name: cardHolder,
        expiry_month: parseInt(expiryMonth, 10),
        expiry_year: parseInt(`20${expiryYear}`, 10),
        cvc: cvv,
        type: "vi", // Asume Visa, ajusta según sea necesario
      };
  
      console.log("User Data:", userData);
      console.log("Card Data:", cardData);
  
      let tokenizedCard;
      try {
        tokenizedCard = await tokenizeCard(authToken, userData, cardData);
      } catch (error: any) {
        if (error.response?.data?.error?.type?.startsWith("Card already added")) {
          const tokenMatch = error.response.data.error.type.match(/\d+/);
          if (tokenMatch) {
            tokenizedCard = { token: tokenMatch[0] };
          } else {
            throw new Error("No se pudo extraer el token de la tarjeta ya existente");
          }
        } else {
          console.error("Error en tokenización:", error);
          throw new Error(error.response?.data?.error?.description || "Error desconocido al tokenizar la tarjeta");
        }
      }
  
      console.log(tokenizedCard)
      console.log(userId)
      // Ahora guardamos solo el token en nuestro backend
      if (tokenizedCard && tokenizedCard.token) {
        try {
          await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/tokenized-cards`, {
            data: {
              users_permissions_user: userId,
              token: tokenizedCard.token,
            },
          }, {
            headers: {
              Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`, 
            },
          });
  
          Alert.alert(
            "Card tokenized successfully!",
            `Token: ${tokenizedCard.token}`
          );
        } catch (error) {
          console.error("Error saving token to backend:", error);
          Alert.alert(
            "Error saving card token",
            "The card was tokenized but couldn't be saved in our system."
          );
        }
      } else {
        throw new Error("No se pudo obtener un token válido para la tarjeta");
      }
    } catch (error) {
      console.error("Error completo:", error);
      Alert.alert(
        "Error tokenizing card",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const formFields: FormField[] = [
    {
      label: "TITULAR",
      placeholder: "Nombre del titular",
      value: cardHolder,
      onChange: setCardHolder,
    },
    {
      label: "NO. DE TARJETA",
      placeholder: "Número de tarjeta",
      value: cardNumber,
      onChange: setCardNumber,
    },
    {
      label: "EXPIRACIÓN",
      placeholder: "MM/YY",
      value: expiryDate,
      onChange: setExpiryDate,
    },
    {
      label: "CVV",
      placeholder: "Codigo de seguridad",
      value: cvv,
      onChange: setCvv,
    },
  ];

  return (
    <View style={stylesHere.container}>
      <View style={stylesHere.headingAndButtons}>
        <View style={{ ...styles.heading, marginLeft: 0, marginBottom: 20 }}>
          <TouchableWithoutFeedback>
            <Ionicons name="chevron-back-outline" size={30} color={"white"} />
          </TouchableWithoutFeedback>
        </View>
        <Text style={{ ...styles.titleText, color: "white" }}>
          Agregar método de pago
        </Text>
        <Text style={{ ...stylesHere.subtitle, marginLeft: 0 }}>
          Añade tu tarjeta aquí
        </Text>
      </View>

      <View style={stylesHere.dashboard}>
        {formFields.map((field, index) => (
          <FormInput key={index} {...field} />
        ))}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleTokenizeCard}
        >
          <Text style={styles.primaryButtonText}>Agregar Tarjeta</Text>
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
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 16,
  },
});
