import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import axios from "axios";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { getTokenizedCards, verifyCard } from "../../services/PaymentService";

interface FormField {
  label: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
}
const formatExpiryDate = (text: string) => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

const formatCVV = (text: string) => {
  return text.replace(/\D/g, '').slice(0, 4);
};

const FormInput: React.FC<FormField & { style?: ViewStyle, formatFunction?: (text: string) => string }> = ({
  label,
  placeholder,
  value,
  onChange,
  style,
  formatFunction,
}) => (
  <View style={style}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputView}>
      <TextInput
        autoCapitalize="none"
        value={value}
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="gray"
        onChangeText={(text) => onChange(formatFunction ? formatFunction(text) : text)}
      />
    </View>
  </View>
);

type PaymentMethodScreenProps = RootStackScreenProps<"PaymentMethod"> & {
  route: {
    params: {
      username: string;
      userId: string;
      email: string;
      onCardAdded?: () => void;
    };
  };
};

export default function PaymentMethodScreen({
  route,
  navigation,
}: PaymentMethodScreenProps) {
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
    } catch (error: any) {
      console.error("Error completo:", JSON.stringify(error, null, 2));
      if (error.response) {
        console.error("Datos de respuesta:", error.response.data);
        console.error("Estado:", error.response.status);
        console.error("Cabeceras:", error.response.headers);
      } else if (error.request) {
        console.error("Error de solicitud:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      throw error;
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
  const handleTokenizeCard = async () => {
    try {
      const authToken = await getNuveiAuthToken();
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
      };
        
      let tokenizedCard: { status: string; transaction_reference: string; token: any; };
      try {
        tokenizedCard = await tokenizeCard(authToken, userData, cardData);
        // console.log("Tokenized card response:", tokenizedCard);
  
        if (tokenizedCard.status === "valid") {
          Alert.alert("Éxito", "Tarjeta añadida exitosamente");
          navigation.goBack();
        } else if (tokenizedCard.status === "review" || tokenizedCard.status === "pending") {
          const otp = await getOTPFromUser();
          await verifyCard(authToken, tokenizedCard.transaction_reference, username, otp);
          
          // Obtener el estado actualizado de las tarjetas después de la verificación
          const updatedCards = await getTokenizedCards(username);
          console.log(updatedCards)
          const updatedCard = updatedCards?.find((card: { token: any; }) => card.token === tokenizedCard.token);
          
          if (updatedCard && updatedCard.status === "valid") {
            Alert.alert("Éxito", "Tarjeta verificada y añadida exitosamente");
            navigation.goBack();
          } else {
            throw new Error("La tarjeta no pudo ser verificada");
          }
        } else if (tokenizedCard.status === "rejected") {
          Alert.alert("Error", "Tu tarjeta fue rechazada. Verifica que todos los datos estén correctos o prueba con otra tarjeta.");
        } else {
          throw new Error("Estado de tarjeta desconocido");
        }
      } catch (error: any) {
        if (error.message === "OTP cancelado") {
          Alert.alert("Verificación cancelada", "La tarjeta no ha sido añadida.");
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error("Error completo:", error);
      Alert.alert(
        "Error al tokenizar la tarjeta",
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
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={30} color={"white"} />
          </TouchableWithoutFeedback>
        </View>
        <Text style={{ ...styles.titleText, color: "white" }}>
          Agregar método de pago
        </Text>
        <Text style={{ ...styles.description, marginBottom: 20 }}>
          Añade tu tarjeta aquí
        </Text>
      </View>

      <View style={stylesHere.dashboard}>
  <FormInput
    label="TITULAR"
    placeholder="Nombre del titular"
    value={cardHolder}
    onChange={setCardHolder}
  />
  <FormInput
    label="NO. DE TARJETA"
    placeholder="Número de tarjeta"
    value={cardNumber}
    onChange={setCardNumber}
  />
  <View style={stylesHere.rowContainer}>
    <FormInput
      label="EXPIRACIÓN"
      placeholder="MM/YY"
      value={expiryDate}
      onChange={setExpiryDate}
      style={stylesHere.halfInput}
      formatFunction={formatExpiryDate}
    />
    <FormInput
      label="CVV"
      placeholder="Código"
      value={cvv}
      onChange={setCvv}
      style={stylesHere.halfInput}
      formatFunction={formatCVV}
    />
  </View>
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 15, // Espacio entre grupos de inputs
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  inputView: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textInput: {
    fontSize: 16,
  },
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
