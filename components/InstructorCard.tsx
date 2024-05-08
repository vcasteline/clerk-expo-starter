import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from "./Styles";

interface InstructorCardProps {
  name: string;
  category: string;
  image: any;
  onPress: any;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ name, category, image, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...styles.instructorCard, ...styles.spaceBet }}>
      <View style={styles.half}>
        <Text style={styles.subtitleBig}>{name}</Text>
        <Text style={styles.paragraph}>{category}</Text>
      </View>
      <View>
        <Image style={styles.instructorImage} source={image} />
      </View>
    </TouchableOpacity>
  );
};


export default InstructorCard;