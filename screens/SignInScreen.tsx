import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { log } from "../logger";
import { RootStackScreenProps } from "../types";
import { OAuthButtons } from "../components/OAuth";
import { styles } from "../components/Styles";
import { loginUser } from "../services/AuthService";

const API_URL = "https://tu-dominio-de-strapi.com"; // Asegúrate de cambiar esto por la URL de tu servidor de Strapi

export default function SignInScreen({
  navigation,
}: RootStackScreenProps<"SignIn">) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    try {
      const success = await loginUser(emailAddress, password);
      if (success) {
        navigation.replace('Main'); 
      } else {
        console.error("No se pudo cerrar sesión correctamente.");
      }
    } catch (err) {
      console.error("Error:> " + JSON.stringify(err));
    }
  };

  const onSignUpPress = () => {
    navigation.replace("SignUp");
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
      left: 180,
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
        source={require("../assets/images/wheel-1.png")}
      />
      <View style={stylesHere.heading}>
        <Text style={{ ...styles.titleText, marginTop: 70, color: "white" }}>
          Login{" "}
        </Text>
        <Text style={{ ...styles.paragraph, color: "white" }}>
          Login to continue to Volta{" "}
        </Text>
      </View>

      <View style={stylesHere.inputs}>
        <View style={styles.oauthView}>
          <OAuthButtons />
        </View>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            style={styles.textInput}
            placeholder="Email..."
            placeholderTextColor="#000"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            value={password}
            style={styles.textInput}
            placeholder="Password..."
            placeholderTextColor="#000"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onSignInPress}>
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Don't have an account?</Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onSignUpPress}
          >
            <Text style={styles.secondaryButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
