import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessfulScreen({
  navigation,
  route,
}: RootStackScreenProps<"Successful">) {
  const { instructor, date, startTime, endTime, bicycleNumber, dayOfWeek } =
    route.params;

  const stylesHere = StyleSheet.create({
    tag: {
      backgroundColor: "#F6FD91",
      borderRadius: 30,
      borderColor: "black",
      borderWidth: 1,
      height: 30,
      width: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 0,
      marginRight: 3,
    },
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: "10%",
      paddingBottom: 40,
      width: "100%",
      height: "90%",
      justifyContent: "flex-start",
      backgroundColor: "#fff",
    },
    containerInside: {
      flex: 1,
      //   backgroundColor: "#3D4AF5",
      backgroundColor: "#000",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 0,
      padding: 30,
    },
    box: {
      backgroundColor: "#EDF3FF",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: 24,
      padding: 30,
      height: 125,
      width: 183,
    },
    boxTitle: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: 16,
      marginBottom: 24,
    },
    boxContent: {
      textAlign: "center",
      color: "white",
      fontSize: 40,
      marginBottom: 7,
      fontWeight: "800",
    },
    boxContentBottom: {
      textAlign: "left",
      fontSize: 16,
      //color: "rgba(255, 255, 255, 0.8)",
    },
    boxContentBottomTwo: {
      textAlign: "left",
      fontSize: 15,
      //color: "white",
    },
    instructorImage: {
      marginLeft: 0,
      width: 300,
      height: 154,
      borderRadius: 10,
      borderColor: "black",
      borderWidth: 2,
      marginBottom: 16,
      marginTop: 16,
    },
    classHeading: {
      //marginLeft: 50,
      alignItems: "center",
    },
    boxBig: {
      backgroundColor: "#282828",
      padding: 20,
      borderRadius: 30,
      marginTop: 20,
    },
  });

  const onSeeMorePress = () => navigation.popToTop();
  return (
    <View style={stylesHere.containerInside}>
      <View style={{ ...stylesHere.classHeading }}>
        <Text
          style={{
            ...styles.subtitleBig,
            color: "white",
            width: "100%",
            marginLeft: 0,
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          {`Listo! Ride con ${instructor.substring(
            0,
            instructor.indexOf(" ")
          )}`}{" "}
        </Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 0, width: "100%" }}>
        <View
          style={{
            ...styles.spaceBet,
            alignItems: "center",
            marginTop: 0,
            width: "100%",
          }}
        >
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            Día
          </Text>
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            {dayOfWeek}, {date}
          </Text>
        </View>
        <View
          style={{
            ...styles.spaceBet,
            alignItems: "center",
            marginTop: 0,
            width: "100%",
          }}
        >
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            Hora
          </Text>
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            {startTime} - {endTime}
          </Text>
        </View>
        <View
          style={{
            ...styles.spaceBet,
            alignItems: "center",
            marginTop: 0,
            width: "100%",
          }}
        >
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            Tu bici
          </Text>
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            {bicycleNumber}
          </Text>
        </View>
        <View
          style={{
            ...styles.spaceBet,
            alignItems: "center",
            marginTop: 0,
            width: "100%",
          }}
        >
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            Instructor{" "}
          </Text>
          <Text
            style={{ ...styles.paragraph, color: "white", fontWeight: "400" }}
          >
            {instructor}
          </Text>
        </View>
      </View>
      <View style={stylesHere.boxBig}>
        <View
          style={{
            alignItems: "center",
            marginTop: 0,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: 10,
              fontSize: 18,
            }}
          >
            ¡Evita atrasos!
          </Text>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            Sabemos que a veces no puedes llegar a clase, recuerda que puedes
            cancelar tu clase hasta 12 horas antes.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ width: 25, alignItems: "center" }}>
              <Ionicons name="hand-right" color={"#F6FD91"} size={20} />
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: 10,
                flex: 1,
              }}
            >
              Las puertas para entrar se abren únicamente al final de la primera
              y la segunda canción (lo sentimos, no podemos interrumpirlas).
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ width: 25, alignItems: "center" }}>
              <Ionicons name="musical-notes" color={"#F6FD91"} size={20} />
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: 10,
                flex: 1,
              }}
            >
              Tu lugar será liberado entre la primera y la segunda canción, sin
              embargo podrás entrar a la clase bajo disponibilidad.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ width: 25, alignItems: "center" }}>
              <Ionicons name="warning" color={"#F6FD91"} size={20} />
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: 10,
                flex: 1,
              }}
            >
              Al terminar la tercera canción ya nadie puede entrar a la clase
              por seguridad.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              paddingHorizontal: 20,
              marginBottom: 10,
            }}
          >
            <View style={{ width: 25, alignItems: "center" }}>
              <Ionicons name="phone-portrait" color={"#F6FD91"} size={20} />
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: 10,
                flex: 1,
              }}
            >
              Evita usar tu teléfono para que todos disfrutemos la clase.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ width: 25, alignItems: "center" }}>
              <Ionicons name="shirt" color={"#F6FD91"} size={20} />
            </View>
            <Text
              style={{
                color: "white",
                textAlign: "left",
                marginLeft: 10,
                flex: 1,
              }}
            >
              Lleva ropa cómoda que transpire.
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={onSeeMorePress}
        style={{
          ...styles.primaryButton,
          marginTop: 20,
          backgroundColor: "#282828",
        }}
      >
        <Text style={styles.primaryButtonText}>Ver más clases</Text>
      </TouchableOpacity>
    </View>
  );
}
