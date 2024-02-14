import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert, TouchableHighlight, TouchableOpacity, Linking, Image } from 'react-native';
import Constants from 'expo-constants';
import { theme } from '../../styles/theme';
import { UsuarioContext } from '../../context/AllContexts';
import { GotoBack, baseURL } from '../../utils/helpers';
import { CustomModal } from '../../components/CustomModal';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { Button } from 'react-native-paper';
import { ROUTES } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonStyled from '../../components/ButtonStyled';
import { ButtonStyledImg } from '../../components/ButtonStyledImg';
import { Images } from '../../utils/imagenes';


export const ResumenDriver = ({ navigation }) => {
    const { registerForm, selectRuta, distancia, handleIsLoading, resetReservation, registerEncomienda, selectService, registerPriv, updateBoleto, handleBoletoUpdate } = useContext(UsuarioContext)
    const [showModal, setShowModal] = useState(false);
    const [serviceView, setServiceView] = useState({
        nombre: '',
        apellido: '',
        phone: '',
        ciudadSalida: '',
        ciudadSalidaDire: '',
        ciudadLlegada: '',
        ciudadLlegadaDire: '',
        numP: '',
        tipoBoleto: '',
        referencia: '',
        referenciaDest: ''
    });
    const handleModal = () => {
        setShowModal(!showModal);
    }
    useEffect(() => {
        verificateService();
    }, [])
    const verificateService = () => {
        console.log("DISTANCIA", updateBoleto.estadoPax)
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
                referencia: updateBoleto.ciudadRemitente.referencia,
                referenciaDest: updateBoleto.ciudadDestinatario.referencia
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
                referencia: updateBoleto.ciudadSalida.referencia,
                referenciaDest: updateBoleto.ciudadLlegada.referencia
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

    const Buttons = () => {
        return (
            <View >
                <View style={{ alignItems: "center", flexDirection: "row", margin: 15 }}>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <ButtonStyledImg text={"Si"} iconContainer={true} color={theme.colors.ColorGrennButtom} onPress={() => {
                            changeStatus()
                        }} />
                    </View>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <ButtonStyledImg text={"No"} iconContainer={true} color={theme.colors.BackGroundInpu} onPress={() => {
                            handleModal()
                            console.log("Reservacion", registerForm)
                        }} />
                    </View>
                </View>

            </View>


        )
    }
    const changeStatus = async () => {
        const token = await AsyncStorage.getItem('Token')
        const idClient = await AsyncStorage.getItem('idClient')
        let status = encomienda ? updateBoleto.estadoPaquete : updateBoleto.estadoPax
        let nextStatus = status === "Aprobado" ? "En tránsito" : "Completado"
        console.log("ESTADO===: ", status)
        let idType = encomienda ? "idEncomienda" : "idBoleto"
        const options = {
            method: 'PUT',
            body: JSON.stringify({
                [idType]: updateBoleto._id,
                "idConductor": idClient,
                "nuevoEstado": nextStatus
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        console.log(JSON.stringify({
            "idBoleto": updateBoleto._id,
            "idConductor": idClient,
            "nuevoEstado": nextStatus
        }),)
        try {
            handleIsLoading(true)
            let service = privado ? "chofer/actualizarPriv" : encomienda ? "chofer/actualizarEncomienda" : "chofer/actualizarECom"
            const url = `${baseURL()}${service}`
            console.log("Url", url)
            const response = await fetch(url, options);
            const bodyResponse = await response.json();
            // Verificar el estado de la respuesta
            console.log("Soy el body", bodyResponse)
            if (response.ok) {
                Alert.alert('ESTADO', bodyResponse.mensaje)
                handleModal()
                navigation.goBack()
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
    let privado = updateBoleto.tipoBoleto == "Privado";
    let encomienda = updateBoleto.tipoBoleto === "Encomienda" || updateBoleto.tipoBoleto === "encomienda";
    let ciudadSalida = encomienda ? "ciudadRemitente" : "ciudadSalida"
    let ciudadLlegada = encomienda ? "ciudadDestinatario" : "ciudadLlegada"
    let estadoUpdate = encomienda ? "estadoPaquete" : "estadoPax"
    console.log("ESTADO: ", updateBoleto)
    const locationLinkSalida = `https://www.google.com/maps/search/?api=1&query=${updateBoleto[ciudadSalida].latitud},${updateBoleto[ciudadSalida].longitud}`;
    const locationLinkLlegada = `https://www.google.com/maps/search/?api=1&query=${updateBoleto[ciudadLlegada].latitud},${updateBoleto[ciudadLlegada].longitud}`;
    const openWhatsApp = ({ estado }) => {
        const whatsappURL = `https://wa.me/+593${estado ? updateBoleto.destinatario.phone : serviceView.phone}`;
        Linking.openURL(whatsappURL);
    };
    const openPhone = ({ estado }) => {
        Linking.openURL(`tel:${estado ? updateBoleto.destinatario.phone : serviceView.phone}`);
    };
    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            {
                console.log("SERVICE ENCOMIENDA: ", serviceView)
            }
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
                                    <Text style={styles.styleTex}>{encomienda ? "Celular remitente:" : "Celular:"}</Text>
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
                                            <Text style={styles.styleSubTex}>{updateBoleto.destinatario.phone}</Text>
                                        </View>
                                        : null
                                }
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.styleTex}>{privado ? "Hora:" : "Horario:"}</Text>
                                    <Text style={styles.styleSubTex}>{privado ? updateBoleto.turno.horario > "12:00" ? updateBoleto.turno.horario + " PM" : updateBoleto.turno.horario + " AM" : encomienda ? updateBoleto.turno.horario : updateBoleto.turno.horario}</Text>
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
                                    <View style={{ flex: 0.6, alignItems: "flex-start", justifyContent: "flex-start", marginTop: -10 }}>
                                        <Text style={styles.styleTex}>Dirección:</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.styleSubTex, { textAlign: "left" }]}>{serviceView.ciudadSalidaDire}</Text>
                                    </View>
                                </View>
                                {
                                    serviceView.referencia ?
                                        <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 5 }}>
                                            <View style={{ flex: 0.6, alignItems: "flex-start", justifyContent: "flex-start", marginTop: -10 }}>
                                                <Text style={styles.styleTex}>Referencia:</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.styleSubTex, { textAlign: "left" }]}>{serviceView.referencia}</Text>
                                            </View>
                                        </View>
                                        : null
                                }
                                <View style={{ marginTop: 20, alignItems: "center" }}>
                                    <ButtonStyledImg text={"Abrir ubicación"} textColor={"white"} color={theme.colors.ColorGrayButtom} onPress={() => Linking.openURL(locationLinkSalida)} />
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
                                    <View style={{ flex: 0.6, alignItems: "flex-start", justifyContent: "flex-start", marginTop: -10 }}>
                                        <Text style={styles.styleTex}>Dirección:</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.styleSubTex}>{serviceView.ciudadLlegadaDire}</Text>
                                    </View>
                                </View>
                                {
                                    serviceView.referenciaDest ?
                                        <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 5 }}>
                                            <View style={{ flex: 0.6, alignItems: "flex-start", justifyContent: "flex-start", marginTop: -10 }}>
                                                <Text style={styles.styleTex}>Referencia:</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.styleSubTex, { textAlign: "left" }]}>{serviceView.referenciaDest}</Text>
                                            </View>
                                        </View>
                                        : null
                                }
                                <View style={{ marginTop: 20, alignItems: "center" }}>
                                    <ButtonStyledImg text={"Abrir ubicación"} textColor={"white"} color={theme.colors.ColorGrayButtom} onPress={() => Linking.openURL(locationLinkLlegada)} />
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
                        <View style={{ marginTop: 10 }}>
                            {
                                updateBoleto[estadoUpdate] === "Completado" ? null :
                                    <ButtonStyledImg text={encomienda ? "Cambiar estado de la encomienda" : " Cambiar estado del pasajero"} width={"100%"} color={theme.colors.Blue} onPress={() => {
                                        setShowModal(true)
                                    }}
                                    />
                            }
                            <ButtonStyledImg text={"Regresar"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
                                handleBoletoUpdate()
                                navigation.goBack()
                            }}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <CustomModal isVisible={showModal} closeModal={handleModal} pregunta={"¿Esta seguro de cambiar el estado?"} modalContent={<Buttons />} potition={"center"} />

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