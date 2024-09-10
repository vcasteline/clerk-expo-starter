import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../types";

const { height } = Dimensions.get('window');

export default function PurchaseSummaryScreen({ 
  navigation,
  route 
}: RootStackScreenProps<"PurchaseSummary">) {
  const [selectedCard, setSelectedCard] = useState('Visa ****1234');
  const [showModal, setShowModal] = useState(false);
  const cards = ['Visa ****1234', 'Mastercard ****5678', 'American Express ****9012'];
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const onBackPress = () => navigation.pop();

  const handleBuyPackage = () => {
    console.log('Procesando compra...');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    Animated.timing(rotateAnim, {
      toValue: showModal ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <SafeAreaView style={stylesHere.container}>
      <View style={stylesHere.header}>
        <TouchableOpacity onPress={onBackPress} style={stylesHere.backButton}>
          <Ionicons name="chevron-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={stylesHere.headerTitle}>Resumen de Compra</Text>
      </View>

      <View style={stylesHere.content}>
        <ScrollView contentContainerStyle={stylesHere.scrollContent}>
          <View style={stylesHere.infoContainer}>
            <Text style={stylesHere.sectionTitle}>Paquete:</Text>
            <Text style={stylesHere.sectionContent}>Premium Plan Anual</Text>

            <Text style={stylesHere.sectionTitle}>Precio Total:</Text>
            <Text style={stylesHere.sectionContent}>$99.99</Text>

            <Text style={stylesHere.sectionTitle}>Método de Pago:</Text>
            <TouchableOpacity 
              style={stylesHere.paymentButton}
              onPress={toggleModal}
            >
              <Text style={stylesHere.paymentButtonText}>{selectedCard}</Text>
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Ionicons 
                  name="chevron-down-outline" 
                  size={24} 
                  color="black" 
                />
              </Animated.View>
              
            </TouchableOpacity>
          </View>
                <View style={stylesHere.buyButtonContainer}>
        <TouchableOpacity
          style={stylesHere.buyButton}
          onPress={handleBuyPackage}
        >
          <Text style={stylesHere.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View style={stylesHere.modalContainer}>
          <View style={stylesHere.modalContent}>
            {cards.map((card) => (
              <TouchableOpacity
                key={card}
                style={stylesHere.modalOption}
                onPress={() => {
                  setSelectedCard(card);
                  toggleModal();
                }}
              >
                <Text style={stylesHere.modalOptionText}>{card}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[stylesHere.modalOption, stylesHere.addCardOption]}
              onPress={() => {
                // Lógica para añadir nueva tarjeta
                toggleModal();
              }}
            >
              <Text style={stylesHere.addCardText}>+ Añadir nueva tarjeta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={stylesHere.closeModalButton}
              onPress={toggleModal}
            >
              <Text style={stylesHere.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const stylesHere = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Ajusta este valor según sea necesario
  },
  infoContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  paymentButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  paymentButtonText: {
    fontSize: 16,
  },
  buyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 70,
    paddingTop: 10,
  },
  buyButton: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalOptionText: {
    fontSize: 16,
  },
  addCardOption: {
    borderBottomWidth: 0,
  },
  addCardText: {
    color: 'blue',
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});