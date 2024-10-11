import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
  Alert,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { logoutUser, getMe } from "../../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../utils/AuthContext";
import { UserContext } from "../../utils/UserContext";
import SpinningLogo from "../../components/SpinningLogo";
import { RefreshControl } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { deleteUser } from '../../services/AuthService';

export default function MyProfileScreen({
  navigation,
}: RootStackScreenProps<"MyProfile">) {
  const [userHere, setUserHere] = useState(Object);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const fetchUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const userData = await getMe(token);
        setUserHere(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, [fetchUserData]);

  const { setAuth } = React.useContext(AuthContext);
  const { setUser } = React.useContext(UserContext);
  const onSignOutPress = async () => {
    try {
      const success = await logoutUser();
      if (success) {
        setAuth({ isSignedIn: false });
        setUser({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          number: "",
          email: "",
          password: "",
        });
        navigation.reset({
          index: 0,
          routes: [{ name: "SignIn" }],
        });
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
  const onChangePasswordPress = () => navigation.navigate("ChangePassword");
  const onPaymentMethodPress = () => navigation.navigate("MyCards", {
    username: userHere.username,
    userId: userHere.id,
    email: userHere.email
  });
  const onPoliticasVoltaPress = () => {
    Linking.openURL('https://voltaec.com/politicas-volta/');
  };

  const onTerminosCondicionesPress = () => {
    Linking.openURL('https://voltaec.com/terminos-y-condiciones/');
  };

  const onDeleteAccountPress = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "Esta acción es irreversible. Por favor, ingresa tu email para confirmar.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
            // Prompt para ingresar el email
            Alert.prompt(
              "Confirmar eliminación",
              "Ingresa tu email para confirmar la eliminación de tu cuenta",
              [
                {
                  text: "Cancelar",
                  style: "cancel"
                },
                {
                  text: "Eliminar cuenta",
                  onPress: async (email) => {
                    if (email === userHere.email) {
                      try {
                        const token = await AsyncStorage.getItem("userToken");
                        if (token) {
                          const { success, message } = await deleteUser(token);
                          if (success) {
                            setAuth({ isSignedIn: false });
                            setUser({
                              firstName: "",
                              lastName: "",
                              dateOfBirth: "",
                              number: "",
                              email: "",
                              password: "",
                            });
                            navigation.reset({
                              index: 0,
                              routes: [{ name: "SignIn" }],
                            });
                          } else {
                            Alert.alert("Error", `No se pudo eliminar la cuenta: ${message}`);
                          }
                        }
                      } catch (error) {
                        console.error("Error al eliminar la cuenta:", error);
                        Alert.alert("Error", "Ocurrió un error inesperado al eliminar la cuenta. Por favor, inténtalo de nuevo más tarde.");
                      }
                    } else {
                      Alert.alert("Error", "El email ingresado no coincide con tu email registrado.");
                    }
                  }
                }
              ],
              "plain-text",
              "",
            );
          }
        }
      ]
    );
  };

  return loading ? (
    <View style={styles.loadingScreen}>
      <SpinningLogo />
    </View>
  ) : (
    <ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
    <View style={styles.containerInside}>
      {!loading && userHere ? (
        <>
          <View style={{ ...styles.heading, justifyContent: "space-between" }}>
            <Text style={{ ...styles.titleText, color: "white" }}>Perfil</Text>
            <View style={stylesHere.smallBox}>
              <Image
                style={stylesHere.iconImage}
                source={require("../../assets/images/wheel-icon.png")}
              />
              <Text style={{ color: "white" }}>
                {userHere ? userHere.clasesDisponibles : "..."}
              </Text>
            </View>
          </View>
          <View style={stylesHere.containerHeading}>
            <View style={stylesHere.profileIcon}>
              <Ionicons name="happy-outline" size={30} />
            </View>
            <View style={stylesHere.userInfo}>
              <Text style={stylesHere.userName}>{userHere.username}</Text>
              <Text style={stylesHere.userEmail}>{userHere.email}</Text>
            </View>
            <TouchableWithoutFeedback onPress={onSettingsPress}>
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
                onPress={onPaymentMethodPress}
              >
                <View style={stylesHere.textAndIcon}>
                  <Ionicons name="wallet" size={24} color="#3D4AF5" />
                  <Text style={stylesHere.buttonText}>Método de Pago</Text>
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
                onPress={onPoliticasVoltaPress}
              >
                <View style={stylesHere.textAndIcon}>
                  <Ionicons name="shield-half" size={24} color="#3D4AF5" />
                  <Text style={stylesHere.buttonText}>Políticas Volta</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={stylesHere.button}
                onPress={onTerminosCondicionesPress}
              >
                <View style={stylesHere.textAndIcon}>
                  <Ionicons name="document-text" size={24} color="#3D4AF5" />
                  <Text style={stylesHere.buttonText}>Términos y Condiciones</Text>
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
                  <Text style={stylesHere.buttonText}>Cerrar Sesión</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[stylesHere.button, { borderColor: 'red' }]}
                onPress={onDeleteAccountPress}
              >
                <View style={stylesHere.textAndIcon}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                  <Text style={[stylesHere.buttonText, { color: 'red' }]}>Eliminar Cuenta</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Otros componentes... */}
        </>
      ) : (
        <Text>Cargando...</Text>
      )}
    </View>
    </ScrollView>
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
    backgroundColor: "#F6FD91",
    borderRadius: 60,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  smallBox: {
    backgroundColor: "#141414",
    paddingHorizontal: 15,
    paddingVertical: 0,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 60,
  },
  iconImage: {
    marginRight: 10,
    width: 15,
    height: 15,
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
    height: "100%",
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
    marginVertical: 7,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
  },
  buttonText: {
    marginLeft: 10,
    fontWeight: "500",
    fontSize: 16,
    color: "black",
  },
});