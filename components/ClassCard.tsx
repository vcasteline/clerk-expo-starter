import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ClassCardProps {
  date: string;
  className: string;
  time: string;
  instructor: string;
  spots: number;
}

const ClassCard: React.FC<ClassCardProps> = ({ date, className, time, instructor, spots }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.className}>{className}</Text>
        <Text style={styles.timeInstructor}>
          {time} · {instructor}
        </Text>
      </View>
      <View style={styles.spotsContainer}>
        <Text style={styles.spotsText}>{spots}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 20,
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