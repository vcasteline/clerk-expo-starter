import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { log } from "../../logger";
import { RootStackScreenProps } from "../../types";
import { OAuthButtons } from "../../components/OAuth";
import { styles } from "../../components/Styles";
import { loginUser } from "../../services/AuthService";

const API_URL = "https://tu-dominio-de-strapi.com"; // Asegúrate de cambiar esto por la URL de tu servidor de Strapi

export default function SignInScreen({
  navigation,
}: RootStackScreenProps<"SignIn">) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [hideGoogle, setHideGoogle] = useState(false);

  const onSignInPress = async () => {
    try {
      const success = await loginUser(emailAddress, password);
      if (success) {
        navigation.replace("Main");
      } else {
        console.error("No se pudo cerrar sesión correctamente.");
      }
    } catch (err) {
      Alert.alert("Hubo un error", "Tu email o tu clave estan incorrectos.", [
                
        {
          text: "Listo",
          style: "default",
        },

      ])
      //console.error("Error:> " + JSON.stringify(err));
    }
  };

  const onSignUpPress = () => {
    navigation.navigate("EnterName");
  };

  const stylesHere = StyleSheet.create({
    container: {
      padding: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    rightImage: {
      position: "absolute",
      top: -60,
      left: "50%",
      width: 210,
      resizeMode: "contain",
    },
    heading: {
      display: "flex",
      justifyContent: "flex-start",
      textAlign: "left",
      width: "100%",
      marginLeft: 60,
      marginBottom: 20,
    },
    inputs: {
      borderRadius: 30,
      padding: 24,
      marginTop: 20,
      paddingBottom: 40,
      width: "100%",
      height: 800,
      justifyContent: "center",
      backgroundColor: "#fff",
    },
  });
  return (
    <View style={styles.container}>
      <Image
        style={stylesHere.rightImage}
        source={require("../../assets/images/wheel-1.png")}
      />
      <View style={stylesHere.heading}>
        <Text style={{ ...styles.titleText, marginTop: 70, color: "white" }}>
          Iniciar Sesión
        </Text>
        <Text style={{ ...styles.paragraph, color: "white" }}>
          Inicia sesión para continuar a Volta{" "}
        </Text>
      </View>

      <View style={stylesHere.inputs}>
        {/* <View style={styles.oauthView}>
          <OAuthButtons />
        </View> */}
        <Text style={styles.label}>ESCRIBE TU EMAIL</Text>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            style={styles.textInput}
            placeholder="Email..."
            placeholderTextColor="gray"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>
        <Text style={styles.label}>TU CLAVE</Text>
        <View style={styles.inputView}>
          <TextInput
            value={password}
            style={styles.textInput}
            placeholder="Clave..."
            placeholderTextColor="gray"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onSignInPress}>
          <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>No tienes cuenta?</Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onSignUpPress}
          >
            <Text style={styles.secondaryButtonText}>Crear Nueva Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
