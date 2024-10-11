import * as React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { getMe, updateUser } from "../../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneInput from "react-native-phone-number-input";

export default function SettingsProfileScreen({
  navigation,
}: RootStackScreenProps<"SettingsProfile">) {
  const [user, setUser] = React.useState(Object);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("593");
  const [editMode, setEditMode] = React.useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    address: false,
  });
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const phoneInputRef = React.useRef<PhoneInput>(null);
  const [phoneNumberWithoutCode, setPhoneNumberWithoutCode] = React.useState("");

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const userData = await getMe(token);
          setUser(userData);
          setFirstName(userData.nombre);
          setLastName(userData.apellido);
          setEmail(userData.email);
          setAddress(userData.direccion || "");
          
          // Manejar el número de teléfono
          if (userData.telefono) {
            setPhoneNumber(userData.telefono);
            // Asumimos que el código de país es siempre +593 para Ecuador
            if (userData.telefono.startsWith("+593")) {
              setPhoneNumberWithoutCode(userData.telefono.slice(4)); // Remover '+593'
            } else {
              setPhoneNumberWithoutCode(userData.telefono);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setSuccess(false);
      setError(false);
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const updatedUser = await updateUser(
          {
            nombre: firstName,
            apellido: lastName,
            email: email,
            telefono: phoneNumber,
            direccion: address,
          },
          user.id,
          token
        );
        setUser(updatedUser);
      }
      Alert.alert("Éxito", "Tus datos fueron actualizados", [
        {
          text: "Listo",
          style: "default",
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Hubo un error :(",
        "Hubo un error al intentar de cambiar tus datos, revisa que esten correctos e inténtalo de nuevo",
        [
          {
            text: "Listo",
            style: "default",
          },
        ]
      );
    }
  };

  const onBackPress = () => navigation.popToTop();

  const renderField = (label: string, value: string, stateKey: keyof typeof editMode) => (
    <View style={stylesHere.fieldContainer}>
      <View style={stylesHere.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <TouchableWithoutFeedback
          onPress={() => setEditMode({ ...editMode, [stateKey]: !editMode[stateKey] })}
        >
          <Text style={stylesHere.editText}>
            {editMode[stateKey] ? "Cancelar" : "Editar"}
          </Text>
        </TouchableWithoutFeedback>
      </View>
      {editMode[stateKey] ? (
        <TextInput
          autoCapitalize="none"
          value={value}
          style={stylesHere.textInput}
          placeholder={label}
          placeholderTextColor="gray"
          onChangeText={(text) => {
            switch(stateKey) {
              case 'firstName':
                setFirstName(text);
                break;
              case 'lastName':
                setLastName(text);
                break;
              case 'email':
                setEmail(text);
                break;
              case 'address':
                setAddress(text);
                break;
            }
          }}
        />
      ) : (
        <Text style={stylesHere.fieldValue}>{value || "No disponible"}</Text>
      )}
    </View>
  );

  const phoneInput = React.useRef<PhoneInput>(null);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerInside}
    >
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
      </View>
      <View style={stylesHere.titleContainer}>
        <Text style={stylesHere.titleText}>
          Configurar Perfil
        </Text>
      </View>
      <View style={stylesHere.containerHeading}>
        <View style={stylesHere.userInfo}>
          <Text style={stylesHere.userName}>{user?.username || "Usuario"}</Text>
          <Text style={stylesHere.userEmail}>{user?.email || "Email"} </Text>
          <Text style={stylesHere.userEmail}>{"Documento de identidad: " + user?.cedula || "Cédula"} </Text>
        </View>
      </View>
      <ScrollView style={stylesHere.dashboard} contentContainerStyle={stylesHere.scrollContent}>
        {renderField("TU NOMBRE", firstName, "firstName")}
        {renderField("TU APELLIDO", lastName, "lastName")}
        {renderField("TU EMAIL", email, "email")}
        
        <View style={stylesHere.fieldContainer}>
          <View style={stylesHere.labelContainer}>
            <Text style={styles.label}>TU NÚMERO</Text>
            <TouchableWithoutFeedback
              onPress={() => setEditMode({ ...editMode, phoneNumber: !editMode.phoneNumber })}
            >
              <Text style={stylesHere.editText}>
                {editMode.phoneNumber ? "Cancelar" : "Editar"}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          {editMode.phoneNumber ? (
            <PhoneInput
              ref={phoneInput}
              value={phoneNumberWithoutCode}
              defaultCode="EC"
              layout="first"
              onChangeText={(text: string) => setPhoneNumberWithoutCode(text)}
              onChangeFormattedText={(text: string) => setPhoneNumber(text)}
              containerStyle={stylesHere.phoneInputContainer}
              textContainerStyle={stylesHere.phoneInputTextContainer}
              textInputStyle={stylesHere.phoneInputText}
              codeTextStyle={stylesHere.phoneInputCodeText}
              placeholder="Número de teléfono"
            />
          ) : (
            <Text style={stylesHere.fieldValue}>{phoneNumber || "No disponible"}</Text>
          )}
        </View>

        {renderField("TU DIRECCIÓN", address, "address")}

        <TouchableOpacity
          style={[styles.primaryButton, stylesHere.saveButton]}
          onPress={handleSaveChanges}
        >
          <Text style={styles.primaryButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stylesHere = StyleSheet.create({
  containerHeading: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  userEmail: {
    fontSize: 14,
    color: "#666666",
  },
  dashboard: {
    flex: 1,
    borderRadius: 30,
    width: "100%",
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  editText: {
    color: 'blue',
    fontSize: 14,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    paddingLeft: 10, // Añade un poco de padding a la izquierda
  },
  textInput: {
    height: 40,
    borderColor: '#CDCDCD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  phoneInputContainer: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CDCDCD",
    backgroundColor: "#FFF",
  },
  phoneInputTextContainer: {
    backgroundColor: "transparent",
    paddingLeft: 10,
  },
  phoneInputText: {
    fontSize: 16,
    color: "#333",
    height: 40,
  },
  phoneInputCodeText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    marginTop: 20,
  },
  titleContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  titleText: {
    ...styles.titleText,
    marginLeft: 10,
    color: "white",
    textAlign: 'left',
  },
});