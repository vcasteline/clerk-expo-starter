import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { log } from "../logger";
import { RootStackScreenProps } from "../types";
import { OAuthButtons } from "../components/OAuth";
import { styles } from "../components/Styles";

export default function SignInScreen({
  navigation,
}: RootStackScreenProps<"SignIn">) {
  const { signIn, setSession, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setSession(completeSignIn.createdSessionId);
    } catch (err: any) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  const onSignUpPress = () => navigation.replace("SignUp");
  const stylesHere = StyleSheet.create({
    container: {
      padding: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
  
    },
    rightImage: {
      position:"absolute",
      top: -60,
      left: 180,
      width: 210, 
      resizeMode: "contain"
    },
    heading: {
      display:"flex",
      justifyContent:"flex-start",
      textAlign:"left",
      width:"100%",
      marginLeft:60,
      marginBottom:20
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
        
        <Text style={{...styles.titleText, marginTop:70, color:"white"}}>Login </Text>
        <Text style={{...styles.paragraph, color:"white"}}>Login to continue to Volta </Text>
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
