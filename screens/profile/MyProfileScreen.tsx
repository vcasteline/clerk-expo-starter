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

export default function SafeMyProfileScreen(
  props: RootStackScreenProps<"MyProfile">
) {
  return (
    <>
      <SignedIn>
        <MyProfileScreen {...props} />
      </SignedIn>
      <SignedOut>
        <View style={styles.container}>
          <Text>Unauthorized</Text>
        </View>
      </SignedOut>
    </>
  );
}

function MyProfileScreen({ navigation }: RootStackScreenProps<"MyProfile">) {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [firstName, setFirstName] = React.useState(user?.firstName || "");
  const [lastName, setLastName] = React.useState(user?.lastName || "");
  const [email, setEmail] = React.useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [phoneNumber, setPhoneNumber] = React.useState(
    user?.primaryPhoneNumber?.phoneNumber || ""
  );
  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err: any) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };
  const onSettingsPress = () => navigation.push("SettingsProfile");
  const onRideHistoryPress = () => navigation.push("RideHistory");

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

  const handleButtonPress = (buttonName: string) => {
    console.log(`${buttonName} button pressed`);
    // Agrega la lógica para cada botón aquí
  };
  return (
    <View style={styles.containerInside}>
      <View style={styles.heading}>
        <Text style={{ ...styles.titleText, color: "white" }}>Profile</Text>
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
        <TouchableWithoutFeedback onPress={onSettingsPress}>
          <Ionicons
            name="settings-outline"
            size={24}
            color="white"
            style={stylesHere.settingsIcon}
          />
        </TouchableWithoutFeedback>
        
      </View>
      <View style={stylesHere.dashboard}>
        <View>
          <TouchableOpacity
            style={stylesHere.button}
            onPress={onRideHistoryPress}
          >
            <Ionicons name="time" size={24} color="#3D4AF5" />
            <Text style={stylesHere.buttonText}>Rides History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesHere.button}
            onPress={() => handleButtonPress("Buy Rides")}
          >
            <Ionicons name="bicycle" size={24} color="#3D4AF5" />
            <Text style={stylesHere.buttonText}>Buy Rides</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesHere.button}
            onPress={() => handleButtonPress("Edit password")}
          >
            <Ionicons name="lock-closed" size={24} color="#3D4AF5" />
            <Text style={stylesHere.buttonText}>Edit password</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={stylesHere.button}
            onPress={() => handleButtonPress("Notification")}
          >
            <Ionicons name="notifications" size={24} color="#3D4AF5" />
            <Text style={stylesHere.buttonText}>Notification</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={stylesHere.button}
            onPress={() => handleButtonPress("About App")}
          >
            <Ionicons name="information-circle" size={24} color="#3D4AF5" />
            <Text style={stylesHere.buttonText}>About App</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={stylesHere.button}
            onPress={onSignOutPress}
          >
            <Ionicons name="log-out" size={24} color="#3D4AF5" />
            <Text style={stylesHere.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        {/* <TextInput
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
        </TouchableOpacity> */}
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
    marginRight: 30,
    marginBottom: 10,
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
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   paddingHorizontal: 20,
  // },
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
