import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, Image } from 'react-native';
import { theme } from '../../../../styles/theme';
import Constants from 'expo-constants';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { CustomModal } from '../../../../components/CustomModal';
import { FloatingForm, FloatingFormDestinatario } from '../../../../components/FloatingForm';
import { ROUTES } from '../../../../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import { ProgressBarCustom } from '../../../../components/ProgressBarCustom';
import { Images } from '../../../../utils/imagenes';
import { UsuarioContext } from '../../../../context/AllContexts';
import CheckBox from 'react-native-check-box';
import { helpMessages } from '../../../../common/TermansCondi';
import { ButtonStyledImg } from '../../../../components/ButtonStyledImg';

export const Reservation = ({ navigation }) => {
    const [colorReserve, setColorReserve] = useState("");
    const [colorDestina, setColorDestina] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [formulario, setFormulario] = useState("");
    const [numPasseger, setNumPasseger] = useState(1)
    const { userInfo, updateRegisterForm, registerForm, updateRegisterOne, selectRuta, selectService, updateRegisterOneEnco, updateRegisterEnco, updateBoleto, handleService } = useContext(UsuarioContext);
    const [isSelected, setSelection] = useState(false);
    const [showConditions, setShowConditions] = useState(false)

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
            : modalVisible2 ?
                setModalVisible2(false)
                : setModalVisible3(false)

    };
    useEffect(() => {
        verificateUpdate()
    }, [])
    const verificateUpdate = () => {
        if (updateBoleto) {
            console.log(updateBoleto)
            if (updateBoleto?.remitente.apellido === userInfo.pasajeroApellido && updateBoleto?.remitente.nombre === userInfo.pasajeroNombre && updateBoleto?.remitente.phone === "0" + userInfo.phone) {
                handleButtonPress("user")
                handleButtonDesti("destinatario")
            } else {
                handleButtonPress("otra")
                handleButtonDesti("destinatario")
            }
            updateRegisterEnco('remitente', 'nombre', updateBoleto.remitente.nombre);
            updateRegisterEnco('remitente', 'apellido', updateBoleto.remitente.apellido);
            updateRegisterEnco('remitente', 'phone', updateBoleto.remitente.phone);
            updateRegisterEnco('destinatario', 'nombre', updateBoleto.destinatario.nombre);
            updateRegisterEnco('destinatario', 'apellido', updateBoleto.destinatario.apellido);
            updateRegisterEnco('destinatario', 'phone', updateBoleto.destinatario.phone);
            updateRegisterEnco('turno', 'fecha', updateBoleto.turno.fecha);
            updateRegisterEnco('turno', 'horario', updateBoleto.turno.horario);
            updateRegisterOneEnco('precio', updateBoleto.precio)
            updateRegisterOneEnco('numPaquetes', updateBoleto.numPaquetes)
            handleService("encomienda")
            setNumPasseger(updateBoleto.numPaquetes)
        }
    }

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
                <View style={{ alignItems: "center", flexDirection: "row" }}>
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
                        <ButtonStyledImg icon={"plus"} iconContainer={true} color={theme.colors.ColorGrennButtom} disabled={selectService == "encomienda" ? numPasseger == 8 : numPasseger == 20 ? true : false}
                            onPress={() => {
                                calculoPasajeros("suma")
                            }} style={{ alignItems: "center" }} />
                    </View>
                </View>
                <Text style={{ color: '#0f0f0f', textAlign: "center", fontSize: 15, fontWeight: "700" }}>Máximo: 8 paquetes</Text>

                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => {
                        closeModal()
                    }} style={{ marginTop: 10, padding: 10, backgroundColor: theme.colors.BackGroundBlue, borderRadius: 18, width: "50%" }}>
                        <Text style={{ color: 'white', textAlign: "center" }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View >


        )
    };
    const GetModalContentPer = () => {
        return (
            <TouchableOpacity onPress={closeModal}>
                <Icon name="closecircleo" size={30} color="white" />
            </TouchableOpacity>
        )
    };

    const GetConditional = () => {
        return (
            <>
                <Text style={{ fontFamily: theme.fonts.inter, fontSize: 18, textAlign: "center", margin: 10, fontWeight: "bold" }}>Condiciones de la encomieda</Text>
                <Text style={{ fontFamily: theme.fonts.inter, fontSize: 18, marginBottom: 15 }}>
                    {helpMessages.Terms.encomienda}
                </Text>
            </>
        )
    }

    const GetModalContentOk = () => {
        return (
            <TouchableOpacity onPress={() => {
                closeModal()
                formulario == "destinatario" ? handleButtonDesti("destinatario") : handleButtonPress("otra")
            }} style={{ marginTop: 10, padding: 10, backgroundColor: theme.colors.BackGroundBlue, borderRadius: 18, width: "50%" }}>
                <Text style={{ color: 'white', textAlign: "center" }}>OK</Text>
            </TouchableOpacity>
        )
    };

    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={{ justifyContent: "flex-start", marginBottom: 20, marginTop: 20 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> Datos del cliente</Text>
                        </View>
                        <View>
                            <ProgressBarCustom step={1} />
                        </View>

                        <>
                            <View style={{ marginTop: 5, marginBottom: 10 }}>
                                <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", fontWeight: "800" }}> Remitente: </Text>
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
                                                if (colorReserve == "otra") {
                                                    handleButtonPress("")
                                                }
                                                else {
                                                    setFormulario("otra")
                                                    setModalVisible2(true)
                                                }
                                            }}
                                            underlayColor="transparent"
                                        >
                                            <View>
                                                <Image
                                                    source={Images.otherPerson}
                                                    style={{ width: "100%", height: undefined, aspectRatio: 4 / 1, alignSelf: 'center', resizeMode: 'contain' }}
                                                />
                                                <Text style={{ textAlign: 'center' }}>Otra persona</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: 5, marginBottom: 10 }}>
                                <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", fontWeight: "800" }}> Destinatario/a: </Text>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15 }}>
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colorDestina == "destinatario" ? theme.colors.Blue : theme.colors.BackGroundInpu, borderColor: "black", borderWidth: 1, borderRadius: 15, marginHorizontal: 5 }}>
                                        <TouchableHighlight
                                            onPress={() => {
                                                if (colorDestina == "destinatario") {
                                                    handleButtonDesti("")
                                                }
                                                else {
                                                    setFormulario("destinatario")
                                                    setModalVisible3(true)
                                                }
                                            }}
                                            underlayColor="transparent"
                                        >
                                            <View>
                                                <Image
                                                    source={Images.destinatario}
                                                    style={{ width: "100%", height: undefined, aspectRatio: 4 / 1.2, alignSelf: 'center', resizeMode: 'contain' }}
                                                />
                                                <Text style={{ textAlign: 'center', margin: 10 }}>Destinatario/a</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        </>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", marginBottom: 20, fontWeight: "800" }}>{selectService == "encomienda" ? "Número de paquetes: " : "Número de pasajeros: "}  </Text>
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
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-end", }}>
                        {
                            updateBoleto ? null :
                                <View style={{ flex: 0.2, flexDirection: "row", marginBottom: 10 }}>
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
                                            {' '}de envio de encomieda
                                        </Text>
                                    </View>

                                </View>}
                        <ButtonStyledImg text={"Siguiente"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
                            if (isSelected || updateBoleto) {
                                if (selectService == "encomienda") {
                                    console.log("Color", colorDestina)
                                    if (colorReserve == '' || colorDestina == '') {
                                        Alert.alert("FORMULARIO", "Por favor, llene todos los campos")
                                    } else {
                                        selectService == "encomienda" ? updateRegisterOneEnco('numPaquetes', numPasseger) :
                                            updateRegisterOne('numPax', numPasseger)
                                        navigation.navigate(ROUTES.HORARIOSRES)
                                    }
                                } else {
                                    if (colorReserve == '') {
                                        Alert.alert("FORMULARIO", "Por favor, llene todos los campos")
                                    } else {
                                        selectService == "encomienda" ? updateRegisterOneEnco('numPaquetes', numPasseger) :
                                            updateRegisterOne('numPax', numPasseger)
                                        navigation.navigate(ROUTES.HORARIOSRES)
                                    }
                                }
                            } else {
                                Alert.alert("Condiciones", "Para continuar con el proceso deberás aceptar las condiciones de encomienda.")
                            }

                        }}
                        />
                        <ButtonStyledImg text={"Regresar"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
                            navigation.goBack()
                        }
                        }
                        />

                    </View>
                </View>

            </ScrollView>
            <CustomModal isVisible={modalVisible} closeModal={closeModal} pregunta={selectService == "encomienda" ? "Número de paquetes: " : "Número de pasajeros: "} potition={"flex-end"} modalContent={<GetModalContent />} />
            <FloatingForm isVisible={modalVisible2} pregunta={selectService == "encomienda" ? "Ingresa los datos del remitente" : "Ingresa los datos de la persona"} modalContent={<GetModalContentPer />} state={formulario}
                modalConten2={<GetModalContentOk />} />
            <CustomModal isVisible={showConditions} closeModal={() => { setShowConditions(false) }} modalContent={<GetConditional />} />
            <FloatingFormDestinatario isVisible={modalVisible3} pregunta={"Ingresa los datos del destinatario"} modalContent={<GetModalContentPer />} state={formulario}
                modalConten2={<GetModalContentOk />} />
        </View>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flex: 1,
        width: theme.dimensions.width,
        height: theme.dimensions.height,
        backgroundColor: theme.colors.BackGroundWhite,
    },
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
        padding: 18,
        justifyContent: "flex-start",
        paddingTop: -1,
        backgroundColor: "#ffffff",
        //backgroundColor: "red",
        width: theme.dimensions.width,
    },
    icon: {
        width: 80, // Set the width and height of your image
        height: 80,
    },

});