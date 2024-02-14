import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, Image } from 'react-native';
import { theme } from '../../../../../styles/theme';
import Constants from 'expo-constants';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { CustomModal } from '../../../../../components/CustomModal';
import { FloatingForm } from '../../../../../components/FloatingForm';
import { ROUTES } from '../../../../../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import { ProgressBarCustom } from '../../../../../components/ProgressBarCustom';
import { Images } from '../../../../../utils/imagenes';
import { UsuarioContext } from '../../../../../context/AllContexts';
import CheckBox from 'react-native-check-box';
import { helpMessages } from '../../../../../common/TermansCondi';
import { Button } from 'react-native-paper';
import { ButtonStyledImg } from '../../../../../components/ButtonStyledImg';

export const Reservation = ({ navigation }) => {
  const [colorReserve, setColorReserve] = useState("");
  const [colorDestina, setColorDestina] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [formulario, setFormulario] = useState("");
  const { userInfo, updateRegisterForm, registerForm, updateRegisterOne, selectRuta, selectService, updateRegisterOneEnco, updateRegisterEnco, updateBoleto, resetReservation, handleSelecRutas, handleDintance } = useContext(UsuarioContext);
  const [numPasseger, setNumPasseger] = useState(updateBoleto ? updateBoleto.numPax : 1)
  const [isSelected, setSelection] = useState(false);
  const [showConditions, setShowConditions] = useState(false)
  useEffect(() => {
    if (updateBoleto) {
      const defaultCity = updateBoleto
        ? updateBoleto.ciudadSalida?.ciudad || updateBoleto.ciudadRemitente?.ciudad : null
      const defaultCityLlegada = updateBoleto
        ? updateBoleto.ciudadLlegada?.ciudad || updateBoleto.ciudadDestinatario?.ciudad : null

      handleSelecRutas({
        "ruta": { "ciudad1": defaultCity, "ciudad2": defaultCityLlegada, "nombre": defaultCity + " - " + defaultCityLlegada },
      })
      handleDintance(updateBoleto.distancia)

      if (updateBoleto?.user.apellido === userInfo.pasajeroApellido && updateBoleto?.user.nombre === userInfo.pasajeroNombre && updateBoleto?.user.phone === "0" + userInfo.phone) {
        handleButtonPress("user")
        updateRegister('user', 'nombre', updateBoleto.user.nombre);
        updateRegister('user', 'apellido', updateBoleto.user.apellido);
        updateRegister('user', 'phone', updateBoleto.user.phone);

      } else { handleButtonPress("otra") }
    }
  }, [])
  const handleButtonPress = (buttonId, state) => {
    // Cambia el botón seleccionado según el id del botón
    setColorReserve((prevButton) => (prevButton === buttonId ? null : buttonId))
  };
  const handleButtonDesti = (buttonId, state) => {
    // Cambia el botón seleccionado según el id del botón
    setColorDestina((prevButton) => (prevButton === buttonId ? null : buttonId))
  };
  const closeModal = () => {

    modalVisible ?
      setModalVisible(false)
      :
      showConditions ?
        setShowConditions(false)
        :
        setModalVisible2(false)

  };

  const updateRegister = async () => {
    if (selectService == "encomienda") {
      updateRegisterEnco('remitente', 'nombre', userInfo?.pasajeroNombre);
      updateRegisterEnco('remitente', 'apellido', userInfo?.pasajeroApellido);
      updateRegisterEnco('remitente', 'phone', "0" + userInfo?.phone);
    } else {
      updateRegisterForm('user', 'nombre', userInfo?.pasajeroNombre);
      updateRegisterForm('user', 'apellido', userInfo?.pasajeroApellido);
      updateRegisterForm('user', 'phone', "0" + userInfo?.phone);
    }

    console.log("DESPUES ", registerForm.user);
  }

  const calculoPasajeros = (operacion) => {
    if (operacion == "suma") {
      setNumPasseger(numPasseger + 1)
    } else {
      setNumPasseger(numPasseger - 1)
    }

  }


  const GetModalContent = () => {
    return (
      <View >
        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
          <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
            <ButtonStyledImg icon={"minus"} iconContainer={true} color={theme.colors.BackGroundInpu} disabled={numPasseger == 1 ? true : false}
              onPress={() => {
                console.log("entro")
                calculoPasajeros("resta")
              }} />
          </View>
          <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
            <ButtonStyledImg text={numPasseger} color={"white"} disabled={true} />
          </View>
          <View style={{ flex: 1, width: "100%", justifyContent: "center", alignItems: "center" }}>
            <ButtonStyledImg icon={"plus"} iconContainer={true} color={theme.colors.ColorGrennButtom} disabled={selectService == "encomienda" ? numPasseger == 4 : numPasseger == 20 ? true : false}
              onPress={() => {
                calculoPasajeros("suma")
              }} style={{ alignItems: "center" }} />
          </View>
        </View>
        <Text style={{ color: '#0f0f0f', textAlign: "center", fontSize: 15, fontWeight: "700" }}>Máximo: 20 pasajeros</Text>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={() => {
            closeModal()
          }} style={{ marginTop: 10, padding: 10, backgroundColor: theme.colors.BackGroundBlue, borderRadius: 18, width: "50%" }}>
            <Text style={{ color: 'white', textAlign: "center" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>


    )
  };
  const GetModalContentPer = () => {
    return (
      <TouchableOpacity onPress={closeModal}>
        <Icon name="closecircleo" size={30} color="white" />
      </TouchableOpacity>
    )
  };


  const GetModalContentOk = () => {
    return (
      <>
        <TouchableOpacity onPress={() => {
          closeModal()
          formulario == "destinatario" ? handleButtonDesti("destinatario") : handleButtonPress("otra")
        }} style={{ marginTop: 10, padding: 10, backgroundColor: theme.colors.BackGroundBlue, borderRadius: 18, width: "50%" }}>
          <Text style={{ color: 'white', textAlign: "center" }}>OK</Text>
        </TouchableOpacity>
      </>
    )
  };

  const GetConditional = () => {
    return (
      <>
        <Text style={{ fontFamily: theme.fonts.inter, fontSize: 18, textAlign: "center", margin: 10, fontWeight: "bold" }}>Condiciones del viaje</Text>
        <Text style={{ fontFamily: theme.fonts.inter, fontSize: 18, marginBottom: 15, textAlign: "justify" }}>
          {helpMessages.Terms.campartidoPax}
        </Text>
      </>
    )
  }

  return (
    <View
      style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
    >
      <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
      <View style={styles.contentContainer}>
        <View style={{ flex: 2.5 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={{ justifyContent: "flex-start", marginBottom: 20, marginTop: 20 }}>
              <Text style={{ fontWeight: "bold", fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> Datos del cliente</Text>
            </View>
            <View style={{ marginTop: 2, marginBottom: 1 }}>
              <Text style={{ fontWeight: "700", fontSize: theme.fontSize.actionText, textAlign: "left" }}> Ruta: {updateBoleto ? updateBoleto.ciudadSalida.ciudad + " - " + updateBoleto.ciudadLlegada.ciudad : selectRuta?.ruta?.nombre} </Text>
            </View>
            <View>
              <ProgressBarCustom step={1} />
            </View>
            <>
              <View style={{ marginTop: 5, marginBottom: 10 }}>
                <Text style={{ fontWeight: "700", fontSize: theme.fontSize.subtitle, textAlign: "left" }}> Reserva para: </Text>
              </View>
              <View style={{ alignItems: "center", marginBottom: 20, flexDirection: "row" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10, width: "50%", height: "100%" }}>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colorReserve == "user" ? theme.colors.Blue : theme.colors.BackGroundInpu, borderColor: "black", borderWidth: 1, borderRadius: 15, marginHorizontal: 5 }}>
                    <TouchableHighlight
                      onPress={() => {
                        handleButtonPress("user")
                        colorReserve == "user" ?
                          handleButtonPress("") : updateRegister();
                      }}
                      underlayColor="transparent"
                    >
                      <View>
                        <Image
                          source={Images.user}
                          style={{ width: "100%", height: undefined, aspectRatio: 4 / 2, alignSelf: 'center', resizeMode: 'contain' }}
                        />
                        <Text style={{ textAlign: 'center' }}>{userInfo?.pasajeroNombre + " " + userInfo?.pasajeroApellido}</Text>
                        <Text style={{ textAlign: 'center' }}>{"0" + userInfo?.phone}</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 15, width: "50%", height: "100%" }}>
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colorReserve == "otra" ? theme.colors.Blue : theme.colors.BackGroundInpu, borderColor: "black", borderWidth: 1, borderRadius: 15, marginHorizontal: 5 }}>
                    <TouchableHighlight
                      onPress={() => {
                        colorReserve == "otra" ?
                          handleButtonPress("") : setModalVisible2(true)
                      }}
                      underlayColor="transparent"
                    >
                      <View>
                        <Image
                          source={Images.otherPerson}
                          style={{ width: "100%", height: undefined, aspectRatio: 4 / 1.5, alignSelf: 'center', resizeMode: 'contain' }}
                        />
                        <Text style={{ textAlign: 'center' }}>Otra persona</Text>
                        {/* {
                            updateBoleto ? (
                              <>
                                <Text style={{ textAlign: 'center' }}>{updateBoleto.user.nombre + " " + userInfo?.pasajeroApellido}</Text>
                                <Text style={{ textAlign: 'center' }}>{"0" + userInfo?.phone}</Text>
                              </>
                            ) : null
                          } */}
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontWeight: "700", fontSize: theme.fontSize.subtitle, textAlign: "left", marginBottom: 20 }}>{selectService == "encomienda" ? "Número de paquetes: " : "Número de pasajeros: "}  </Text>
              <ButtonStyledImg
                text={numPasseger}
                width={'100%'}
                potition={"flex-start"}
                icon={"right"}
                onPress={() => setModalVisible(true)}
                marginStart={15}
                color={theme.colors.BackGroundInpu}
              />
            </View>
          </ScrollView>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            {
              !updateBoleto ?
                <View style={{ flex: 0.3, flexDirection: "row", marginBottom: 30 }}>
                  <View style={{ flex: 0.1, justifyContent: "center" }}>
                    <CheckBox
                      onClick={() => { setSelection(!isSelected) }}
                      isChecked={isSelected}
                      checkBoxColor={theme.colors.ColorGrayButtom}
                    />
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', }}>
                    <Text style={{ fontFamily: theme.fonts.inter, fontSize: 16 }}>
                      Acepto las{' '}
                      <Text onPress={() => setShowConditions(true)} style={{ fontFamily: theme.fonts.inter, fontWeight: "bold", color: theme.colors.Blue, textDecorationLine: "underline" }}>condiciones</Text>
                      {' '}de este viaje
                    </Text>
                  </View>
                </View>
                : null
            }
            <ButtonStyledImg text={"Siguiente"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
              if (isSelected || updateBoleto) {
                if (selectService == "encomienda") {
                  console.log("Color", colorDestina)
                  if (colorReserve == '' && colorDestina == '') {
                    Alert.alert("FORMULARIO", "Por favor, llene todos los campos")
                  } else {
                    selectService == "encomienda" ? updateRegisterOneEnco('numPaquetes', numPasseger) :
                      updateRegisterOne('numPax', numPasseger)
                    navigation.navigate(ROUTES.HORARIOSRES_EDIT)
                  }
                } else {
                  if (colorReserve == '') {
                    Alert.alert("FORMULARIO", "Por favor, llene todos los campos")
                  } else {
                    selectService == "encomienda" ? updateRegisterOneEnco('numPaquetes', numPasseger) :
                      updateRegisterOne('numPax', numPasseger)
                    navigation.navigate(ROUTES.HORARIOSRES_EDIT)
                  }
                }
              } else {
                Alert.alert("Condiciones", "Para continuar con el proceso deberás aceptar las condiciones de viaje.")
              }
            }}
            />
            <ButtonStyledImg text={"Regresar"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
              resetReservation()
              handleSelecRutas("")
              updateBoleto ? navigation.navigate(ROUTES.TRAVEL_LOG) : navigation.goBack()
            }
            }
            />
          </View>
        </View>
        <CustomModal isVisible={modalVisible} closeModal={closeModal} pregunta={selectService == "encomienda" ? "Número de paquetes: " : "Número de pasajeros: "} potition={"flex-end"} modalContent={<GetModalContent />} />
        <FloatingForm isVisible={modalVisible2} pregunta={selectService == "encomienda" ? "Ingresa los datos del destinatario" : "Ingresa los datos de la persona"} modalContent={<GetModalContentPer />} state={formulario}
          modalConten2={<GetModalContentOk />} />
        <CustomModal isVisible={showConditions} closeModal={closeModal} modalContent={<GetConditional />} />
      </View>
    </View>

  );
}

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
    flex: 1,
    width: "100%",
    //height: '100%',
    // alignItems: "stretch",
    padding: 15,
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    width: theme.dimensions.width,
  },
  icon: {
    width: 80, // Set the width and height of your image
    height: 80,
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});