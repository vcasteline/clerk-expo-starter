import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import ClassCard from "../../components/ClassCard";
import CalendarStrip from "react-native-calendar-strip";
import { getClassesScheduleScreen } from "../../services/GlobalApi";
import { Ionicons } from "@expo/vector-icons";
import { Class } from "../../interfaces";

export default function ScheduleScreen({
  navigation,
  route,
}: RootStackScreenProps<"Schedule">) {
  const stylesHere = StyleSheet.create({
    dashboard: {
      borderRadius: 30,
      padding: 18,
      marginTop: 0,
      paddingBottom: 40,
      width: "100%",
      height: 630,
      backgroundColor: "#fff",
    },
  });

  useEffect(() => {
    getClassesScheduleScreen()
      .then((response: { data: { data: any } }) => {
        const allClasses = response.data.data;
        setClasses(allClasses);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, []);

  const getDayOfWeek = (dateString: string): string => {
    const daysOfWeek = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  };
  const [hasClicked, setHasClicked] = useState(false);
  const [convertedDate, setConvertedDate] = useState("");
  const [rawDate, setRawDate] = useState(Object);
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    getClassesScheduleScreen()
      .then((response: { data: { data: any } }) => {
        const allClasses = response.data.data;
        setClasses(allClasses);
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };
  const getFilteredClasses = (date: any) => {
    const diaSelecionado = getDayOfWeek(date);
    setHasClicked(true);
    const filtered = classes.filter(
      (clase: { attributes: { diaDeLaSemana: string } }) =>
        clase.attributes.diaDeLaSemana === diaSelecionado
    );
    setFilteredClasses(filtered);
  };

  const convertDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    setConvertedDate(formattedDate);
  };

  const getFilteredClassesAndDate = (date: any) => {
    getFilteredClasses(date);
    convertDate(date);
    setRawDate(date);
  };

  function redondearHora(hora: string) {
    const [horas, minutos, segundos, milisegundos] = hora.split(":");
    const minutosRedondeados = Math.round(Number(minutos) / 5) * 5;
    const horaRedondeada = `${horas}:${String(minutosRedondeados).padStart(
      2,
      "0"
    )}`;
    return horaRedondeada;
  }
  function redondearHoraHelp(hora: string) {
    const [horas, minutos, segundos, milisegundos] = hora.split(":");
    const minutosRedondeados = Math.round(Number(minutos) / 5) * 5;
    return {
      horas: Number(horas),
      minutos: minutosRedondeados,
    };
  }

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <Text style={{ ...styles.titleText, color: "white" }}>Horario</Text>
      </View>
      <View style={{ width: "100%" }}>
        <CalendarStrip
          leftSelector={[]}
          rightSelector={[]}
          numDaysInWeek={7}
          style={{ height: 100, paddingTop: 6, paddingBottom: 0 }}
          daySelectionAnimation={{
            type: "background",
            duration: 200,
            highlightColor: "#F6FD91",
          }}
          highlightDateNumberStyle={{ color: "black" }}
          highlightDateNameStyle={{ color: "black" }}
          onDateSelected={(date) => getFilteredClassesAndDate(date)}
          calendarHeaderStyle={{
            color: "white",
            alignItems: "flex-start",
            textAlign: "left",
            fontSize: 14,
            fontWeight: "400",
          }}
          innerStyle={{
            paddingHorizontal: 20,
          }}
          calendarHeaderContainerStyle={{
            marginLeft: 11,
            marginBottom: 15,
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
          dateNumberStyle={{ color: "white", fontWeight: "500" }}
          dateNameStyle={{ color: "white" }}
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={stylesHere.dashboard}
      >
        {!hasClicked ? (
          <View>
            <Text
              style={{
                ...styles.subtitleBig,
                textAlign: "center",
                color: "#3D4AF5",
                fontWeight: "normal",
                marginTop: 100,
              }}
            >
              Has click en un día para ver clases disponibles
            </Text>
            <Ionicons
              style={{ textAlign: "center" }}
              name="happy-outline"
              color={"#3D4AF5"}
              size={30}
            />
          </View>
        ) : filteredClasses.length == 0 ? (
          <View>
            <Text
              style={{
                ...styles.subtitleBig,
                textAlign: "center",
                color: "#3D4AF5",
                fontWeight: "normal",
                marginTop: 100,
              }}
            >
              No hay clases en este día
            </Text>
            <Ionicons
              style={{ textAlign: "center" }}
              name="sad-outline"
              color={"#3D4AF5"}
              size={30}
            />
          </View>
        ) : (
          filteredClasses.map((classItem) => {
            const totalBicycles =
              classItem.attributes.room.data.attributes.bicycles.data.length;
            const reservedBicycles = 0; // Aquí debes obtener el número de bicicletas reservadas para esa clase
            const availableSpots = totalBicycles - reservedBicycles;
            const classDate = new Date(rawDate);
            const { horas, minutos } = redondearHoraHelp(
              classItem.attributes.horaInicio
            );

            classDate.setHours(horas, minutos, 0, 0);

            const currentDate = new Date();

            const isPastClass = classDate < currentDate;
            return (
              <ClassCard
                key={classItem.id}
                onPress={() =>
                  navigation.navigate("BikeSelection", {
                    instructor: {
                      name: classItem.attributes.instructor.data.attributes
                        .nombreCompleto,
                      image:
                        process.env.EXPO_PUBLIC_IMG_URL +
                        classItem.attributes.instructor.data.attributes
                          .fotoPerfil.data.attributes.url,
                    },
                    convertedDate: convertedDate ? convertedDate : null,
                    rawDate: rawDate.toISOString().slice(0, 11),
                    time: redondearHora(classItem.attributes.horaInicio),
                    timeFin: redondearHora(classItem.attributes.horaFin),
                    classId: classItem.id,
                    className: classItem.attributes.nombreClase,
                    dia: classItem.attributes.diaDeLaSemana,
                  })
                }
                image={{
                  uri:
                    process.env.EXPO_PUBLIC_IMG_URL +
                    classItem.attributes.instructor.data.attributes.fotoPerfil
                      .data.attributes.url,
                }}
                date={null}
                className={classItem.attributes.nombreClase}
                time={redondearHora(classItem.attributes.horaInicio)}
                instructor={
                  classItem.attributes.instructor.data.attributes.nombreCompleto
                }
                spots={availableSpots}
                isPastClass={isPastClass}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
