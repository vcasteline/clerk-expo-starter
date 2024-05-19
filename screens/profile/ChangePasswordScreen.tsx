import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import ClassCard from "../../components/ClassCard";
import InstructorCard from "../../components/InstructorCard";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changePassword, getMe } from "../../services/AuthService";

export default function ChangePasswordScreen({
  navigation,
  route,
}: RootStackScreenProps<"ChangePassword">) {
  const stylesHere = StyleSheet.create({
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 30,
      paddingBottom: 40,
      width: "100%",
      height: 630,
      justifyContent: "flex-start", // Cambia "center" a "flex-start"
      backgroundColor: "#fff",
    },
  });
  const instructorImage = require("../../assets/images/instructor-1.jpg");
  const onBackPress = () => navigation.popToTop();
  const [user, setUser] = useState(Object);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [success, setSuccess] = useState(false);

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
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setSuccess(false);
      //   setError(false);
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        await changePassword(
          currentPassword,
          newPassword,
          newPasswordConfirm,
          token
        );
      }
      setSuccess(true);
      // Éxito al actualizar el usuario
    } catch (error) {
      //   setError(true);
      console.error("Error al actualizar el usuario:", error);
    }
  };

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
          Cambiar Clave
        </Text>
      </View>

      {/* <View style={styles.centerToLeft}>
        <Text style={styles.description}>
          Registro de tu historia en Volta.
        </Text>
      </View> */}
      <View style={stylesHere.dashboard}>
        <View>
          <Text style={styles.label}>CLAVE ACTUAL</Text>
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              value={currentPassword}
              style={styles.textInput}
              placeholder="Clave Actual..."
              placeholderTextColor="gray"
              onChangeText={(password) => setCurrentPassword(password)}
            />
          </View>
          <Text style={styles.label}>NUEVA CLAVE</Text>
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              value={newPassword}
              style={styles.textInput}
              placeholder="Nueva Clave..."
              placeholderTextColor="gray"
              onChangeText={(password) => setNewPassword(password)}
            />
          </View>
          <Text style={styles.label}>CONFIRMAR NUEVA CLAVE</Text>
          <View style={styles.inputView}>
            <TextInput
              autoCapitalize="none"
              value={newPasswordConfirm}
              style={styles.textInput}
              placeholder="Nueva Clave..."
              placeholderTextColor="gray"
              onChangeText={(password) => setNewPasswordConfirm(password)}
            />
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.primaryButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
          {success && (
            <View style={styles.center}>
              <Text
                style={{ ...styles.subtitle, color: "green", marginTop: 20 }}
              >
                Clave cambiada exitosamente!
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* fetch the instructors */}
    </View>
  );
}
