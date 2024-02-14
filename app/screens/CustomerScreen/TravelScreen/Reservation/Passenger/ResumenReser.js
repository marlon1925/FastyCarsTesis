import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import { theme } from '../../../../../styles/theme';
import { UsuarioContext } from '../../../../../context/AllContexts';
import { CustomModal } from '../../../../../components/CustomModal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '@rneui/base';
import { baseURL } from '../../../../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES } from '../../../../../constants';
import { ProgressBarCustom } from '../../../../../components/ProgressBarCustom';
import { useFocusEffect } from '@react-navigation/native';
import { ButtonStyledImg } from '../../../../../components/ButtonStyledImg';

export const ResumenReser = ({ navigation }) => {
    const { registerForm, selectRuta, distancia, handleIsLoading, resetReservation, registerEncomienda, selectService, registerPriv, updateBoleto, handleBoletoUpdate, updateRegisterOneEnco, updateRegisterOne, updateRegisterOnePriv } = useContext(UsuarioContext)
    const [showModal, setShowModal] = useState(false);
    let privado = selectService == "priv" || updateBoleto?.tipoBoleto == "Privado";
    let privadoTQ = selectService == "privadoT-Q";
    let encomienda = selectService == "encomienda";

    const handleModal = () => {
        setShowModal(!showModal);
    }
    useFocusEffect(
        useCallback(() => {
            validatePrecio();
        }, [])
    );
    const validatePrecio = () => {
        try {
            console.log("registerPriv.distancia", registerPriv.distancia)
            console.log("re", registerForm.distancia)
            console.log("ENCOMIENDA: ", registerEncomienda)

            handleIsLoading(true)
            if (encomienda) {
                registerEncomienda.precio === 0 ? updateRegisterOneEnco("precio", registerEncomienda.numPaquetes * 10) : null
            } else if (privado || privadoTQ) {
                let register = privado ? registerPriv : registerForm;
                let precio;
                if (register.precio === 0) {
                    console.log(register.numPax > 8)
                    if (register.numPax > 4 && register.numPax < 9) {
                        precio = (0.50 * 2).toFixed(2)
                    } else if (register.numPax > 8 && register.numPax < 13) {
                        precio = (0.50 * 3).toFixed(2)
                    } else if (register.numPax > 12 && register.numPax < 17) {
                        precio = (0.50 * 4).toFixed(2)
                    } else if (register.numPax > 16 && register.numPax < 21) {
                        precio = (0.50 * 5).toFixed(2)
                    } else {
                        precio = 0.50
                    }
                    console.log("=========", precio)
                    console.log("DISTANCIA", register.distancia * precio)
                    let resultPrice = (register.distancia * precio).toFixed(2)
                    console.log(resultPrice)
                    privado ? updateRegisterOnePriv("precio", resultPrice) : updateRegisterOne("precio", resultPrice)
                }
            } else {
                registerForm.precio === 0 ? updateRegisterOne("precio", registerForm.numPax * 20) : null
            }
        } catch (error) {
            console.error("Error al calcular precio", error)
        } finally {
            handleIsLoading(false)
        }
    }
    const getReservation = async () => {
        const token = await AsyncStorage.getItem('Token');
        const clienteId = await AsyncStorage.getItem('idClient');
        console.log("Token", token);
        console.log("IdCliente", clienteId)
        let body = {
            clienteId: clienteId
        }
        try {
            console.log(body)

            handleIsLoading(true)
            const url = `${baseURL()}listar-reserva/${clienteId}`;
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            console.log("Repusta", bodyResponse.reservas)

        } catch (error) {
            console.error(error)
        } finally {
            handleIsLoading(false)
        }
    }

    const Buttons = () => {
        return (
            <View >
                <View style={{ alignItems: "center", flexDirection: "row", margin: 15 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        {/* <ButtonStyledImg text={"Si"} iconContainer={true} color={theme.colors.ColorGrennButtom} /> */}
                        <Button title={"Si"} color={theme.colors.ColorGrennButtom} onPress={() => {
                            saveReservation()

                        }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button title={"No"} color={theme.colors.ColorGray} onPress={() => {
                            handleModal()
                            console.log("Reservación", registerForm)
                        }} />
                    </View>
                </View>

            </View>


        )
    }
    const saveReservation = async () => {
        const token = await AsyncStorage.getItem('Token')
        const options = {
            method: updateBoleto ? 'PUT' : 'POST',
            body: JSON.stringify(privado ? registerPriv : encomienda ? registerEncomienda : registerForm),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        console.log(options.method)
        try {
            handleIsLoading(true)
            let url;
            if (updateBoleto) {
                privadoTQ || privado ? url = `${baseURL()}actualizar-boleto-privado/${updateBoleto._id}` : encomienda ? url = `${baseURL()}encomienda-actualizar/${updateBoleto._id}` : url = `${baseURL()}actualizar-boleto/${updateBoleto._id}`
            } else {
                privadoTQ || privado ? url = `${baseURL()}reserva-boleto-privado` : encomienda ? url = `${baseURL()}reserva-encomienda` : url = `${baseURL()}reserva-boleto`
            }
            console.log("Url", url)
            const response = await fetch(url, options);
            const bodyResponse = await response.json();
            // Verificar el estado de la respuesta
            console.log("Soy el body", bodyResponse)
            if (response.ok) {
                updateBoleto ? handleBoletoUpdate() : null
                handleModal()
                resetReservation()
                updateBoleto ? getReservation() : null
                if (updateBoleto) {
                    console.log("UPDATE====: ", updateBoleto.tipoBoleto)
                    if (updateBoleto.tipoBoleto == "Compartido" || updateBoleto.tipoBoleto == "compartido" || updateBoleto.tipoBoleto == "Privado") {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: ROUTES.TRAVEL_LOG }],
                        });
                    } else {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: ROUTES.ENCOMI_LOG }],
                        });
                    }
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: ROUTES.SELECT_LOG }],
                    });
                }
                Alert.alert('RESERVACIÓN', bodyResponse.msg)
            } else {
                console.log("False")
                // // Manejar errores de la solicitud
                bodyResponse.errors ?
                    Alert.alert("Error al iniciar sesión", bodyResponse.errors[0].msg)
                    :
                    Alert.alert("Error al iniciar sesión", bodyResponse.msg)
                // console.error(bodyResponse.msg)
            }
        } catch (error) {
            console.log("Error al reservar: ", error)
        } finally {
            handleIsLoading(false)
        }
    }

    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <View style={styles.contentContainer}>
                <View style={{ flex: 4.5, }}>
                    {
                        privado ?
                            <View>
                                <ProgressBarCustom step={3} />
                            </View>
                            : null
                    }
                    <ScrollView
                        showsVerticalScrollIndicator={false}>

                        <View style={{ justifyContent: "flex-start", marginBottom: 15, marginTop: 15 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "bold" }}> Detalles de la {encomienda ? "encomienda" : "reserva"} </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>Ruta: </Text>
                                <Text style={styles.styleSubTex}>{encomienda ? registerEncomienda.ciudadRemitente.ciudad + " - " + registerEncomienda.ciudadDestinatario.ciudad : privado ? registerPriv.ciudadSalida.ciudad + " - " + registerPriv.ciudadLlegada.ciudad : selectRuta?.ruta?.nombre}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>{privado || privadoTQ ? "Hora: " : "Horario:"}</Text>
                                <Text style={styles.styleSubTex}>{privado ? registerPriv.turno.horario : encomienda ? registerEncomienda.turno.horario : registerForm.turno.horario}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>Fecha: </Text>
                                <Text style={styles.styleSubTex}>{privado ? registerPriv.turno.fecha : encomienda ? registerEncomienda.turno.fecha : registerForm.turno.fecha}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>Ciudad de salida: </Text>
                                <Text style={styles.styleSubTex}>{privado ? registerPriv.ciudadSalida.ciudad : encomienda ? registerEncomienda.ciudadRemitente.ciudad : registerForm.ciudadSalida.ciudad}</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>Ciudad de llegada: </Text>
                                <Text style={styles.styleSubTex}>{privado ? registerPriv.ciudadLlegada.ciudad : encomienda ? registerEncomienda.ciudadDestinatario.ciudad : registerForm.ciudadLlegada.ciudad}</Text>
                            </View>
                            {
                                encomienda ? null :
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.styleTex}>Distancia: </Text>
                                        <Text style={styles.styleSubTex}>{updateBoleto ? registerPriv.distancia || registerForm.distancia + " km" : distancia + " km"}</Text>
                                    </View>
                            }
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>{encomienda ? "Paquetes: " : "Pasajeros:"} </Text>
                                <Text style={styles.styleSubTex}>{privado ? registerPriv.numPax : encomienda ? registerEncomienda.numPaquetes : registerForm.numPax}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: theme.colors.ColorGrayButtom,
                                    borderBottomWidth: 1.5,
                                    width: '100%',  // Ancho de la línea
                                    alignSelf: 'center',  // Centrar la línea horizontalmente
                                    marginVertical: 10,  // Espaciado vertical opcional
                                }}
                            />
                            <Text style={[styles.styleTex, { textAlign: "center" }]}>Lugar de recogida</Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>Dirección: </Text>
                                <Text style={{ flexShrink: 1, fontWeight: "400", fontSize: theme.fontSize.body, textAlign: "justify" }}>
                                    {privado ? registerPriv.ciudadSalida.direccion : encomienda ? registerEncomienda.ciudadRemitente.direccion : registerForm.ciudadSalida.direccion}
                                </Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: theme.colors.ColorGrayButtom,
                                    borderBottomWidth: 1.5,
                                    width: '100%',  // Ancho de la línea
                                    alignSelf: 'center',  // Centrar la línea horizontalmente
                                    marginVertical: 10,  // Espaciado vertical opcional
                                }}
                            />
                            <Text style={[styles.styleTex, { textAlign: "center" }]}>Lugar de llegada </Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>Dirección: </Text>
                                <Text style={{ flexShrink: 1, textAlign: "justify", fontWeight: "400", fontSize: theme.fontSize.body }}>{privado ? registerPriv.ciudadLlegada.direccion : encomienda ? registerEncomienda.ciudadDestinatario.direccion : registerForm.ciudadLlegada.direccion}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: theme.colors.ColorGrayButtom,
                                    borderBottomWidth: 1.5,
                                    width: '100%',  // Ancho de la línea
                                    alignSelf: 'center',  // Centrar la línea horizontalmente
                                    marginVertical: 10,  // Espaciado vertical opcional
                                }}
                            />
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.styleTex}>Precio: </Text>
                                <Text style={styles.styleSubTex}>{privado ? registerPriv.precio + "$" : encomienda ? registerEncomienda.precio + "$" : registerForm.precio + "$"}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <ButtonStyledImg text={updateBoleto ? "Actualizar" : "Confirmar"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => setShowModal(true)}
                    />
                    <ButtonStyledImg text={"Atrás"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => navigation.goBack()}
                    />
                </View>
            </View>
            <CustomModal isVisible={showModal} closeModal={handleModal} pregunta={updateBoleto ? "¿Esta seguro/a de actualizar esta reserva?" : "¿Estas seguro de reservar?"} modalContent={<Buttons />} potition={"flex-end"} />
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
    styleTex: {
        fontFamily: theme.fonts.interSBold,
        fontWeight: "700",
        margin: 9,
        fontSize: theme.fontSize.subheading
    },
    styleSubTex: {
        fontFamily: theme.fonts.interSBold,
        fontSize: theme.fontSize.actionText
    }


});