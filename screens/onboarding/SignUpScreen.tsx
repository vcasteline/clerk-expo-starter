import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { log } from "../../logger";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { OAuthButtons } from "../../components/OAuth";
import { registerUser } from "../../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../utils/UserContext";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen({
  navigation,
}: RootStackScreenProps<"SignUp">) {
 
  const { user, setUser } = React.useContext(UserContext);

  const onSignUpPress = async () => {
    try {
      const userData = {
        nombre: user.firstName,
        apellido: user.lastName,
        username: user.username,
        password: user.password,
        email: user.email,
        birthday: user.dateOfBirth,
        telefono: user.number
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
  const onBackPress = () => navigation.pop();
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
        source={require("../../assets/images/wheel-1.png")}
      />
      <View style={{...stylesHere.heading,  marginTop: 40}}>
      <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
        <Text style={{ ...styles.titleText, marginTop: 20, color: "white" }}>
          Crear Nueva Cuenta{" "}
        </Text>
        <Text style={{ ...styles.paragraph, color: "white", marginRight:30 }}>
          Ultimo paso! Entra tu información.{" "}
        </Text>
      </View>

      <View style={stylesHere.inputs}>
        {/* <View style={styles.oauthView}>
          <OAuthButtons />
        </View> */}
        <View style={styles.inputView}>
          <TextInput
            value={user.username}
            style={styles.textInput}
            placeholder="Username..."
            placeholderTextColor="gray"
            onChangeText={(username) => setUser({...user, username: username})}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            value={user.email}
            style={styles.textInput}
            placeholder="Email..."
            placeholderTextColor="gray"
            onChangeText={(email) => setUser({...user, email: email})}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            value={user.password}
            style={styles.textInput}
            placeholder="Password..."
            placeholderTextColor="gray"
            secureTextEntry={true}
            onChangeText={(password) => setUser({...user, password: password})}
          />
        </View>

        <View style={{...styles.footer, marginTop: 0}}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onSignUpPress}
          >
            <Text style={styles.primaryButtonText}>Crear Nueva Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
