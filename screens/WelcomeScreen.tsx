import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { log } from "../logger";
import { RootStackScreenProps } from "../types";
import { styles } from "../components/Styles";
import { OAuthButtons } from "../components/OAuth";

export default function WelcomeScreen({
  navigation,
}: RootStackScreenProps<"Welcome">) {
  const { isLoaded, signUp } = useSignUp();

  const onSignInPress = () => navigation.replace("SignIn");
  const onSignUpPress = () => navigation.replace("SignUp");

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
      borderRadius:30,
      padding: 24,
      paddingBottom:40,
      width: "100%",
      justifyContent: "space-between",
      backgroundColor: "#fff",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoSignUp}>
        <Image
          style={{ width: 210, resizeMode: "contain", paddingBottom:0 }}
          source={require("../assets/images/volta-logo-slogan.png")}
        />
      </View>
      <View style={stylesHere.container}>
        <Image
          style={stylesHere.centeredImage}
          source={require("../assets/images/woman-wheel.png")}
        />
        <Image
          style={stylesHere.rightImage}
          source={require("../assets/images/wheel.png")}
        />
      </View>
      <View style={stylesHere.inputs}>
        <Text style={styles.titleText}>Let's Get Started </Text>
        <Text style={styles.paragraph}>Sign in to your account or create a new one </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={onSignUpPress}>
          <Text style={styles.primaryButtonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSignInPress}
        >
          <Text style={styles.secondaryButtonText}>Sign in</Text>
        </TouchableOpacity>
        <View style={styles.center}> 
            <Text style={{...styles.paragraph, marginTop:15}}>-or-</Text>
        </View>
        <View style={styles.center}>
          <OAuthButtons />
        </View>
      </View>
    </View>
  );
}
