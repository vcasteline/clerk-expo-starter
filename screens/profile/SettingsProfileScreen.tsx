import * as React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
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
  const [countryCode, setCountryCode] = React.useState(["593"]);
  const [editMode, setEditMode] = React.useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
  });
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

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
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    const fullNumber = "+" + countryCode + phoneNumber;
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
            telefono: fullNumber.length > 11 ? fullNumber : user.telefono,
          },
          user.id,
          token
        );
        setUser(updatedUser);
      }
      setSuccess(true);
      // Éxito al actualizar el usuario
    } catch (error) {
      setError(true);
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const onBackPress = () => navigation.popToTop();

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Ionicons name="chevron-back-outline" size={30} color={"white"} />
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          ...styles.flex,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          marginLeft: 60,
          marginTop: 10,
        }}
      >
        <Text style={{ ...styles.titleText, color: "white" }}>
          Configurar Perfil
        </Text>
      </View>
      <View style={stylesHere.containerHeading}>
        <View style={stylesHere.userInfo}>
          <Text style={stylesHere.userName}>{user?.username}</Text>
          <Text style={stylesHere.userEmail}>{user?.email}</Text>
        </View>
      </View>
      <View style={stylesHere.dashboard}>
        <View
          style={{
            ...styles.spaceBet,
            marginRight: 50,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={styles.label}>TU NOMBRE</Text>
          <TouchableWithoutFeedback
            onPress={() =>
              setEditMode({ ...editMode, firstName: !editMode.firstName })
            }
          >
            <Text style={{ color: "blue" }}>
              {editMode.firstName ? "Cancelar" : "Editar"}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        {editMode.firstName ? (
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              value={firstName}
              style={styles.textInput}
              placeholder="Nombre..."
              placeholderTextColor="gray"
              onChangeText={(name) => setFirstName(name)}
            />
          </View>
        ) : (
          <Text
            style={{ marginLeft: 20, marginVertical: 10, marginBottom: 25 }}
          >
            {user?.nombre}
          </Text>
        )}

        <View
          style={{
            ...styles.spaceBet,
            marginRight: 50,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={styles.label}>TU APELLIDO</Text>
          <TouchableWithoutFeedback
            onPress={() =>
              setEditMode({ ...editMode, lastName: !editMode.lastName })
            }
          >
            <Text style={{ color: "blue" }}>
              {editMode.lastName ? "Cancelar" : "Editar"}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        {editMode.lastName ? (
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              value={lastName}
              style={styles.textInput}
              placeholder="Apellido..."
              placeholderTextColor="gray"
              onChangeText={(name) => setLastName(name)}
            />
          </View>
        ) : (
          <Text
            style={{ marginLeft: 20, marginVertical: 10, marginBottom: 25 }}
          >
            {user?.apellido}
          </Text>
        )}

        <View
          style={{
            ...styles.spaceBet,
            marginRight: 50,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={styles.label}>TU EMAIL</Text>
          <TouchableWithoutFeedback
            onPress={() => setEditMode({ ...editMode, email: !editMode.email })}
          >
            <Text style={{ color: "blue" }}>
              {editMode.email ? "Cancelar" : "Editar"}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        {editMode.email ? (
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              value={email}
              style={styles.textInput}
              placeholder="Email..."
              placeholderTextColor="gray"
              onChangeText={(emailAddress) => setEmail(emailAddress)}
            />
          </View>
        ) : (
          <Text
            style={{ marginLeft: 20, marginVertical: 10, marginBottom: 25 }}
          >
            {user?.email}
          </Text>
        )}

        <View
          style={{
            ...styles.spaceBet,
            marginRight: 50,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={styles.label}>TU NÚMERO</Text>
          <TouchableWithoutFeedback
            onPress={() =>
              setEditMode({ ...editMode, phoneNumber: !editMode.phoneNumber })
            }
          >
            <Text style={{ color: "blue" }}>
              {editMode.phoneNumber ? "Cancelar" : "Editar"}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        {editMode.phoneNumber ? (
          <View style={{ marginBottom: 20 }}>
            {/* @ts-ignore */}
            <PhoneInput
              defaultCode="EC"
              onChangeCountry={(c) => setCountryCode(c.callingCode)}
              layout="first"
              onChangeText={(p) => setPhoneNumber(p)}
              containerStyle={{ width: "100%" }}
              textInputStyle={{ fontSize: 14 }}
              textContainerStyle={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#CDCDCD",
                backgroundColor: "#FFF",
                height: 50,
              }}
              codeTextStyle={{ fontWeight: "400", fontSize: 14 }}
              placeholder="Número"
            />
          </View>
        ) : (
          <Text
            style={{ marginLeft: 20, marginVertical: 10, marginBottom: 25 }}
          >
            {user.telefono}
          </Text>
        )}
        {error && (
          <Text style={{ ...styles.subtitle, color: "red" }}>
            Hubo un error al intentar de cambiar tus datos, revisa que esten
            correctos e inténtalo de nuevo
          </Text>
        )}
        {success && (
          <Text style={{ ...styles.paragraph, color: "green" }}>
            Éxito! Tus datos fueron actualizados
          </Text>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSaveChanges}
        >
          <Text style={styles.primaryButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  containerHeading: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  profilePicture: {
    marginLeft: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
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
  settingsIcon: {
    marginRight: 16,
  },
  title: {
    color: "white",
    fontSize: 20,
  },
  dashboard: {
    borderRadius: 30,
    padding: 24,
    marginTop: 30,
    paddingBottom: 40,
    width: "100%",
    height: 630,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#3D4AF5",
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#3D4AF5",
  },
});
