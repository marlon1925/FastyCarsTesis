import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, AppState, Alert, Image } from 'react-native';
import { theme } from '../../../../../styles/theme';
import Constants from 'expo-constants';

import { ProgressBarCustom } from '../../../../../components/ProgressBarCustom';
import { Images } from '../../../../../utils/imagenes';
import { check, PERMISSIONS, RESULTS, request, openSettings } from 'react-native-permissions';
import { useFocusEffect } from '@react-navigation/native';
import { LocationServicePermissions } from '../../../../../utils/helpers';
import { CustomModal } from '../../../../../components/CustomModal';
import { MapScreen } from '../../../../../common/MapScreen';
import { UsuarioContext } from '../../../../../context/AllContexts';
import * as Location from "expo-location";
import { ROUTES } from '../../../../../constants';
import imgs from '../../../../../constants/imgs';
import { ButtonStyledImg } from '../../../../../components/ButtonStyledImg';

export const DirectionReser = ({ navigation }) => {
    const [colorCity, setColorCity] = useState();
    const [locationPermission, setLocationPermission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const appState = useRef(AppState.currentState);

    const [locationServiceEnabled, setLocationServiceEnabled] = React.useState({
        status: "denied",
        coordinates: null,
    });
    const { handleIsLoading, updateRegisterForm, handleOrigenCity, registerForm, distancia, selectRuta, updateBoleto, updateRegisterOnePriv, updateRegisterOneEnco, selectService, updateRegisterOne, updateRegisterEnco, registerEncomienda, registerPriv } = useContext(UsuarioContext)
    let privado = selectService == "priv" || updateBoleto?.tipoBoleto == "Privado";
    let privadoTQ = selectService == "privadoT-Q";
    let encomienda = selectService == "encomienda";

    useEffect(() => {
        handleUpdateBoleto();
    }, [])

    const handleUpdateBoleto = async () => {
        try {
            handleIsLoading(true)
            if (updateBoleto) {
                let tipoCiudadSalida = updateBoleto.tipoBoleto == "encomienda" ? "ciudadRemitente" : "ciudadSalida"
                let tipoCiudadLlegada = updateBoleto.tipoBoleto == "encomienda" ? "ciudadDestinatario" : "ciudadLlegada"
                if (updateBoleto.tipoBoleto === "Encomienda") {
                    updateBoleto.numPax === registerEncomienda.numPaquetes ? updateRegisterOneEnco("precio", updateBoleto.precio) : updateRegisterOneEnco("precio", 10 * registerEncomienda.numPaquetes)
                    setColorCity(updateBoleto.ciudadRemitente.ciudad);
                    updateRegisterEnco('ciudadDestinatario', 'ciudad', updateBoleto.ciudadDestinatario.ciudad);
                    updateRegisterEnco('ciudadDestinatario', 'direccion', updateBoleto.ciudadDestinatario.direccion);
                    updateRegisterEnco('ciudadDestinatario', 'latitud', updateBoleto.ciudadDestinatario.latitud);
                    updateRegisterEnco('ciudadDestinatario', 'longitud', updateBoleto.ciudadDestinatario.longitud);
                    updateRegisterEnco('ciudadDestinatario', 'referencia', updateBoleto.ciudadDestinatario.referencia);
                    updateRegisterEnco('ciudadRemitente', 'ciudad', updateBoleto.ciudadRemitente.ciudad);
                    updateRegisterEnco('ciudadRemitente', 'direccion', updateBoleto.ciudadRemitente.direccion);
                    updateRegisterEnco('ciudadRemitente', 'latitud', updateBoleto.ciudadRemitente.latitud);
                    updateRegisterEnco('ciudadRemitente', 'longitud', updateBoleto.ciudadRemitente.longitud);
                    updateRegisterEnco('ciudadRemitente', 'referencia', updateBoleto.ciudadRemitente.referencia);
                } else {

                    updateRegisterForm(tipoCiudadSalida, "direccion", updateBoleto.ciudadSalida.direccion);
                    updateRegisterForm(tipoCiudadSalida, "ciudad", updateBoleto.ciudadSalida.ciudad);
                    updateRegisterForm(tipoCiudadSalida, "latitud", updateBoleto.ciudadSalida.latitud);
                    updateRegisterForm(tipoCiudadSalida, "longitud", updateBoleto.ciudadSalida.longitud);
                    updateRegisterForm(tipoCiudadSalida, "referencia", updateBoleto.ciudadSalida.referencia);
                    setColorCity(updateBoleto.ciudadSalida.ciudad)
                    updateRegisterForm(tipoCiudadLlegada, "direccion", updateBoleto.ciudadLlegada.direccion);
                    updateRegisterForm(tipoCiudadLlegada, "ciudad", updateBoleto.ciudadLlegada.ciudad)
                    updateRegisterForm(tipoCiudadLlegada, "latitud", updateBoleto.ciudadSalida.latitud);
                    updateRegisterForm(tipoCiudadLlegada, "longitud", updateBoleto.ciudadSalida.longitud);
                    updateRegisterForm(tipoCiudadLlegada, "referencia", updateBoleto.ciudadSalida.referencia);
                    updateRegisterOne("distancia", updateBoleto.distancia)
                    updateRegisterOne("tipoBoleto", updateBoleto.tipoBoleto)
                }
                if (updateBoleto.tipoBoleto == "Compartido") {
                    updateBoleto.numPax === registerForm.numPax ? await updateRegisterOne("precio", updateBoleto.precio) : await updateRegisterOne("precio", 20 * registerForm.numPax)
                }
            }
        } catch (error) {
            console.error("Error al guardar", error)
        } finally {
            handleIsLoading(false)
        }

    }

    const handleModalClose = () => {
        setShowModal(false);
    };

    // Verificar y solicitar permisos cada vez que la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            VerifyPermissions();
        }, [])
    );
    const VerifyPermissions = async () => {
        const response = await LocationServicePermissions();
        console.log("\n - - - - - - -  - - - - - -  - - -- - - - - -");
        console.log("PERMISOS DE LOCACION DESPUES: ", response);
        console.log("\n - - - - - - -  - - - - - -  - - -- - - - - -");
        setLocationServiceEnabled(response);
    };

    useEffect(() => {
        let subscription;

        const handleAppStateChange = async (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                console.log("App has come to the foreground!");

                // Desvincula temporalmente el listener
                subscription.remove();

                try {
                    // Llamada a VerifyPermissions cuando la aplicación vuelve a estar activa
                    await VerifyPermissions();
                } finally {
                    // Vuelve a vincular el listener después de que VerifyPermissions se haya completado
                    subscription = AppState.addEventListener(
                        "change",
                        handleAppStateChange
                    );
                }
            }

            appState.current = nextAppState;

            console.log("AppState", nextAppState);
        };

        subscription = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);


    const handleButtonPress = (buttonId, state) => {
        // Cambia el botón seleccionado según el id del botón
        setColorCity((prevButton) => (prevButton === buttonId ? null : buttonId))

        if (buttonId) {
            if (selectService == "encomienda") {
                // handleCity("")
                updateRegisterEnco("ciudadRemitente", "ciudad", "")
                updateRegisterEnco("ciudadDestinatario", "ciudad", "")
                updateRegisterEnco("ciudadDestinatario", "direccion", "");
                updateRegisterEnco("ciudadRemitente", "direccion", "");
            } else {
                // handleCity("")
                updateRegisterForm("ciudadSalida", "ciudad", "")
                updateRegisterForm("ciudadLlegada", "ciudad", "")
                updateRegisterForm("ciudadLlegada", "direccion", "");
                updateRegisterForm("ciudadSalida", "direccion", "");
            }
        }

    };
    const openAppSettings = async () => {
        await openSettings();
    };


    const GetPermissonGps = () => {
        return (
            <View style={{ alignItems: "center", width: "100%" }}>
                <View style={{ width: "70%", marginBottom: 15 }}>
                    <TouchableOpacity
                        onPress={() => {
                            openAppSettings()
                            setShowModal(false)
                        }}
                    >
                        <ButtonStyledImg text={"Ir a configuraciónes"} width={"100%"} color={theme.colors.BackGroundInpu} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const LocationServicePermissions = async () => {

        try {
            handleIsLoading(true)
            let response = { status: "denied", coordinates: null };

            // Verificar si los servicios de ubicación están habilitados
            let enabled = await Location.hasServicesEnabledAsync();

            // Solicitar permisos de ubicación en primer plano
            let { status } = await Location.requestForegroundPermissionsAsync();


            console.log(
                "ESTADO PERMISOS: " + status + " ESTÁ ACTIVO EL SERVICIO?: " + enabled
            );

            // Verificar si los permisos fueron otorgados y los servicios de ubicación están habilitados
            if (status === "granted" && enabled) {
                response.status = "granted";
            } else if (status === "granted" && !enabled) {
                response.status = "granted";
            }

            return response;
        } catch (error) {
            console.error("Error obteniendo permisos de ubicación:", error);

            // Aquí, probablemente también quieras devolver la respuesta en caso de error.
            return response;
        } finally {
            handleIsLoading(false)
        }
    };
    const ciudadSelect = (statu) => {
        navigation.navigate(ROUTES.MAPSCREEN_EDIT)
        handleOrigenCity(statu)
    }

    const handleStatus = async () => {
        navigation.navigate(ROUTES.RESUMENSCREEN_EDIT)
    }
    let ciudadSalida = updateBoleto ? updateBoleto.tipoBoleto === "Encomienda" ? updateBoleto.ciudadRemitente.ciudad : updateBoleto.ciudadSalida.ciudad : null
    let ciudadLlegada = updateBoleto ? updateBoleto.tipoBoleto === "Encomienda" ? updateBoleto.ciudadDestinatario.ciudad : updateBoleto.ciudadLlegada.ciudad : null
    let ciudad1 = selectRuta ? selectRuta.ruta.ciudad1 : ciudadSalida
    let ciudad2 = selectRuta ? selectRuta.ruta.ciudad2 : ciudadLlegada
    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />

            <View style={styles.contentContainer}>

                <View style={{ flex: 5, }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ justifyContent: "flex-start", marginBottom: 20, marginTop: 20 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> Dirección y Precio</Text>
                        </View>
                        <View>
                            <ProgressBarCustom step={3} />
                        </View>
                        <View style={{ marginTop: 3, marginBottom: 20 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", marginBottom: 20, fontWeight: "800" }}> Escoja la ciudad de salida {selectService == "encomienda" ? "(Remitente)" : ""}: </Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <ButtonStyledImg text={ciudad1} img={Images.Quito} color={colorCity == ciudad1 ? theme.colors.Blue : theme.colors.BackGroundInpu} width={"45%"} onPress={() => {
                                    if (selectService == "encomienda") {
                                        handleButtonPress(ciudad1)
                                        // handleCity(ciudad1)
                                        updateRegisterEnco("ciudadRemitente", "ciudad", ciudad1)
                                        updateRegisterEnco("ciudadDestinatario", "ciudad", ciudad2)
                                    } else {
                                        handleButtonPress(ciudad1)
                                        // handleCity(ciudad1)
                                        updateRegisterForm("ciudadSalida", "ciudad", ciudad1)
                                        updateRegisterForm("ciudadLlegada", "ciudad", ciudad2)
                                    }
                                }}
                                />
                                <ButtonStyledImg text={ciudad2} img={Images.Tena} color={colorCity == ciudad2 ? theme.colors.Blue : theme.colors.BackGroundInpu} width={"45%"} onPress={() => {
                                    if (selectService == "encomienda") {
                                        handleButtonPress(ciudad2)
                                        // handleCity(ciudad2)
                                        updateRegisterEnco("ciudadRemitente", "ciudad", ciudad2)
                                        updateRegisterEnco("ciudadDestinatario", "ciudad", ciudad1)
                                    } else {
                                        handleButtonPress(ciudad2)
                                        // handleCity(ciudad2)
                                        updateRegisterForm("ciudadSalida", "ciudad", ciudad2)
                                        updateRegisterForm("ciudadLlegada", "ciudad", ciudad1)
                                    }
                                }
                                } />
                            </View>
                        </View>
                        <View style={{ marginTop: 3, marginBottom: 15 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", marginBottom: 25, fontWeight: "800" }}> Escoja la dirección de salida: </Text>
                            <ButtonStyledImg text={selectService == "encomienda" ? registerEncomienda.ciudadRemitente.direccion : registerForm.ciudadSalida.direccion} height={60} color={theme.colors.BackGroundInpu} icon={"right"} width={'100%'} marginStart={10} onPress={() => {
                                if (locationServiceEnabled.status == "granted") {
                                    colorCity ?
                                        ciudadSelect(true)
                                        : Alert.alert("INFO", "Por favor, seleccione la ciudad de salida")
                                } else {
                                    setShowModal(true)
                                }
                            }} />
                        </View>
                        <View style={{ marginTop: 3, marginBottom: 15 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", marginBottom: 25, fontWeight: "800" }}> Escoja la dirección de llegada {selectService == "encomienda" ? "(Destinatario)" : ""}: </Text>
                            <ButtonStyledImg text={selectService == "encomienda" ? registerEncomienda.ciudadDestinatario.direccion : registerForm.ciudadLlegada.direccion} height={60} color={theme.colors.BackGroundInpu} icon={"right"} width={'100%'} marginStart={10} onPress={() => {
                                if (locationServiceEnabled.status == "granted") {
                                    colorCity ?
                                        ciudadSelect(false)
                                        : Alert.alert("INFO", "Por favor, seleccione la ciudad de salida")
                                } else {
                                    setShowModal(false)
                                }
                            }} />
                        </View>
                        <View style={{ marginTop: 3, marginBottom: 20 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subtitle, textAlign: "left", marginBottom: 25, fontWeight: "800" }}> Precio{selectService == "encomienda" ? ":" : " y distancia:"} </Text>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1, alignItems: "flex-start" }}>
                                    <ButtonStyledImg text={selectService == "encomienda" ? "$" + registerEncomienda.precio : "$" + registerForm.precio} potition={"left"} marginStart={15} img={Images.Cash} color={theme.colors.BackGroundInpu} width={selectService === "encomienda" ? '100%' : "90%"} disabled={true} />
                                </View>
                                {
                                    selectService === "encomienda" ? null :
                                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                                            <ButtonStyledImg text={distancia ? distancia + " km" : 0 + " km"} fontSize={14} fin potition={"left"} marginStart={15} img={Images.Viajar} color={theme.colors.BackGroundInpu} width={'90%'} disabled={true} />
                                        </View>}
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
                    <ButtonStyledImg text={"Siguiente"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
                        if (selectService == "encomienda") {
                            if (registerEncomienda.ciudadRemitente.direccion.length !== 0 && registerEncomienda.ciudadDestinatario.direccion.length !== 0 && colorCity !== null && colorCity !== undefined && colorCity.trim() !== "") {
                                handleStatus();
                            } else {
                                Alert.alert("INFO", "Por favor, llena todos los campos")
                            }
                        } else {
                            if (registerForm.ciudadSalida.direccion.length !== 0 && registerForm.ciudadLlegada.direccion.length !== 0 && colorCity !== null && colorCity !== undefined && colorCity.trim() !== "") {
                                navigation.navigate(ROUTES.RESUMENSCREEN_EDIT)
                            } else {
                                Alert.alert("INFO", "Por favor, llena todos los campos")
                            }
                        }

                    }}
                    />
                    <ButtonStyledImg text={"Atrás"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => navigation.goBack()}
                    />
                </View>
            </View>
            <CustomModal isVisible={showModal} modalContent={<GetPermissonGps />} closeModal={handleModalClose} pregunta={"Es necesario activar el permiso de ubicación"} />
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


});

