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
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../utils/UserContext";

export default function EnterNameScreen({
  navigation,
}: RootStackScreenProps<"EnterName">) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const { user, setUser } = React.useContext(UserContext);


  const onNextPress = () => navigation.navigate("EnterDOB");
  const onBackPress = () => navigation.pop();

  const stylesHere = StyleSheet.create({
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
      <View style={{...stylesHere.heading,  marginTop: 40}}>
        <TouchableWithoutFeedback onPress={onBackPress}>
             <Ionicons name="chevron-back-outline" size={30} color={'white'}/>
        </TouchableWithoutFeedback>
        <Text style={{ ...styles.titleText, color: "white",  marginTop: 20 }}>
          Tu Información{" "}
        </Text>
        <Text style={{ ...styles.paragraph, color: "white" }}>
          Escribe tu información personal.{" "}
        </Text>
      </View>

      <View style={stylesHere.inputs}>
        {/* <Text style={{...styles.subtitle, marginVertical: 20, marginLeft:10}}>¿Como te llamas?</Text> */}
        <Text style={styles.label}>NOMBRE</Text>
        <View style={styles.inputView}>
          <TextInput
            value={user.firstName}
            style={styles.textInput}
            placeholder="Tu nombre"
            placeholderTextColor="gray"
            onChangeText={(text) => setUser({ ...user, firstName: text })}
          />
        </View>
        <Text style={styles.label}>APELLIDO</Text>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            value={user.lastName}
            style={styles.textInput}
            placeholder="Tu apellido"
            placeholderTextColor="gray"
            onChangeText={(text) => setUser({ ...user, lastName: text })}
          />
        </View>
        <Text style={styles.label}>CÉDULA/PASAPORTE</Text>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize="none"
            value={user.cedula}
            style={styles.textInput}
            placeholder="Número de cédula o pasaporte"
            placeholderTextColor="gray"
            onChangeText={(text) => setUser({ ...user, cedula: text })}
          />
        </View>

        <View style={{...styles.footer, marginTop:0}}>
   
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onNextPress}
          >
            <Text style={styles.primaryButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
