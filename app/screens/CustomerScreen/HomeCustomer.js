import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Linking, Alert } from 'react-native';
import { theme } from '../../styles/theme';
import Constants from 'expo-constants';
import { DropdownButton } from '../../components/DropdownButton';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Divider } from '@rneui/base';

import { CustomModal } from '../../components/CustomModal';

import { ROUTES } from '../../constants';
import { UsuarioContext } from '../../context/AllContexts';
import { Ciudad, Encomienda, Images, Pasajero, grupoImg, privImg } from '../../utils/imagenes';
import { get } from '../../common/restService';
import { getToken, removeToken } from '../../common/keyGeneric';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../../utils/helpers';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';


export const HomeCustomer = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleRutas, setModalVisibleRutas] = useState(false);
  const [selectService, setSelectService] = useState("null")
  const { resetReservationPriv, handleIsLoading, rutas, handleRutas, handleSelecRutas, registerForm, handleService, resetReservationEnco, resetReservation, handleBoletoUpdate, userInfo, handleIsConnectionActivate } = useContext(UsuarioContext);

  useFocusEffect(
    useCallback(() => {
      recuperarRutas();
    }, [])
  );

  const closeModal = () => {
    handleBoletoUpdate("")
    modalVisible ?
      setModalVisible(false) :
      setModalVisibleRutas(false)
  };

  const recuperarRutas = async () => {
    const token = await AsyncStorage.getItem('Token');
    console.log("RESERVACIONES", registerForm)
    handleSelecRutas()
    resetReservation()
    resetReservationEnco()
    resetReservationPriv()
    handleBoletoUpdate()

    try {
      console.log("Entroooo")

      handleIsLoading(true)
      const url = `${baseURL()}rutas`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await fetch(url, options);
      const bodyResponse = await respuesta.json();
      console.log("Repusta", bodyResponse)
      handleRutas(bodyResponse)
    } catch (error) {
      console.error("Error al generar rutas", error)
    } finally {
      handleIsLoading(false)
    }
  }

  const GetModalContent = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{ width: "70%", marginBottom: 5 }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false)
              navigation.navigate(ROUTES.RESERVATION)
            }}
          >
            <View style={styles.buttonContent}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "white" }} >Compartido</Text>
              </View>
              <View style={styles.iconContainer}>
                <Image
                  source={Images.grupoImg}
                  style={styles.icon}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ width: "70%" }}>
          <TouchableOpacity
            onPress={() => {
              handleService("privadoT-Q")
              setModalVisible(false)
              navigation.navigate(ROUTES.RESERVATION)
            }}
          >
            <View style={styles.buttonContent}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "white" }} >Privado</Text>
              </View>
              <View style={styles.iconContainer}>
                <Image
                  source={Images.privImg}
                  style={styles.icon}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  };
  const GetModalContentRutas = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{ width: "70%", marginBottom: 15 }}>
          {rutas.map((element) => (
            <TouchableOpacity
              key={element._id}  // Mueve la propiedad key aquí
              onPress={() => {
                if (selectService == "encomienda") {
                  navigation.navigate(ROUTES.HOME_ENCOMIENDA);
                  setModalVisibleRutas(false);
                  handleSelecRutas(element);
                  handleService("encomienda");
                } else {
                  setModalVisible(true);
                  setModalVisibleRutas(false);
                  handleSelecRutas(element);
                  handleService("pasajero");
                }
              }}
            >
              <View style={styles.buttonContent}>
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: "white" }}>{element.ruta.nombre}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <Image
                    source={Images.Viajar}
                    style={styles.icon}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}

        </View>

      </View>
    )
  };
  const phoneNumber = '+593939902785';

  const openWhatsApp = () => {
    const whatsappURL = `https://wa.me/${phoneNumber}`;
    Linking.openURL(whatsappURL);
  };
  return (

    <View
      style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
    >
      <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, height: theme.dimensions.height, backgroundColor: theme.colors.BackGroundWhite }}
      >
        <View style={styles.contentContainer}>
          <View style={{ flex: 0.5, }}>
            <View style={{ flex: 2, justifyContent: "flex-start", marginBottom: 20, marginTop: 20 }}>
              <Text style={{ fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> Descubre nuestros servicios</Text>
            </View>
          </View>
          <View style={{ flex: 3, zIndex: -1, }}>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, }}>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.BackGroundInpu, borderColor: "black", borderWidth: 1, borderRadius: 15, marginHorizontal: 10 }}>
                <TouchableHighlight
                  onPress={() => {
                    setSelectService("pasajero")
                    console.log("RUTAS: ", rutas)
                    setModalVisibleRutas(true)
                  }}
                  underlayColor="transparent"
                >
                  <View>
                    <Image
                      source={Images.Pasajero}
                      style={{
                        width: "100%", height: undefined, aspectRatio: 3.5 / 5, alignSelf: 'center', resizeMode: 'contain'
                      }}
                    />
                    <Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 16 }}>Reservar</Text>
                    <Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 16 }}>boleto</Text>
                    <Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 16, marginBottom: 10 }}>(Compartido)</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.BackGroundInpu, borderColor: "black", borderWidth: 1, borderRadius: 15, marginHorizontal: 10 }}>
                <TouchableHighlight
                  onPress={() => {
                    setSelectService("encomienda")
                    setModalVisibleRutas(true)
                  }}
                  underlayColor="transparent"
                >
                  <View>
                    <Image
                      source={Images.Encomienda}
                      style={{ width: "100%", height: undefined, aspectRatio: 3.5 / 5, alignSelf: 'center', resizeMode: 'contain' }}
                    />
                    <Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 16 }}>Reservar</Text><Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 16 }}>encomienda</Text>
                  </View>
                </TouchableHighlight>

              </View>

            </View>
            {/* <View style={{ marginTop: 30, justifyContent: "flex-start" }}>
              <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> Otros servicios</Text>
            </View> */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20, }}>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.BackGroundInpu, borderColor: "black", borderWidth: 1, borderRadius: 15, marginLeft: 40, marginRight: 40 }}>
                <TouchableHighlight
                  onPress={() => {
                    handleService("priv");
                    navigation.navigate(ROUTES.RESERVATION_CITY)
                  }}
                  underlayColor="transparent"
                >
                  <View>
                    <Image
                      source={Images.Ciudad}
                      style={{ width: "100%", height: undefined, aspectRatio: 3.5 / 3, alignSelf: 'center', resizeMode: 'contain' }}
                    />
                    <Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 16, marginBottom: 10 }}>Ciudad a Ciudad</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      <CustomModal isVisible={modalVisible} closeModal={closeModal} pregunta={"¿Qué tipo de viaje necesita?"} modalContent={<GetModalContent />} />
      <CustomModal isVisible={modalVisibleRutas} closeModal={closeModal} pregunta={"Nuestras principales rutas"} modalContent={<GetModalContentRutas />} />

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.BackGroundWhite,
    width: "100%",
    height: theme.dimensions.height,
    //alignItems: 'center',
    alignItems: "center",
    justifyContent: "center",
    // padding: 10,
  },
  contentContainer: {
    flex: 2,
    width: "100%",
    //height: '100%',
    // alignItems: "stretch",
    padding: 30,
    justifyContent: "flex-start",
    paddingTop: "-1%",
    backgroundColor: "#ffffff",
    width: theme.dimensions.width,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    height: 40,
    margin: 10,
    backgroundColor: theme.colors.ColorGray
  },
  iconContainer: {
    marginLeft: 8, // Adjust the spacing as needed
  },
  icon: {
    width: 29, // Set the width and height of your image
    height: 29,
  },
});
