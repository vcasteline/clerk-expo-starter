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

export default function SignUpScreen({
  navigation,
}: RootStackScreenProps<"SignUp">) {
  const { isLoaded, signUp } = useSignUp();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // https://docs.clerk.dev/popular-guides/passwordless-authentication
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      navigation.navigate("VerifyCode");
    } catch (err: any) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
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
        
        <Text style={{...styles.titleText, marginTop:70, color:"white"}}>Create Account </Text>
        <Text style={{...styles.paragraph, color:"white"}}>Please enter your information </Text>
      </View>

      <View style={stylesHere.inputs}>
        <View style={styles.oauthView}>
          <OAuthButtons />
        </View>

        <View style={styles.inputView}>
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
        </View>

        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            style={styles.textInput}
            placeholder="Email..."
            placeholderTextColor="#000"
            onChangeText={(email) => setEmailAddress(email)}
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

        <TouchableOpacity style={{...styles.primaryButton, marginTop:0}} onPress={onSignUpPress}>
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
//   const stylesHere = StyleSheet.create({
//     container: {
//       padding: 0,
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "center",
//       overflow: "hidden",
//     },
//     centeredImage: {
//       width: 300,
//       height: 300,
//       resizeMode: "contain",
//       marginLeft: 185,
//       marginRight: 0,
//     },
//     rightImage: {
//       width: 90,
//       marginLeft: 0,
//     },
//     inputs: {
//       width:"100%",
//       justifyContent:"space-between"
//     }
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.logoSignUp}>
//         <Image
//           style={{ width: 200, resizeMode: "contain" }}
//           source={require("../assets/images/volta-logo.png")}
//         />
//       </View>
//       <View style={stylesHere.container}>
//         <Image
//           style={stylesHere.centeredImage}
//           source={require("../assets/images/woman-wheel.png")}
//         />
//         <Image
//           style={stylesHere.rightImage}
//           source={require("../assets/images/wheel.png")}
//         />
//       </View>
//       <View style={stylesHere.inputs}>
//         <View style={styles.oauthView}>
//           <OAuthButtons />
//         </View>

//         <View style={styles.inputView}>
//           <TextInput
//             value={firstName}
//             style={styles.textInput}
//             placeholder="First name..."
//             placeholderTextColor="#000"
//             onChangeText={(firstName) => setFirstName(firstName)}
//           />
//         </View>

//         <View style={styles.inputView}>
//           <TextInput
//             value={lastName}
//             style={styles.textInput}
//             placeholder="Last name..."
//             placeholderTextColor="#000"
//             onChangeText={(lastName) => setLastName(lastName)}
//           />
//         </View>

//         <View style={styles.inputView}>
//           <TextInput
//             autoCapitalize="none"
//             value={emailAddress}
//             style={styles.textInput}
//             placeholder="Email..."
//             placeholderTextColor="#000"
//             onChangeText={(email) => setEmailAddress(email)}
//           />
//         </View>

//         <View style={styles.inputView}>
//           <TextInput
//             value={password}
//             style={styles.textInput}
//             placeholder="Password..."
//             placeholderTextColor="#000"
//             secureTextEntry={true}
//             onChangeText={(password) => setPassword(password)}
//           />
//         </View>

//         <TouchableOpacity style={styles.primaryButton} onPress={onSignUpPress}>
//           <Text style={styles.primaryButtonText}>Sign up</Text>
//         </TouchableOpacity>

//         <View style={styles.footer}>
//           <Text>Have an account?</Text>

//           <TouchableOpacity
//             style={styles.secondaryButton}
//             onPress={onSignInPress}
//           >
//             <Text style={styles.secondaryButtonText}>Sign in</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
    
//   );
// }
