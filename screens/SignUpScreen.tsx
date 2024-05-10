import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { log } from "../logger";
import { RootStackScreenProps } from "../types";
import { styles } from "../components/Styles";
import { OAuthButtons } from "../components/OAuth";
import { registerUser } from "../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen({
  navigation,
}: RootStackScreenProps<"SignUp">) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignUpPress = async () => {
    try {
      const userData = {
        // firstName,
        // lastName,
        username,
        email,
        password,
      };

      // Registro del usuario
      const registerResponse = await registerUser(userData);
      if (registerResponse && registerResponse.jwt) {
        // Almacenamiento del JWT en AsyncStorage
        await AsyncStorage.setItem("userToken", registerResponse.jwt);
        // Navegación al componente principal de la aplicación
        navigation.replace("Main");
      } else {
        console.error("Registro completado pero no se recibió token JWT.");
      }
    } catch (err: any) {
      log("Error:> " + err?.message || "");
    }
  };

  const onSignInPress = () => navigation.replace("SignIn");
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
          Create Account{" "}
        </Text>
        <Text style={{ ...styles.paragraph, color: "white" }}>
          Please enter your information{" "}
        </Text>
      </View>

      <View style={stylesHere.inputs}>
        <View style={styles.oauthView}>
          <OAuthButtons />
        </View>

        {/* <View style={styles.inputView}>
          <TextInput
            value={firstName}
            style={styles.textInput}
            placeholder="First name..."
            placeholderTextColor="#000"
            onChangeText={(firstName) => setFirstName(firstName)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            value={lastName}
            style={styles.textInput}
            placeholder="Last name..."
            placeholderTextColor="#000"
            onChangeText={(lastName) => setLastName(lastName)}
          />
        </View> */}

        <View style={styles.inputView}>
          <TextInput
            value={username}
            style={styles.textInput}
            placeholder="Username..."
            placeholderTextColor="#000"
            onChangeText={(username) => setUsername(username)}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            value={email}
            style={styles.textInput}
            placeholder="Email..."
            placeholderTextColor="#000"
            onChangeText={(email) => setEmail(email)}
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

        <TouchableOpacity
          style={{ ...styles.primaryButton, marginTop: 0 }}
          onPress={onSignUpPress}
        >
          <Text style={styles.primaryButtonText}>Sign up</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Have an account?</Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onSignInPress}
          >
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
