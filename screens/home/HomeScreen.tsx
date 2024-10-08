import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, ScrollView, TouchableWithoutFeedback } from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import ClassCard from "../../components/ClassCard";
import InstructorCard from "../../components/InstructorCard";
import { getInstructors, getUserBookings } from "../../services/GlobalApi";
import { Ionicons } from "@expo/vector-icons";
import { Instructor, User, Booking } from "../../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "../../services/AuthService";
import SpinningLogo from "../../components/SpinningLogo";
import { RefreshControl } from "react-native";

export default function HomeScreen({
  navigation,
  route,
}: RootStackScreenProps<"Home">) {
  const onInstructorPress = (instructor: Instructor) => {
    navigation.navigate<"Instructor">("Instructor", {
      instructorData: instructor,
    });
  };
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const userData = await getMe(token);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getInstructors()
      .then((response) => {
        const instructorsData = response.data.data;
        setInstructors(instructorsData);
      })
      .catch((error) => {
        console.error("Error getting instructors: ", error);
      });

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

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token && user) {
          const bookingsData = await getUserBookings(token, user.id);
          setUserBookings(bookingsData);
        }
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };

    fetchUserBookings();
  }, [user]);

  const convertDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate;
  };

  function redondearHora(hora: string) {
    const [horas, minutos] = hora.split(":");
    const minutosRedondeados = Math.round(Number(minutos) / 5) * 5;
    const nuevaHora = `${horas}:${minutosRedondeados
      .toString()
      .padStart(2, "0")}`;
    return nuevaHora;
  }

  const stylesHere = StyleSheet.create({
    container: {
      padding: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    rides: {
      // flex: 1,
      marginBottom: 10,
    },
    ridesSection: {
      marginBottom: 0,
    },
    logoImage: {
      width: 90,
      resizeMode: "contain",
      justifyContent: "flex-start",
    },
    iconImage: {
      width: 20,
      height: 20,
      resizeMode: "contain",
      marginTop: -5,
      marginRight: 10,
    },
    heading: {
      display: "flex",
      justifyContent: "flex-start",
      textAlign: "left",
      width: "100%",
      marginLeft: 60,
      marginBottom: 0,
    },
    dashboard: {
      borderRadius: 30,
      padding: 24,
      marginTop: 20,
      paddingBottom: 40,
      width: "100%",
      height: '90%',
      justifyContent: "flex-start",
      backgroundColor: "#fff",
    },
    boxTitle: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: 16,
      marginBottom: 24,
    },
    boxContent: {
      textAlign: "center",
      color: "white",
      fontSize: 30,
      marginTop: 0,
      marginBottom: 7,
      fontWeight: "800",
    },
    boxContentBottom: {
      textAlign: "center",
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
    containerInside: {
      flex: 1,
      backgroundColor: "#000000",      
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 50,
    },
    iconBg: {
      backgroundColor: "#3D4AF5",
      borderRadius: 50,
      padding: 10,
    },
    box: {
      backgroundColor: "#141414",
      borderRadius: 24,
      padding: 25,
      height: 135,
      width: 170,
    }
  });

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
      <View style={stylesHere.containerInside}>
        <View style={stylesHere.heading}>
          <Image
            style={stylesHere.logoImage}
            source={require("../../assets/images/volta-logo-white.png")}
          />
        </View>      
          <View style={styles.center}>
          <View style={stylesHere.box}>
            <Text style={{...stylesHere.boxContentBottom, fontWeight: '700', marginBottom: 10, fontSize: 11, color:"white"}}>RIDES</Text>
            <Text style={stylesHere.boxContent}>
              {!loading && userBookings
                ? user?.past_bookings?.length
                : "-"}
            </Text>
            <Text style={stylesHere.boxContentBottom}>
              {userBookings?.filter(
                    (booking: Booking) =>
                      booking.attributes.bookingStatus === "completed"
                  ).length === 1 ? "Realizado" : "Realizados"}
            </Text>
          </View>
          <View style={stylesHere.box}>
          <Text style={{...stylesHere.boxContentBottom, fontWeight: '700', marginBottom: 10, fontSize: 11, color:"white"}}>CREDITOS</Text>

            <Text style={stylesHere.boxContent}>
              {!loading && user ? user.clasesDisponibles : "-"}
            </Text>
            <Text style={stylesHere.boxContentBottom}>Disponibles</Text>
          </View>
        </View>
        <View style={stylesHere.dashboard}>
          <View style={stylesHere.rides}>
            <View style={styles.spaceBet}>
              <Text style={styles.titleText}>Próximos Rides</Text>
              <TouchableWithoutFeedback onPress={()=> navigation.navigate('NextRides', {user: user, bookings: userBookings})}>
                 <Ionicons name="chevron-forward-outline" size={30} />
              </TouchableWithoutFeedback>
            </View>
            <View style={stylesHere.ridesSection}>
              {userBookings.filter(
                    (booking: Booking) =>
                      booking.attributes.bookingStatus === "completed"
                  ).length === 0 ? (
                <View>
                  <Text
                    style={{
                      ...styles.subtitle,
                      textAlign: "center",
                      marginTop: 40,
                      marginBottom: 10,
                      color: "#3D4AF5",
                      fontWeight: "400",
                    }}
                  >
                    No has reservado ningún ride, haz click en el horario para
                    ver clases disponibles.
                  </Text>
                  <Ionicons
                    style={{ textAlign: "center", marginBottom: 40 }}
                    name="sad-outline"
                    color={"#3D4AF5"}
                    size={20}
                  />
                </View>
              ) : (
                userBookings
                  .sort(
                    (a, b) =>
                      new Date(a.attributes.fechaHora).getTime() -
                      new Date(b.attributes.fechaHora).getTime()
                  )
                  .filter(
                    (booking: Booking) =>
                      booking.attributes.bookingStatus === "completed"
                  )
                  .slice(0, 2)
                  .map((booking: Booking) => {
                    const usuarioId = user?.id;
                    const clasesDisponibles = user?.clasesDisponibles;
                    const classData =
                      booking?.attributes?.class?.data?.attributes;
                    const instructor = classData?.instructor?.data?.attributes;
                    const instructorImage =
                      instructor?.fotoPerfil?.data?.attributes?.url;
                    const room =
                      booking?.attributes?.class?.data?.attributes?.room?.data
                        ?.attributes?.roomNumber;
                    const bicycle =
                      booking?.attributes?.bicycle?.data?.attributes
                        ?.bicycleNumber;
                    const convertedFecha = convertDate(
                      booking?.attributes?.fechaHora
                    );
                    const horaRedondeadaInicio = redondearHora(
                      classData?.horaInicio
                    );
                    const horaRedondeadaFin = redondearHora(classData?.horaFin);
                    return (
                      <ClassCard
                        key={booking.id}
                        onPress={() =>
                          navigation.navigate("Class", {
                            bookingData: booking,
                            userData: user,
                          })
                        }
                        image={null}
                        date={convertedFecha}
                        className={classData?.nombreClase || ""}
                        time={`${horaRedondeadaInicio} - ${horaRedondeadaFin}`}
                        instructor={instructor?.nombreCompleto || ""}
                        spots={null}
                        isPastClass={false}
                      />
                    );
                  })
              )}
            </View>
          </View>
          <View>
            <View style={styles.spaceBet}>
              <Text style={styles.titleText}>Instructores</Text>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
              {instructors.map((instructor) => {
                return (
                  <InstructorCard
                    key={instructor.id}
                    onPress={() => onInstructorPress(instructor)}
                    name={instructor.attributes.nombreCompleto}
                    category={instructor.attributes.estilo}
                    image={{
                      uri:
                        process.env.EXPO_PUBLIC_IMG_URL +
                        instructor.attributes.fotoPerfil.data.attributes.url,
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
