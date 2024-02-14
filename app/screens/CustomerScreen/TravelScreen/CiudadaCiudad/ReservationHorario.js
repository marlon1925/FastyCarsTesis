import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, AppState, Alert, Platform } from 'react-native';
import { theme } from '../../../../styles/theme';
import Constants from 'expo-constants';
import { ProgressBarCustom } from '../../../../components/ProgressBarCustom';
import { Images } from '../../../../utils/imagenes';
import { check, PERMISSIONS, RESULTS, request, openSettings } from 'react-native-permissions';
import { useFocusEffect } from '@react-navigation/native';
import { LocationServicePermissions } from '../../../../utils/helpers';
import { CustomModal } from '../../../../components/CustomModal';
import { MapScreen } from '../../../../common/MapScreen';
import { UsuarioContext } from '../../../../context/AllContexts';
import * as Location from "expo-location";
import { ROUTES } from '../../../../constants';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ButtonStyledImg } from '../../../../components/ButtonStyledImg';

export const ReservationHorario = ({ navigation }) => {
    const [colorCity, setColorCity] = useState();
    const [locationPermission, setLocationPermission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const appState = useRef(AppState.currentState);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [saveDate, setSaveDate] = useState('');
    const [timeCurrent, setTimeCurrent] = useState('');
    const [dateCurrent, setDateCurrent] = useState('')
    const [locationServiceEnabled, setLocationServiceEnabled] = React.useState({
        status: "denied",
        coordinates: null,
    });
    const [date, setDate] = useState(new Date());
    const [selectHora, setSelecHora] = useState();
    const [show, setShow] = useState(false);
    const { updateBoleto, updateRegisterPriv, registerForm, selectService, distancia, registerPriv, handleIsLoading, handleOrigenCity, updateRegisterOne, updateRegisterOnePriv } = useContext(UsuarioContext)

    let privado = selectService == "priv" || updateBoleto?.tipoBoleto == "Privado";
    let privadoTQ = selectService == "privadoT-Q";
    let encomienda = selectService == "encomienda";
    useEffect(() => {
        verificarUpdate()
    }, [])
    const calculatePrice = async () => {
        console.log("REGISTRO NUMERO DE PAX: ", registerPriv.numPax)
        if (registerPriv.numPax > 4 && registerPriv.numPax < 9) {
            precio = (0.50 * 2).toFixed(2)
        } else if (registerPriv.numPax > 8 && registerPriv.numPax < 13) {
            precio = (0.50 * 3).toFixed(2)
        } else if (registerPriv.numPax > 12 && registerPriv.numPax < 17) {
            precio = (0.50 * 4).toFixed(2)
        } else if (registerPriv.numPax > 16 && registerPriv.numPax < 21) {
            precio = (0.50 * 5).toFixed(2)
        } else {
            precio = 0.50
        }
        console.log("================= Privado ==================")
        console.log("Distancia: ", registerPriv.distancia)
        console.log("Precio: ", precio)
        let resulPrecio = (precio * registerPriv.distancia).toFixed(2)
        console.log("RESULTADO: ", resulPrecio)
        console.log("============================================")
        await updateRegisterOnePriv("precio", resulPrecio)
        await updateRegisterOnePriv("distancia", registerPriv.distancia)
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios'); // Cierra el modal en iOS automáticamente
        setDate(currentDate);
        const horas = currentDate.getHours();
        const minutos = currentDate.getMinutes();
        console.log("Minutos", minutos.toString().length === 1)
        const horaFormateada = `${horas.toString().length === 1 ? "0" + horas.toString() : horas}:${minutos.toString().length === 1 ? "0" + minutos.toString() : minutos}`;
        console.log("slece", horaFormateada)
        if (dateCurrent == registerPriv.turno.fecha) {
            console.log("=========00", timeCurrent)
            if (horaFormateada > timeCurrent) {
                setSelecHora(horaFormateada)
                updateRegisterPriv("turno", "horario", horaFormateada)
                console.log("horaFormateada", horaFormateada)
            } else {
                Alert.alert("ERROR", "La hora seleccionada debe ser posterior a la hora actual, con un margen de al menos una hora de antelación.")
            }
        } else {
            setSelecHora(horaFormateada)
            updateRegisterPriv("turno", "horario", horaFormateada)
            console.log("horaFormateada", horaFormateada)
        }

    };

    const handleModalClose = () => {
        setShowModal(false);
    };
    const showTimepicker = () => {
        setShow(true);
    };

    const verificarUpdate = async () => {
        try {
            handleIsLoading(true)
            if (updateBoleto) {
                console.log("Upda", updateBoleto.ciudadSalida.direccion)
                updateRegisterPriv("ciudadSalida", "direccion", updateBoleto.ciudadSalida.direccion)
                updateRegisterPriv("ciudadSalida", "ciudad", updateBoleto.ciudadSalida.ciudad)
                updateRegisterPriv("ciudadSalida", "longitud", updateBoleto.ciudadSalida.longitud)
                updateRegisterPriv("ciudadSalida", "latitud", updateBoleto.ciudadSalida.latitud)
                updateRegisterPriv("ciudadLlegada", "direccion", updateBoleto.ciudadLlegada.direccion)
                updateRegisterPriv("ciudadLlegada", "ciudad", updateBoleto.ciudadLlegada.ciudad)
                updateRegisterPriv("ciudadLlegada", "longitud", updateBoleto.ciudadLlegada.longitud)
                updateRegisterPriv("ciudadLlegada", "latitud", updateBoleto.ciudadLlegada.latitud)
                updateRegisterPriv("turno", "fecha", updateBoleto.turno.fecha)
                updateRegisterPriv("turno", "horario", updateBoleto.turno.horario)
                updateRegisterOnePriv("precio", updateBoleto.precio)
                updateRegisterOnePriv("distancia", updateBoleto.distancia)
            }
        } catch (error) {
            console.log("Error al guardar privado: ", error)
        } finally {
            handleIsLoading(false)
        }
    }
    // Verificar y solicitar permisos cada vez que la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            VerifyPermissions();
        }, [])
    );
    const VerifyPermissions = async () => {
        console.log("REGISTRO PRIVADO: ", registerPriv.distancia)
        registerPriv.distancia ? calculatePrice() : null;
        const response = await LocationServicePermissions();
        console.log("\n - - - - - - -  - - - - - -  - - -- - - - - -");
        console.log("PERMISOS DE LOCACION DESPUES: ", response);
        console.log("\n - - - - - - -  - - - - - -  - - -- - - - - -");
        setLocationServiceEnabled(response);
    };
    const obtenerFechaEcuador = async () => {
        try {
            const response = await axios.get('https://worldtimeapi.org/api/timezone/America/Guayaquil');
            const fechaActual = new Date(response.data.utc_datetime);
            const anio = fechaActual.getFullYear();
            const mes = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses son indexados desde 0
            const dia = fechaActual.getDate();
            const fechaSinHora = `${anio}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
            setDateCurrent(fechaSinHora);
            const opciones = { hour12: false, hour: '2-digit', minute: '2-digit' };
            const horaActual = fechaActual.toLocaleTimeString('en-US', opciones);

            // Convertir la hora actual a un objeto Date
            const horaActualDate = new Date(`2000-01-01T${horaActual}`);

            // Sumar una hora
            horaActualDate.setHours(horaActualDate.getHours() + 1);

            // Obtener la nueva hora formateada
            const nuevaHoraFormateada = horaActualDate.toLocaleTimeString('en-US', opciones);
            console.log("HORA", nuevaHoraFormateada)
            setTimeCurrent(nuevaHoraFormateada); // Formato 00:00
            if (registerPriv?.turno?.fecha.length !== 0) {
                setSaveDate(registerPriv.turno.fecha);
                setSelectedDate(registerPriv.turno.fecha);
            } else {
                updateRegisterPriv('turno', 'fecha', fechaSinHora);
                setSaveDate(fechaSinHora);
                setSelectedDate(fechaSinHora);
            }
            updateBoleto ? updateRegisterPriv('turno', 'fecha', updateBoleto.turno.fecha) : null

        } catch (error) {
            console.error('Error al obtener la fecha de Ecuador:', error);
        }
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
        console.log(buttonId)
        setColorCity((prevButton) => (prevButton === buttonId ? null : buttonId))

        if (buttonId) {
            updateRegisterPriv("ciudadSalida", "ciudad", "")
            updateRegisterPriv("ciudadLlegada", "ciudad", "")
            updateRegisterPriv("ciudadLlegada", "direccion", "");
            updateRegisterPriv("ciudadSalida", "direccion", "");

        }

    };
    const handleButtonPressUpdate = (buttonId, state) => {
        // Cambia el botón seleccionado según el id del botón
        console.log(buttonId)
        setColorCity((prevButton) => (prevButton === buttonId ? null : buttonId))


    };
    const openAppSettings = async () => {
        await openSettings();
    };
    const closeModal = () => {
        setCalendarVisible(false)
        setSelecHora("")
        updateRegisterPriv('turno', 'horario', "");
        updateRegisterPriv('turno', 'fecha', saveDate);


    };
    const GetModalContentCalendario = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <Calendar
                    onDayPress={onDayPress}
                    markedDates={{
                        [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                    }}
                    minDate={new Date().toDateString()}
                />
                <TouchableOpacity onPress={() => {
                    closeModal()
                }} style={{ marginTop: 10, padding: 10, backgroundColor: theme.colors.BackGroundBlue, borderRadius: 5 }}>
                    <Text style={{ color: 'white' }}>OK</Text>
                </TouchableOpacity>
            </View>
        )
    };
    const toggleCalendar = () => {
        setCalendarVisible(!calendarVisible);
    };
    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSaveDate(day.dateString)
        updateRegisterPriv("turno", "fecha", day.dateString)
    };

    const GetPermissonGps = () => {
        return (
            <View style={{ alignItems: "center", width: "100%" }}>
                <View style={{ width: "70%", marginBottom: 15 }}>
                    <ButtonStyledImg text={"Ir a configuraciónes"} width={"100%"} color={theme.colors.BackGroundInpu} onPress={() => {
                        openAppSettings()
                        setShowModal(false)
                    }} />
                </View>
            </View>
        )
    }
    const LocationServicePermissions = async () => {

        try {
            handleIsLoading(true)
            await obtenerFechaEcuador();
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
    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 20, }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.contentContainer}>
                    <View>
                        <ProgressBarCustom step={2} />
                    </View>
                    <View style={{ marginTop: 3, marginBottom: 10 }}>
                        <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText, textAlign: "left", marginBottom: 10, fontWeight: "800" }}> Escoja la ciudad de salida: </Text>
                        <View style={{ justifyContent: "space-between" }}>
                            <ButtonStyledImg text={registerPriv.ciudadSalida.direccion} height={60} color={theme.colors.BackGroundInpu} icon={"right"} width={'100%'} onPress={() => {
                                if (locationServiceEnabled.status == "granted") {
                                    ciudadSelect(true)
                                } else {
                                    setShowModal(true)
                                }
                            }} />

                        </View>
                    </View>
                    <View style={{ marginTop: 3, marginBottom: 10 }}>
                        <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText, textAlign: "left", marginBottom: 10, fontWeight: "800" }}> Escoja la ciudad de llegada: </Text>
                        <View style={{ justifyContent: "space-between" }}>
                            <ButtonStyledImg text={registerPriv.ciudadLlegada.direccion} height={60} color={theme.colors.BackGroundInpu} icon={"right"} width={'100%'} onPress={() => {
                                if (registerPriv.ciudadSalida.direccion) {
                                    ciudadSelect(false)
                                } else {
                                    Alert.alert("FORMULARIO", "Por favor ingrese la dirección de salida")
                                }
                            }} />

                        </View>
                    </View>
                    <View style={{ marginTop: 3, marginBottom: 10 }}>
                        <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText, textAlign: "left", marginBottom: 10, fontWeight: "800" }}> Escoja la fecha del viaje: </Text>
                        <ButtonStyledImg text={registerPriv.turno.fecha} color={theme.colors.BackGroundInpu} potition={"flex-start"} marginStart={10} icon={"right"} width={'100%'} onPress={() => {
                            setCalendarVisible(true)
                        }} />
                    </View>
                    <View style={{ marginTop: 3, marginBottom: 10 }}>
                        <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText, textAlign: "left", marginBottom: 10, fontWeight: "800" }}> Escoja la hora del viaje: </Text>
                        <ButtonStyledImg text={registerPriv.turno.horario ? registerPriv.turno.horario >= "12:00" ? registerPriv.turno.horario + " PM" : registerPriv.turno.horario + " AM" : null} color={theme.colors.BackGroundInpu} potition={"flex-start"} marginStart={10} icon={"right"} width={'100%'} onPress={() => {
                            showTimepicker();
                        }} />
                    </View>
                    <View style={{ marginTop: 3, marginBottom: 10 }}>
                        <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText, textAlign: "left", marginBottom: 15, fontWeight: "800" }}> Precio y distancia: </Text>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1, alignItems: "flex-start" }}>
                                <ButtonStyledImg text={"$ " + registerPriv.precio} potition={"left"} marginStart={15} img={Images.Cash} color={theme.colors.BackGroundInpu} width={'90%'} />
                            </View>
                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                                <ButtonStyledImg text={updateBoleto ? registerPriv.distancia + " km" : distancia ? distancia + " km" : 0 + " km"} fontSize={14} fin potition={"left"} marginStart={15} img={Images.Viajar} color={theme.colors.BackGroundInpu} width={'90%'} />
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, height: "100%", justifyContent: "flex-end", }}>
                        <ButtonStyledImg text={"Siguiente"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {

                            if (registerPriv.ciudadSalida.direccion.length !== 0 && registerPriv.ciudadLlegada.direccion.length !== 0 && registerPriv.turno.horario) {
                                navigation.navigate(ROUTES.RESUMENSCREEN_EDIT)
                            } else {
                                Alert.alert("INFO", "Por favor, llena todos los campos")
                            }

                        }}
                        />
                        <ButtonStyledImg text={"Atrás"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => navigation.goBack()}
                        />
                    </View>
                </View>
            </ScrollView>
            <CustomModal isVisible={showModal} modalContent={<GetPermissonGps />} closeModal={handleModalClose} pregunta={"Es necesario activar el permiso de ubicación"} />
            <CustomModal isVisible={calendarVisible} closeModal={closeModal} pregunta={"Ingresa la fecha del viaje"} modalContent={<GetModalContentCalendario />} />
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
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

