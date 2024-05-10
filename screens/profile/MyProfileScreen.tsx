import React, { useState, useEffect } from "react";
import {
  Image,
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
import { logoutUser, getMe } from "../../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyProfileScreen({
  navigation,
}: RootStackScreenProps<"MyProfile">) {
  const [user, setUser] = useState(Object);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const userData = await getMe(token);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const onSignOutPress = async () => {
    try {
      const success = await logoutUser();
      if (success) {
        navigation.replace("SignIn");
      } else {
        console.error("No se pudo cerrar sesión correctamente.");
      }
    } catch (err) {
      console.error("Error:> " + JSON.stringify(err));
    }
  };
  const onSettingsPress = () => navigation.push("SettingsProfile");
  const onRideHistoryPress = () => navigation.push("RideHistory");

  // const handleSaveChanges = async () => {
  //   try {
  //     await user?.update({
  //       firstName: firstName,
  //       lastName: lastName,
  //       // primaryEmailAddressId: email,
  //       // primaryPhoneNumberId: phoneNumber,
  //     });
  //     // Éxito al actualizar el usuario
  //   } catch (error) {
  //     console.error("Error al actualizar el usuario:", error);
  //   }
  // };

  const handleButtonPress = (buttonName: string) => {
    console.log(`${buttonName} button pressed`);
    // Agrega la lógica para cada botón aquí
  };
  return (
    <View style={styles.containerInside}>
      {!loading && user ? (
        <>
          <View style={styles.heading}>
            <Text style={{ ...styles.titleText, color: "white" }}>Perfil</Text>
          </View>
          <View style={stylesHere.containerHeading}>
            {/* <Image
              source={{ uri: user.profilePicture || "default_image_url" }}
              style={stylesHere.profilePicture}
            /> */}
            <View style={stylesHere.userInfo}>
              <Text style={stylesHere.userName}>{user.username}</Text>
              <Text style={stylesHere.userEmail}>{user.email}</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => navigation.push("SettingsProfile")}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color="white"
                style={stylesHere.settingsIcon}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={stylesHere.dashboard}>
            <View>
              <TouchableOpacity
                style={stylesHere.button}
                onPress={onRideHistoryPress}
              >
                <View style={stylesHere.textAndIcon}>
                  <Ionicons name="time" size={24} color="#3D4AF5" />

                  <Text style={stylesHere.buttonText}>Historial de Rides</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={stylesHere.button}
                onPress={() => handleButtonPress("Buy Rides")}
              >
                <View style={stylesHere.textAndIcon}>
                  <Ionicons name="bicycle" size={24} color="#3D4AF5" />
                  <Text style={stylesHere.buttonText}>Comprar Rides</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={stylesHere.button}
                onPress={() => handleButtonPress("Edit password")}
              >
                <View style={stylesHere.textAndIcon}>
                  <Ionicons name="lock-closed" size={24} color="#3D4AF5" />
                  <Text style={stylesHere.buttonText}>Editar Clave</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={stylesHere.button}
                onPress={onSignOutPress}
              >
                <View style={stylesHere.textAndIcon}>
                  <Ionicons name="log-out" size={24} color="#3D4AF5" />
                  <Text style={stylesHere.buttonText}>Log Out</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Otros componentes... */}
        </>
      ) : (
        <Text>Cargando...</Text>
      )}
    </View>
  );
}

const stylesHere = StyleSheet.create({
  containerHeading: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  // iconContainer: {
  //   backgroundColor: '#3D4AF5',
  //   borderRadius: 10,
  //   padding: 8
  // },
  textAndIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
    marginRight: 30,
    marginBottom: 10,
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
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   paddingHorizontal: 20,
  // },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
  },
  buttonText: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
});
