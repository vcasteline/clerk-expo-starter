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
  const onSettingsPress = () => navigation.navigate("SettingsProfile");
  const onRideHistoryPress = () => navigation.navigate("RideHistory");
  const onBuyRidesPress = () => navigation.navigate("BuyRides");
  const onChangePasswordPress = () => navigation.navigate("ChangePassword")

  return (
    <View style={styles.containerInside}>
      {!loading && user ? (
        <>
          <View style={{...styles.heading, justifyContent: 'space-between'}}>
            <Text style={{ ...styles.titleText, color: "white" }}>Perfil</Text>
            <View style={stylesHere.smallBox}>
              <Image
                style={stylesHere.iconImage}
                source={require("../../assets/images/wheel-icon.png")}
              />
              <Text style={{color: 'white'}}>{user ? user.clasesDisponibles: '...'}</Text>
            </View>
          </View>
          <View style={stylesHere.containerHeading}>
            <View style={stylesHere.profileIcon}>
              <Ionicons name='happy-outline' size={30} />
            </View>
            <View style={stylesHere.userInfo}>
              <Text style={stylesHere.userName}>{user.username}</Text>
              <Text style={stylesHere.userEmail}>{user.email}</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={onSettingsPress}
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
                onPress={onBuyRidesPress}
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
                onPress={onChangePasswordPress}
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
  profileIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#F6FD91',
    borderRadius:60,
    marginLeft: 10,
    justifyContent:'center',
    alignItems:'center'
  },
  smallBox: {
    backgroundColor: "#141414",
    paddingHorizontal: 15,
    paddingVertical: 0,
    borderRadius: 10,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'center',
    marginRight:60
  },
  iconImage: {
    marginRight: 10,
    width: 15,
    height: 15
  },
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
