import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import ClassCard from "../../components/ClassCard";
import CalendarStrip from "react-native-calendar-strip";

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

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <Text style={{ ...styles.titleText, color: "white" }}>Schedule</Text>
      </View>
      <View style={{width: "100%"}}>
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
            //calendarColor={'#3343CE'}
            calendarHeaderStyle={{color: 'white', alignItems: 'flex-start'}}
            calendarHeaderContainerStyle={{ display:'flex', width: '100%'}}
            dateNumberStyle={{color: 'white'}}
            dateNameStyle={{color: 'white'}}
            />
      </View>
      
      <View style={stylesHere.dashboard}>
       
        <ClassCard
          onPress= {onClassPress}
          image={instructorImage}
          date="Feb 20"
          className="Rider Rythm"
          time="20:30"
          instructor="Sofis Chang"
          spots={20}
        />
        <ClassCard
          onPress={onClassPress}
          image={instructorImage}
          date="Feb 20"
          className="Rider Rythm"
          time="20:30"
          instructor="Valentina Casteline"
          spots={20}
        />
      </View>
      {/* Schedule/fetch classes */}
    </View>
  );
}
