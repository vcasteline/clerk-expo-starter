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
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../utils/UserContext";
import PhoneInput from "react-native-phone-number-input";

export default function EnterNumberScreen({
  navigation,
}: RootStackScreenProps<"EnterNumber">) {
  const { user, setUser } = React.useContext(UserContext);
  const phoneInput = React.useRef<PhoneInput>(null);

  const onNextPress = () => navigation.navigate("SignUp");
  const onBackPress = () => navigation.pop();


  const stylesHere = StyleSheet.create({
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
      <View style={{ ...stylesHere.heading, marginTop: 40 }}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
        <Text style={{ ...styles.titleText, color: "white", marginTop: 20 }}>
          Numero de Telefono{" "}
        </Text>
        <Text style={{ ...styles.paragraph, color: "white" }}>
          Provee tu numero de telefono{" "}
        </Text>
      </View>

      <View style={stylesHere.inputs}>
        {/* <Text style={{...styles.subtitle, marginVertical: 20, marginLeft:10}}>¿Como te llamas?</Text> */}
        <Text style={styles.label}>NUMERO DE TELF</Text>
        {/* @ts-ignore */}
        <PhoneInput
            ref={phoneInput}
            defaultValue={user.number}
            defaultCode="EC"
            layout="first"
            onChangeText={
                (text) => setUser({ ...user, number: text })
            }
            withShadow
            autoFocus
          />
        <TextInput></TextInput>
        <View style={{ ...styles.footer, marginTop: 0 }}>
          <TouchableOpacity style={styles.primaryButton} onPress={onNextPress}>
            <Text style={styles.primaryButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
