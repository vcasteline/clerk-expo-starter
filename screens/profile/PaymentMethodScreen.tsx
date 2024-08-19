import React, { useState } from "react";
import { View, TextInput, Alert, TouchableWithoutFeedback, Text, StyleSheet, TouchableOpacity } from "react-native";
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

const FormInput: React.FC<FormField> = ({ label, placeholder, value, onChange }) => (
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
  const { username, email } = route.params;
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  
  const handleTokenizeCard = async () => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/payment/tokenize-card`,
        {
          cardNumber,
          expiryDate,
          cvv,
          cardHolder,
          userId: username,
          email: email,
        }
      );

      Alert.alert(
        "Card tokenized successfully!",
        `Token: ${response.data.token}`
      );
    } catch (error) {
      Alert.alert("Error tokenizing card", error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const formFields: FormField[] = [
    { label: "TITULAR", placeholder: "Nombre del titular", value: cardHolder, onChange: setCardHolder },
    { label: "NO. DE TARJETA", placeholder: "Número de tarjeta", value: cardNumber, onChange: setCardNumber },
    { label: "EXPIRACIÓN", placeholder: "Fecha de expiración", value: expiryDate, onChange: setExpiryDate },
    { label: "CVV", placeholder: "Codigo de seguridad", value: cvv, onChange: setCvv },
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
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleTokenizeCard}>
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