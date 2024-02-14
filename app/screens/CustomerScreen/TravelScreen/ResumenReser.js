import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import { theme } from '../../../styles/theme';
import { UsuarioContext } from '../../../context/AllContexts';
import { CustomModal } from '../../../components/CustomModal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '@rneui/base';
import { baseURL } from '../../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES } from '../../../constants';
import { ProgressBarCustom } from '../../../components/ProgressBarCustom';
import { ButtonStyledImg } from '../../../components/ButtonStyledImg';

export const ResumenReser = ({ navigation }) => {
    const { registerForm, selectRuta, distancia, handleIsLoading, resetReservation, registerEncomienda, selectService, registerPriv, updateBoleto, handleBoletoUpdate } = useContext(UsuarioContext)
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [detalleDriver, setDetalleDriver] = useState(false);
    const [serviceView, setServiceView] = useState({
        nombre: '',
        apellido: '',
        phone: '',
        ciudadSalida: '',
        ciudadSalidaDire: '',
        ciudadLlegada: '',
        ciudadLlegadaDire: '',
        numP: '',
        tipoBoleto: ''
    });
    const handleModal = () => {
        showModal ? setShowModal(!showModal) : setShowModal2(!showModal2)
    }
    useEffect(() => {
        verificateService();
    }, [])
    const verificateService = () => {

        getDateDriver()
        console.log("DISTANCIA", updateBoleto.distancia)
        console.log("LA ACTUALIZACION DE ENCOMIENDA: ", updateBoleto)
        updateBoleto.tipoBoleto === "Encomienda" || updateBoleto.tipoBoleto === "encomienda" ?

            setServiceView({
                ...serviceView,
                nombre: updateBoleto.remitente?.nombre,
                apellido: updateBoleto.remitente?.apellido,
                phone: updateBoleto.remitente.phone,
                ciudadSalida: updateBoleto.ciudadRemitente.ciudad,
                ciudadSalidaDire: updateBoleto.ciudadRemitente.direccion,
                ciudadLlegadaDire: updateBoleto.ciudadDestinatario.direccion,
                ciudadLlegada: updateBoleto.ciudadDestinatario.ciudad,
                numP: updateBoleto.numPaquetes,
                tipoBoleto: updateBoleto.tipoBoleto,
            })
            : setServiceView({
                ...serviceView,
                nombre: updateBoleto.user?.nombre,
                apellido: updateBoleto.user?.apellido,
                phone: updateBoleto.user.phone,
                ciudadSalida: updateBoleto.ciudadSalida.ciudad,
                ciudadSalidaDire: updateBoleto.ciudadSalida.direccion,
                ciudadLlegadaDire: updateBoleto.ciudadLlegada.direccion,
                ciudadLlegada: updateBoleto.ciudadLlegada.ciudad,
                numP: updateBoleto.numPax,
                tipoBoleto: updateBoleto.tipoBoleto,
            })
        console.log("LA ACTUALIZACION DE ServiceView: ", serviceView)

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
            await handleReservationLog(bodyResponse.reservas)

        } catch (error) {
            console.error(error)
        } finally {
            handleIsLoading(false)
        }
    }
    const getDateDriver = async () => {
        const token = await AsyncStorage.getItem('Token');
        console.log("Token", token);
        let body = {
            idBoleto: updateBoleto._id
        }
        try {
            const url = `${baseURL()}ver-conductor`;
            console.log(body)
            console.log("URL: ", url)
            console.log("TIPO BOLETO: ", updateBoleto.tipoBoleto)
            handleIsLoading(true)
            const options = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            if (respuesta.ok) {
                setDetalleDriver(bodyResponse.conductor)
            } else {
                setDetalleDriver()
            }

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
                            console.log("Reservacion", registerForm)
                        }} />
                    </View>
                </View>

            </View>


        )
    }
    const DateDriver = () => {
        return (
            <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.styleTex}>{"Nombre:"}</Text>
                    <Text style={styles.styleSubTex}>{detalleDriver?.nombre}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.styleTex}>{"Apellido:"}</Text>
                    <Text style={styles.styleSubTex}>{detalleDriver?.apellido}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.styleTex}>{"Marca:"}</Text>
                    <Text style={styles.styleSubTex}>{detalleDriver?.marca}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.styleTex}>{"Modelo:"}</Text>
                    <Text style={styles.styleSubTex}>{detalleDriver?.modelo}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.styleTex}>{"Color:"}</Text>
                    <Text style={styles.styleSubTex}>{detalleDriver?.color}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.styleTex}>{"Placa:"}</Text>
                    <Text style={styles.styleSubTex}>{detalleDriver?.placa}</Text>
                </View>
            </View>
        )
    }
    const saveReservation = async () => {
        const token = await AsyncStorage.getItem('Token')
        const options = {
            method: updateBoleto ? 'PUT' : 'POST',
            body: JSON.stringify(registerForm),
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
                selectService == "privadoT-Q" ? url = `${baseURL()}reserva-boleto-privado` : url = `${baseURL()}actualizar-boleto/${updateBoleto._id}`
            } else {
                selectService == "privadoT-Q" ? url = `${baseURL()}reserva-boleto-privado` : url = `${baseURL()}reserva-boleto`
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
                updateBoleto ? navigation.navigate(ROUTES.TRAVEL_LOG) : navigation.navigate(ROUTES.HOME_CUSTUMER)
                Alert.alert('RESERVACIÓN', bodyResponse.msg)
            } else {
                console.log("False")
                // // Manejar errores de la solicitud
                Alert.alert("Error en la reservación", bodyResponse.msg);
                // console.error(bodyResponse.msg)
            }
        } catch (error) {
            console.log("Error al reservar: ", error)
        } finally {
            handleIsLoading(false)
        }
    }
    let privado = updateBoleto.tipoBoleto == "priv";
    let encomienda = updateBoleto.tipoBoleto === "Encomienda" || updateBoleto.tipoBoleto === "encomienda";
    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <View style={styles.contentContainer}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ justifyContent: "flex-start", marginBottom: 15, marginTop: 15 }}>
                            <Text style={{ fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}>{serviceView.tipoBoleto === "encomienda" || serviceView.tipoBoleto === "Encomienda" ? `Detalles de la ${serviceView.tipoBoleto}` : `Detalles de la reserva ${serviceView.tipoBoleto}`} </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >


                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.styleTex}>{encomienda ? "Remitente:" : "Pasajero:"}</Text>
                                    <Text style={styles.styleSubTex}>{serviceView?.nombre + " " + serviceView?.apellido}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.styleTex}> {encomienda ? "Celular remitente:" : "Celular:"}</Text>
                                    <Text style={styles.styleSubTex}>{serviceView.phone}</Text>
                                </View>
                                {
                                    encomienda ?
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Text style={styles.styleTex}>Destinatario:</Text>
                                            <Text style={styles.styleSubTex}>{updateBoleto.destinatario?.nombre + " " + updateBoleto.destinatario?.apellido}</Text>
                                        </View>
                                        : null
                                }
                                {
                                    encomienda ?
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Text style={styles.styleTex}>Celular destinatario:</Text>
                                            <Text style={styles.styleSubTex}>{updateBoleto?.destinatario?.phone}</Text>
                                        </View>
                                        : null
                                }
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.styleTex}>{privado ? "Hora:" : "Horario:"}</Text>
                                    <Text style={styles.styleSubTex}>{privado ? updateBoleto.turno.hora : encomienda ? updateBoleto.turno.horario : updateBoleto.turno.horario}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.styleTex}>Fecha:</Text>
                                    <Text style={styles.styleSubTex}> {privado ? updateBoleto.turno.fecha : encomienda ? updateBoleto.turno.fecha : updateBoleto.turno.fecha}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.styleTex}>Ciudad de salida:</Text>
                                    <Text style={styles.styleSubTex}>{serviceView.ciudadSalida}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.styleTex}>Ciudad de llegada:</Text>
                                    <Text style={styles.styleSubTex}>{serviceView.ciudadLlegada}</Text>
                                </View>
                                {
                                    updateBoleto.tipoBoleto == "Encomienda" ? null :
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Text style={styles.styleTex}>Distancia:</Text>
                                            <Text style={styles.styleSubTex}>{updateBoleto.distancia + " km"}</Text>
                                        </View>
                                }
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.styleTex}>{encomienda ? "Paquetes:" : "Pasajeros:"}</Text>
                                    <Text style={styles.styleSubTex}>{serviceView.numP}</Text>
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
                                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                    <View style={{ flex: 0.4, alignItems: "flex-start", justifyContent: "flex-start", marginTop: -10 }}>
                                        <Text style={styles.styleTex}>Dirección:</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.styleSubTex, { textAlign: "left" }]}>{serviceView.ciudadSalidaDire}</Text>
                                    </View>
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
                                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                    <View style={{ flex: 0.4, alignItems: "flex-start", justifyContent: "flex-start", marginTop: -10 }}>
                                        <Text style={styles.styleTex}>Dirección:</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.styleSubTex}>{serviceView.ciudadLlegadaDire}</Text>
                                    </View>
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
                                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                    <View style={{ flex: 1, alignItems: "flex-start", justifyContent: "flex-start", marginTop: -10 }}>
                                        <Text style={styles.styleTex}>Conductor asignado:</Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <Text onPress={() => detalleDriver ? setShowModal2(true) : null} style={[styles.styleSubTex, { textAlign: "left" }]}>{detalleDriver ? detalleDriver?.nombre : "No asignado"}</Text>
                                    </View>
                                    {
                                        detalleDriver ? (
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                                <Text onPress={() => setShowModal2(true)} style={[styles.styleSubTex, { textAlign: "left", textDecorationLine: "underline", fontWeight: "bold" }]}>{"Ver más"}</Text>
                                            </View>
                                        ) : null
                                    }
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
                                    <Text style={styles.styleTex}>Precio:</Text>
                                    <Text style={styles.styleSubTex}>{encomienda ? updateBoleto.precio + "$" : updateBoleto.precio + "$"}</Text>
                                </View>
                            </ScrollView>
                        </View>
                        <View style={{ marginTop: 10, }}>
                            <ButtonStyledImg text={"Regresar"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
                                handleBoletoUpdate()
                                navigation.goBack()
                            }}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <CustomModal isVisible={showModal} closeModal={handleModal} pregunta={updateBoleto ? "¿Esta seguro/a de actualizar esta reserva?" : "¿Estas seguro de reservar?"} modalContent={<Buttons />} potition={"flex-end"} />
            <CustomModal isVisible={showModal2} closeModal={handleModal} pregunta={"Datos del conductor asignado"} modalContent={<DateDriver />} potition={"flex-end"} />

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
        fontWeight: "bold",
        margin: 9,
        fontSize: theme.fontSize.subheading
    },
    styleSubTex: {
        fontFamily: theme.fonts.interSBold,
        fontSize: theme.fontSize.actionText
    }


});