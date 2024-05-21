import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { RootStackScreenProps } from "../../types";
import { styles } from "../../components/Styles";
import { Ionicons } from "@expo/vector-icons";
import { getPurchaseRides } from "../../services/GlobalApi";
import { PurchaseRides } from "../../interfaces";

export default function BuyRidesScreen({
  navigation,
  route,
}: RootStackScreenProps<"BuyRides">) {
  const [showPackages, setShowPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PurchaseRides>();
  const [ridePackages, setRidePackages] = useState<PurchaseRides[]>([]);

  const onBackPress = () => navigation.pop();
  useEffect(() => {
    getPurchaseRides()
      .then((response) => {
        const purchaseRideData = response.data.data;
        setRidePackages(purchaseRideData);
      })
      .finally(() => {
        //setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <View style={stylesHere.container}>
      <View style={stylesHere.headingAndButtons}>
        <View style={{ ...styles.heading, marginLeft: 0, marginBottom: 20 }}>
          <TouchableWithoutFeedback onPress={onBackPress}>
            <Ionicons name="chevron-back-outline" size={30} color={"white"} />
          </TouchableWithoutFeedback>
        </View>
        <Text style={{ ...styles.titleText, color: "white" }}>
          Compra Rides
        </Text>

        <Text style={{ ...stylesHere.subtitle, marginLeft: 0 }}>
          Compra más rides para reservar tu bici
        </Text>

        <View style={stylesHere.buttonContainer}>
          <TouchableOpacity
            style={[stylesHere.button, showPackages && stylesHere.activeButton]}
            onPress={() => setShowPackages(true)}
          >
            <Text
              style={[
                stylesHere.buttonText,
                showPackages && stylesHere.activeButtonText,
              ]}
            >
              Paquetes de Rides
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              stylesHere.button,
              !showPackages && stylesHere.activeButton,
            ]}
            onPress={() => setShowPackages(false)}
          >
            <Text
              style={[
                stylesHere.buttonText,
                !showPackages && stylesHere.activeButtonText,
              ]}
            >
              Rides Singulares
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={stylesHere.dashboard}>
        {showPackages ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={stylesHere.carousel}
          >
            {ridePackages
              ?.filter(
                (ridePackage: PurchaseRides) => ridePackage.attributes.esUnPack
              )
              .map((ridePackage: PurchaseRides) => (
                <TouchableOpacity
                  key={ridePackage.id}
                  style={[
                    stylesHere.packageButton,
                    selectedPackage?.id === ridePackage.id &&
                      stylesHere.selectedPackageButton,
                  ]}
                  onPress={() => setSelectedPackage(ridePackage)}
                >
                  <View style={stylesHere.packageTextBox}>
                    <Text style={stylesHere.packageName}>
                      {ridePackage.attributes.numeroDeRides} Rides
                    </Text>
                    <Text style={stylesHere.packageDescription}>
                      Eleva tu Físico
                    </Text>
                    <Text style={stylesHere.packagePrice}>
                      ${ridePackage.attributes.precio}
                    </Text>
                  </View>
                  <Text style={stylesHere.packageExpiration}>
                    Expira en 30 días
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={stylesHere.containerSingle}>
              {ridePackages
                ?.filter(
                  (ridePackage: PurchaseRides) =>
                    !ridePackage.attributes.esUnPack
                )
                .map((ridePackage: any) => (
                  <TouchableOpacity
                    key={ridePackage.id}
                    style={[
                      stylesHere.item,
                      ridePackage.bestValue && stylesHere.bestValue,
                      selectedPackage?.id === ridePackage.id &&
                        stylesHere.selectedPackageButton,
                    ]}
                    onPress={() => setSelectedPackage(ridePackage)}
                  >
                    <Text
                      style={[
                        stylesHere.rides,
                        selectedPackage?.id === ridePackage.id &&
                          stylesHere.whiteText,
                      ]}
                    >
                      {ridePackage.attributes.numeroDeRides} Rides
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <Text
                        style={[
                          stylesHere.price,
                          selectedPackage?.id === ridePackage.id &&
                            stylesHere.whiteText,
                        ]}
                      >
                        ${ridePackage.attributes.precio}
                      </Text>
                    </View>

                    <Text
                      style={[
                        stylesHere.expiration,
                        selectedPackage?.id === ridePackage.id &&
                          stylesHere.whiteText,
                      ]}
                    >
                      Expira en 60 días
                    </Text>
                    {ridePackage.bestValue && (
                      <Text style={stylesHere.bestValueText}>Best Value</Text>
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        )}
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={stylesHere.buyButtonText}>
            Comprar{" "}
            {selectedPackage
              ? selectedPackage.attributes.numeroDeRides
              : "Paquetes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stylesHere = StyleSheet.create({
  containerSingle: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
  },
  item: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#CDCDCD",
    width: "100%",
  },
  whiteText: {
    color: "white",
  },
  rides: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  expiration: {
    fontSize: 14,
    color: "#888",
  },
  bestValue: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  bestValueText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonTwo: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonTextTwo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedPackageButton: {
    backgroundColor: "#3D4AF5",
  },
  packageTextBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    paddingHo: 0,
    paddingTop: 75,
    backgroundColor: "#000",
  },
  headingAndButtons: {
    paddingHorizontal: 24,
  },
  dashboard: {
    // flex:1,
    borderRadius: 30,
    padding: 18,
    marginTop: 10,
    paddingBottom: 90,
    width: "100%",
    height: "74%",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 15,
    marginRight: 3,
    backgroundColor: "#1D1D1D",
  },
  activeButton: {
    backgroundColor: "#F6FD91",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "white",
  },
  activeButtonText: {
    color: "black",
  },
  carousel: {
    marginBottom: 0,
  },
  packageButton: {
    width: 200,
    padding: 20,
    backgroundColor: "#698ED5",
    borderRadius: 20,
    marginRight: 10,
    // flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  packageName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
    textAlign: "center",
  },
  packageDescription: {
    fontSize: 12,
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
  packagePrice: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
    textAlign: "center",
  },
  packageDuration: {
    fontSize: 12,
    color: "#D6D3D3",
    marginBottom: 5,
  },
  packageExpiration: {
    marginTop: 20,
    fontSize: 10,
    color: "ghostwhite",
    marginBottom: 10,
  },
  packageRides: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  singleRideContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buyButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
});
