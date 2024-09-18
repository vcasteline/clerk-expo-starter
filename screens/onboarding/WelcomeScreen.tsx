import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { OAuthButtons } from "../../components/OAuth";

export default function WelcomeScreen({
  navigation,
}: RootStackScreenProps<"Welcome">) {
  const onSignInPress = () => navigation.navigate("SignIn");
  const onSignUpPress = () => navigation.navigate("EnterName");

  const stylesHere = StyleSheet.create({
    container: {
      padding: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    centeredImage: {
      width: 290,
      height: 270,
      resizeMode: "contain",
      marginLeft: 70,
      marginRight: -40,
    },
    rightImage: {
      width: 90,
      marginLeft: 0,
    },
    inputs: {
      borderRadius: 30,
      padding: 26,
      paddingTop: 30,
      paddingBottom: 60,
      width: "100%",
      height: "100%",
      backgroundColor: "#fff",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoSignUp}>
        <Image
          style={{ width: 190, resizeMode: "contain", paddingBottom: 0 }}
          source={require("../../assets/images/volta-logo-slogan.png")}
        />
      </View>
      <View style={stylesHere.container}>
        <Image
          style={stylesHere.centeredImage}
          source={require("../../assets/images/woman-wheel.png")}
        />
        <Image
          style={stylesHere.rightImage}
          source={require("../../assets/images/wheel.png")}
        />
      </View>
      <View style={stylesHere.inputs}>
        <Text style={styles.titleText}>Empecemos</Text>
        <Text style={styles.paragraph}>
          Inicia sesión o crea una nueva cuenta{" "}
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={onSignUpPress}>
          <Text style={styles.primaryButtonText}>Crear Nueva Cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSignInPress}
        >
          <Text style={styles.secondaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <Image
          style={{ width: 200, resizeMode: "contain" }}
          source={require("../../assets/images/wheel.png")}
        />
        {/* <View style={styles.center}>
          <Text style={{ ...styles.paragraph, marginTop: 15 }}></Text>
          <View
            style={{
              ...styles.center,
              borderBottomColor: "#CDCDCD",
              borderBottomWidth: 1,
              width: 200,
              marginVertical: 10,
            }}
          ></View>
        </View> */}
        {/* <View style={styles.center}>
          <OAuthButtons />
        </View> */}
      </View>
    </View>
  );
}
