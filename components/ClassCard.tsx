import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { styles } from "./Styles";

interface ClassCardProps {
  date: string;
  className: string;
  time: string;
  instructor: string;
  spots: number;
  image: any;
  onPress: any;
}

const ClassCard: React.FC<ClassCardProps> = ({ onPress, date, image = null, className, time, instructor, spots }) => {
  return (
    <TouchableOpacity onPress={onPress} style={stylesHere.container}>
      <View style={stylesHere.dateContainer}>
        {/* {date && <Text style={stylesHere.dateText}>{date}</Text>} */}
        {image && <Image style={styles.instructorImageClass} source={image}/>}
      </View>
      <View style={stylesHere.infoContainer}>
        <Text style={stylesHere.className}>{className}</Text>
        <Text style={stylesHere.timeInstructor}>
          {time} · {instructor}
        </Text>
      </View>
      <View style={stylesHere.spotsContainer}>
        <Text style={stylesHere.spotsText}>{spots}</Text>
      </View>
    </TouchableOpacity>
  );
};

const stylesHere = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderColor:"#888888",
    borderStyle: "solid",
    padding: 10,
    marginBottom: 2,
  },
  dateContainer: {
    backgroundColor: '#F6FD91',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 16,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeInstructor: {
    fontSize: 14,
  },
  spotsContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  spotsText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ClassCard;