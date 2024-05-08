import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import ClassCard from "../../components/ClassCard";
import CalendarStrip from "react-native-calendar-strip";
import { getClassesScheduleScreen } from "../../services/GlobalApi";

interface Class {
  id: number;
  attributes: {
    nombreClase: string;
    horaInicio: string;
    horaFin: string;
    diaDeLaSemana: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
    instructor: {
      data: {
        id: number;
        attributes: {
          nombreCompleto: string;
          fotoPerfil: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
      };
    };
    room: {
      data: {
        id: number;
        attributes: {
          roomNumber: number;
          bicycles: {
            data: {
              id: number;
              attributes: {
                bicycleNumber: number;
                room: number;
              };
            }[];
          };
        };
      };
    };
  };
}

export default function ScheduleScreen({
  navigation,
  route,
}: RootStackScreenProps<"Schedule">) {
  const onClassPress = () => navigation.push("BikeSelection");

  const stylesHere = StyleSheet.create({
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
  });
  const instructorImage = require("../../assets/images/instructor-1.jpg");

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
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek;
  };

  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  const getFilteredClasses = (date: any) => {
    const diaSelecionado = getDayOfWeek(date);
    const filtered = classes.filter(
      (clase: { attributes: { diaDeLaSemana: string } }) =>
        clase.attributes.diaDeLaSemana === diaSelecionado
    );
    setFilteredClasses(filtered);
  };

  function redondearHora(hora: string) {
    const [horas, minutos, segundos, milisegundos] = hora.split(':');
    const minutosRedondeados = Math.round(Number(minutos) / 5) * 5;
    const horaRedondeada = `${horas}:${String(minutosRedondeados).padStart(2, '0')}`;
    return horaRedondeada;
  }

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <Text style={{ ...styles.titleText, color: "white" }}>Schedule</Text>
      </View>
      <View style={{ width: "100%" }}>
        <CalendarStrip
          numDaysInWeek={7}
          style={{ height: 100, paddingTop: 6, paddingBottom: 0 }}
          daySelectionAnimation={{
            type: "background",
            duration: 200,
            highlightColor: "#F6FD91",
          }}
          highlightDateNumberStyle={{ color: "black" }}
          highlightDateNameStyle={{ color: "black" }}
          onDateSelected={(date) => getFilteredClasses(date)}
          calendarHeaderStyle={{ color: 'white', alignItems: 'flex-start' }}
          calendarHeaderContainerStyle={{ display: 'flex', width: '100%' }}
          dateNumberStyle={{ color: 'white' }}
          dateNameStyle={{ color: 'white' }}
        />
      </View>

      <View style={stylesHere.dashboard}>
        {filteredClasses.length == 0 ? (<Text>No classes this day</Text>) : filteredClasses.map((classItem) => {
          const totalBicycles = classItem.attributes.room.data.attributes.bicycles.data.length;
          const reservedBicycles = 0; // Aquí debes obtener el número de bicicletas reservadas para esa clase
          const availableSpots = totalBicycles - reservedBicycles;

          // console.log(classItem.attributes);

          return (
            <ClassCard
              key={classItem.id}
              onPress={onClassPress}
              image={{
                uri: process.env.EXPO_PUBLIC_IMG_URL + classItem.attributes.instructor.data.attributes.fotoPerfil.data.attributes.url
              }}
              date={null}
              className={classItem.attributes.nombreClase}
              time={redondearHora(classItem.attributes.horaInicio)}
              instructor={classItem.attributes.instructor.data.attributes.nombreCompleto}
              spots={availableSpots}
            />
          );
        })}
      </View>
    </View>
  );
}