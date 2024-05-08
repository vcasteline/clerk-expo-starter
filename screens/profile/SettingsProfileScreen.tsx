import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { log } from "../../logger";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsProfileScreen({ navigation }: RootStackScreenProps<"SettingsProfile">) {
  const { user } = useUser();
  const [firstName, setFirstName] = React.useState(user?.firstName || "");
  const [lastName, setLastName] = React.useState(user?.lastName || "");
  const [email, setEmail] = React.useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [phoneNumber, setPhoneNumber] = React.useState(
    user?.primaryPhoneNumber?.phoneNumber || ""
  );

  const handleSaveChanges = async () => {
    try {
      await user?.update({
        firstName: firstName,
        lastName: lastName,
        // primaryEmailAddressId: email,
        // primaryPhoneNumberId: phoneNumber,
      });
      // Éxito al actualizar el usuario
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <Text style={{ ...styles.titleText, color: "white" }}>Edit Profile</Text>
      </View>
      <View style={stylesHere.containerHeading}>
        <Image
          source={{
            uri: "https://utfs.io/f/dd4fb05a-682a-49d6-b708-d847325c3bd8-4jboq.jpg",
          }}
          style={stylesHere.profilePicture}
        />
        <View style={stylesHere.userInfo}>
          <Text style={stylesHere.userName}>{user?.fullName}</Text>
          <Text style={stylesHere.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
      </View>
      <View style={stylesHere.dashboard}>
        
        <TextInput
          style={stylesHere.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />
        <TextInput
          style={stylesHere.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />
        <TextInput
          style={stylesHere.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={stylesHere.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={stylesHere.saveButton} onPress={handleSaveChanges}>
          <Text style={stylesHere.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  containerHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  profilePicture: {
    marginLeft: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white'
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  settingsIcon: {
    marginRight: 16,
  },
  title: {
    color: "white",
    fontSize: 20,
  },
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#3D4AF5",
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#3D4AF5",
  },
});
