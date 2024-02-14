import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, Image } from 'react-native';
import { theme } from '../../../../styles/theme';
import Constants from 'expo-constants';
import { TouchableHighlight } from 'react-native-gesture-handler';

import { CustomModal } from '../../../../components/CustomModal';
import { FloatingForm } from '../../../../components/FloatingForm';
import { ROUTES } from '../../../../constants';
import Icon from 'react-native-vector-icons/AntDesign';
import { ProgressBarCustom } from '../../../../components/ProgressBarCustom';
import { Images } from '../../../../utils/imagenes';
import { UsuarioContext } from '../../../../context/AllContexts';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonStyledImg } from '../../../../components/ButtonStyledImg';

export const ReservartioCity = ({ navigation }) => {
    const [colorReserve, setColorReserve] = useState("");
    const [colorDestina, setColorDestina] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [formulario, setFormulario] = useState("");
    const [numPasseger, setNumPasseger] = useState(1)
    const { userInfo, updateRegisterPriv, updateRegisterOnePriv, updateBoleto, handleIsLoading, registerPriv } = useContext(UsuarioContext);

    useFocusEffect(
        useCallback(() => {
            verifiUpdate()
        }, [])
    );

    const verifiUpdate = () => {
        console.log("User", userInfo)
        if (updateBoleto) {

            if (updateBoleto.user.nombre === userInfo.pasajeroNombre && updateBoleto.user.apellido === userInfo.pasajeroApellido && updateBoleto.user.phone === "0" + userInfo.phone) {
                console.log("entroooooo")
                handleButtonPress("user")
                updateRegisterPriv('user', 'nombre', updateBoleto.user.nombre);
                updateRegisterPriv('user', 'apellido', updateBoleto.user.apellido);
                updateRegisterPriv('user', 'phone', updateBoleto.user.phone);
            } else {
                handleButtonPress("otra")

            }
            updateRegisterOnePriv("numPax", updateBoleto.numPax)
            setNumPasseger(updateBoleto.numPax)
        }

    }

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
            setModalVisible2(false)

    };

    const updateRegister = async () => {
        updateRegisterPriv('user', 'nombre', userInfo?.pasajeroNombre);
        updateRegisterPriv('user', 'apellido', userInfo?.pasajeroApellido);
        updateRegisterPriv('user', 'phone', "0" + userInfo?.phone);
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
                        <ButtonStyledImg icon={"plus"} iconContainer={true} color={theme.colors.ColorGrennButtom} disabled={numPasseger == 20 ? true : false}
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
            style={[styles.container, { marginTop: Constants.statusBarHeight - 25, }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.contentContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={{ marginTop: 2, marginBottom: 1 }}>
                        </View>
                        <View>
                            <ProgressBarCustom step={1} />
                        </View>
                        <>
                            <View style={{ marginTop: 5, marginBottom: 10 }}>
                                <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", fontWeight: "800" }}> Reserva para: </Text>
                            </View>
                            <View style={{ alignItems: "center", marginBottom: 20 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10, width: "70%", height: "50%" }}>
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
                                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 15, width: "70%", height: "50%" }}>
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
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        </>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", marginBottom: 20, fontWeight: "800" }}>{"Número de pasajeros: "}  </Text>
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
                    <View style={{ flex: 1, height: "100%", justifyContent: "flex-end", }}>
                        <ButtonStyledImg text={"Siguiente"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {

                            if (colorReserve == '') {
                                Alert.alert("FORMULARIO", "Por favor, llene todos los campos")
                            } else {
                                updateRegisterOnePriv('numPax', numPasseger)
                                navigation.navigate(ROUTES.RESERVATION_CITY_HORA_EDIT)
                            }
                        }}
                        />
                        <ButtonStyledImg text={"Regresar"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
                            updateBoleto ? navigation.navigate(ROUTES.TRAVEL_LOG) : navigation.goBack()
                        }
                        }
                        />

                    </View>

                </View>
            </ScrollView>
            <CustomModal isVisible={modalVisible} closeModal={closeModal} pregunta={"Número de pasajeros: "} potition={"flex-end"} modalContent={<GetModalContent />} />
            <FloatingForm isVisible={modalVisible2} pregunta={"Ingresa los datos de la persona"} modalContent={<GetModalContentPer />} state={formulario}
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