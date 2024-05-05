import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useClerk, useSignUp } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../types";
import { styles } from "../components/Styles";
import { log } from "../logger";

export default function SignUpScreen({
  navigation,
}: RootStackScreenProps<"VerifyCode">) {
  const { isLoaded, signUp, setSession } = useSignUp();

  const [code, setCode] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  const onPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setSession(completeSignUp.createdSessionId);
    } catch (err: any) {
      setIsError(true);
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };
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
      paddingTop: 40,
      paddingBottom: 40,
      width: "100%",
      height: "100%",
      //justifyContent: "center",
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
        
        <Text style={{...styles.titleText, marginTop:70, color:"white"}}>Verify email </Text>
        <Text style={{...styles.paragraph, color:"white"}}>Veriy your email to continue to Volta </Text>
      </View>
      <View style={stylesHere.inputs}>
        <View style={styles.inputView}>
          <TextInput
            value={code}
            style={styles.textInput}
            placeholder="Code..."
            placeholderTextColor="#000"
            onChangeText={(code) => setCode(code)}
          />
          
        </View>
        
        <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
          <Text style={styles.primaryButtonText}>Verify Email</Text>
        </TouchableOpacity>
        {isError && <Text style={{...styles.paragraph, color:"red"}}>This code has expired, please try to sign up again to receive a new one.</Text>}
      </View>
      
    </View>
  );
}
