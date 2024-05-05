import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from "./Styles";

interface InstructorCardProps {
  name: string;
  category: string;
  image: any;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ name, category, image }) => {
  return (
    <TouchableOpacity style={{ ...styles.instructorCard, ...styles.spaceBet }}>
      <View>
        <Text style={styles.titleText}>{name}</Text>
        <Text style={styles.paragraph}>{category}</Text>
      </View>
      <View>
        <Image style={styles.instructorImage} source={image} />
      </View>
    </TouchableOpacity>
  );
};


export default InstructorCard;