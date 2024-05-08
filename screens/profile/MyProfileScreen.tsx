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
        <Text style={{ ...styles.titleText, color: "white" }}>Perfil</Text>
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
          <Text style={stylesHere.userEmail}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
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
            <View style={stylesHere.textAndIcon}>
              
                <Ionicons name="time" size={24} color="#3D4AF5" />
            
             
              <Text style={stylesHere.buttonText}>Historial de Rides</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesHere.button}
            onPress={() => handleButtonPress("Buy Rides")}
          >
            <View style={stylesHere.textAndIcon}>
              <Ionicons name="bicycle" size={24} color="#3D4AF5" />
              <Text style={stylesHere.buttonText}>Comprar Rides</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesHere.button}
            onPress={() => handleButtonPress("Edit password")}
          >
            <View style={stylesHere.textAndIcon}>
              <Ionicons name="lock-closed" size={24} color="#3D4AF5" />
              <Text style={stylesHere.buttonText}>Editar Clave</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={stylesHere.button} onPress={onSignOutPress}>
            <View style={stylesHere.textAndIcon}>
              <Ionicons name="log-out" size={24} color="#3D4AF5" />
              <Text style={stylesHere.buttonText}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  containerHeading: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  // iconContainer: {
  //   backgroundColor: '#3D4AF5',
  //   borderRadius: 10,
  //   padding: 8
  // },
  textAndIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "bold",
    color: "white",
  },
  userEmail: {
    fontSize: 14,
    color: "#666666",
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
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
  },
  buttonText: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
});
