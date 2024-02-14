import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert, TouchableHighlight, TouchableOpacity } from 'react-native';
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

export const TurnosDriver = ({ navigation, route }) => {
    const [select, setSelect] = useState('pendiente');
    const [showModalEdit, setShowmodalEdit] = useState(false);
    const [showModalDelet, setShowmodalDelet] = useState(false);
    const [selectOptions, setSelectOptions] = useState('')
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [saveDate, setSaveDate] = useState('');
    const [pasajeros, setPasajeros] = useState();
    const [encomiendas, setEncomiendas] = useState();
    const { handleIsLoading, reservationLog, handleReservationLog, handleBoletoUpdate, resetReservationPriv, selectService } = useContext(UsuarioContext)

    useFocusEffect(
        useCallback(() => {
            getReservation();
        }, [])
    );
    let service = selectService
    const closeModal = () => {
        showModalEdit ? setShowmodalEdit(false) : showModalDelet ? setShowmodalDelet(false) : calendarVisible ? setCalendarVisible(false) : null
        setSelectedDate();
    }
    const getReservation = async () => {
        handleBoletoUpdate()
        resetReservationPriv()
        const token = await AsyncStorage.getItem('Token');
        const clienteId = await AsyncStorage.getItem('idClient');
        console.log("Token", token);
        console.log("IdCliente", clienteId)
        let body = {
            idConductor: clienteId
        }
        try {
            console.log(body)

            handleIsLoading(true)
            const url = `${baseURL()}chofer/viajes-asigandos`;
            console.log("URL: ", url)
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
                console.log("Repusta", bodyResponse.encomiendas)
                setPasajeros(bodyResponse.boletos)
                setEncomiendas(bodyResponse.encomiendas)
            }

        } catch (error) {
            console.error(error)
        } finally {
            handleIsLoading(false)
        }
    }
    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSaveDate(day.dateString);
    };
    let combinedList = [];
    if (pasajeros && encomiendas) {
        // Ambas listas existen, entonces se pueden combinar
        combinedList = [...pasajeros, ...encomiendas];
    } else if (pasajeros) {
        // Solo hay pasajeros, utiliza la lista de pasajeros
        combinedList = [...pasajeros];
    } else if (encomiendas) {
        console.log("entroooooo")
        // Solo hay encomiendas, utiliza la lista de encomiendas
        combinedList = [...encomiendas];
    }

    const deleteCompartido = async () => {
        const token = await AsyncStorage.getItem('Token')
        try {
            handleIsLoading(true)
            const url = `${baseURL()}eliminar-boleto/${selectOptions._id}`;
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            if (respuesta.ok) {
                Alert.alert("ELIMINAR", bodyResponse?.msg)
                getReservation()
            } else {
                Alert.alert("ELIMINAR", bodyResponse?.msg)
            }
        } catch (error) {
            console.log(error);
        } finally {
            handleIsLoading(false)
        }
    };



    // Asegúrate de que reservationLog no sea null antes de intentar mapear sobre él
    const ContentPediente = () => {
        if (!combinedList || combinedList.length === 0) {
            // Manejar el caso donde reservationLog es null, undefined o vacío
            return <Text>No hay datos disponibles</Text>;
        } else {
            // Verificar si al menos un elemento cumple con la condición
            const tieneElementosValidos = combinedList.map(element => element.estadoPax === "Aprobado" || element.estadoPaquete === "Aprobado");

            let validate = tieneElementosValidos.some((element) => element === true);
            console.log(validate);

            let condiciones = validate || combinedList.some(element => saveDate ? element.estadoPax == "Aprobado" || element.estadoPaquete === "Aprobado" && element.turno.fecha === saveDate : element.estadoPax == "Aprobado" || element.estadoPaquete === "Aprobado")

            if (!condiciones) {
                return <Text>No hay datos disponibles</Text>;
            }
            if (!condiciones) {
                return <Text>No hay datos disponibles</Text>;
            }
            return (
                <>
                    {combinedList.map((element, index) => {
                        // Verificar la condición antes de renderizar el elemento
                        let compartido = element.tipoBoleto === "Compartido"
                        let ciudadSalida = compartido ? "ciudadSalida" : "ciudadRemitente"
                        let ciudadLlegada = compartido ? "ciudadLlegada" : "ciudadDestinatario"
                        if (saveDate ? saveDate == element.turno.fecha && element.estadoPax == "Aprobado" || element.estadoPaquete === "Aprobado" : element.estadoPax == "Aprobado" || element.estadoPaquete === "Aprobado") {
                            return (
                                <TouchableOpacity key={index} onPress={() => {
                                    handleBoletoUpdate(element)
                                    navigation.navigate(ROUTES.RESUMEN_DRIVER_NAV)
                                    underlayColor = "transparent"  // Configura el color de fondo al ser presionado
                                }
                                }>
                                    <View style={{ height: 180, borderWidth: 1.5, borderRadius: 18, padding: 15, justifyContent: "center", marginBottom: 10, }}>
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                            <View style={{ flex: 1, justifyContent: "center" }}>
                                                <Text style={{ fontSize: 20, fontFamily: theme.fonts.inter }}>Tipo: {element.tipoBoleto}</Text>
                                                <Text style={{ fontSize: 20, fontFamily: theme.fonts.inter }}>{element[ciudadSalida].ciudad + " - " + element[ciudadLlegada].ciudad}</Text>
                                                <Text style={{ fontSize: 15, fontFamily: theme.fonts.inter }}>{element.turno.fecha}</Text>
                                                <Text style={{ fontSize: 15, fontFamily: theme.fonts.inter }}>{element.turno.horario}</Text>
                                            </View>
                                            <View style={{ flex: 0.5, alignItems: "center", flexDirection: "row" }}>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <ButtonStyledImg width={50} icon={"eyeo"} onPress={() => {
                                                        handleBoletoUpdate(element)
                                                        navigation.navigate(ROUTES.RESUMEN_DRIVER_NAV)
                                                    }} />
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity >
                            );
                        }

                        // Devolver null si no cumple la condición para evitar errores
                        return null;
                    })}

                </>
            );
        }


    };

    const ContentFinalizado = () => {
        if (!combinedList || combinedList.length === 0) {
            // Manejar el caso donde reservationLog es null, undefined o vacío
            return <Text>No hay datos disponibles</Text>;
        } else {
            // Verificar si al menos un elemento cumple con la condición
            const tieneElementosValidos = combinedList.map(element => element.estadoPax === "Completado" || element.estadoPaquete === "Completado");

            let validate = tieneElementosValidos.some((element) => element === true);
            console.log(validate);

            let condiciones = validate || combinedList.some(element => saveDate ? element.estadoPax == "Completado" || element.estadoPaquete === "Completado" && element.turno.fecha === saveDate : element.estadoPax == "Completado" || element.estadoPaquete === "Completado")

            if (!condiciones) {
                return <Text>No hay datos disponibles</Text>;
            }
            return (
                <>
                    {combinedList.map((element, index) => {
                        // Verificar la condición antes de renderizar el elemento
                        let compartido = element.tipoBoleto === "Compartido"
                        let ciudadSalida = compartido ? "ciudadSalida" : "ciudadRemitente"
                        let ciudadLlegada = compartido ? "ciudadLlegada" : "ciudadDestinatario"
                        if (saveDate ? element.estadoPax == "Completado" || element.estadoPaquete === "Completado" && element.turno.fecha === saveDate : element.estadoPax == "Completado" || element.estadoPaquete === "Completado") {
                            return (
                                <TouchableOpacity key={index} onPress={() => {
                                    handleBoletoUpdate(element)
                                    navigation.navigate(ROUTES.RESUMEN_DRIVER_NAV)
                                }
                                }>
                                    <View style={{ height: 180, borderWidth: 1.5, borderRadius: 18, padding: 15, justifyContent: "center", marginBottom: 10, }}>
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                            <View style={{ flex: 1, justifyContent: "center" }}>
                                                <Text style={{ fontSize: 20, fontFamily: theme.fonts.inter }}>Tipo: {element.tipoBoleto}</Text>
                                                <Text style={{ fontSize: 20, fontFamily: theme.fonts.inter }}>{element[ciudadSalida].ciudad + " - " + element[ciudadLlegada].ciudad}</Text>
                                                <Text style={{ fontSize: 15, fontFamily: theme.fonts.inter }}>{element.turno.fecha}</Text>
                                                <Text style={{ fontSize: 15, fontFamily: theme.fonts.inter }}>{element.turno.horario}</Text>
                                            </View>
                                            <View style={{ flex: 0.5, alignItems: "center", flexDirection: "row" }}>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <ButtonStyledImg width={50} icon={"eyeo"} onPress={() => {
                                                        handleBoletoUpdate(element)
                                                        navigation.navigate(ROUTES.RESUMEN_DRIVER_NAV)
                                                    }} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity >
                            );
                        }

                        // Devolver null si no cumple la condición para evitar errores
                        return null;
                    })}

                </>
            )
        }
    }
    const ContentAccept = () => {
        if (!combinedList || combinedList.length === 0) {
            // Manejar el caso donde reservationLog es null, undefined o vacío
            return <Text>No hay datos disponibles</Text>;
        } else {
            // Verificar si al menos un elemento cumple con la condición
            const tieneElementosValidos = combinedList.map(element => element.estadoPax === "En tránsito" || element.estadoPaquete === "En tránsito");

            let validate = tieneElementosValidos.some((element) => element === true);
            console.log(validate);

            let condiciones = validate || combinedList.some(element => saveDate ? element.estadoPax == "En tránsito" || element.estadoPaquete === "En tránsito" && element.turno.fecha === saveDate : element.estadoPax == "En tránsito" || element.estadoPaquete === "En tránsito")

            if (!condiciones) {
                return <Text>No hay datos disponibles</Text>;
            }
            return (
                <>
                    {combinedList.map((element, index) => {
                        // Verificar la condición antes de renderizar el elemento
                        let compartido = element.tipoBoleto === "Compartido"
                        let ciudadSalida = compartido ? "ciudadSalida" : "ciudadRemitente"
                        let ciudadLlegada = compartido ? "ciudadLlegada" : "ciudadDestinatario"
                        if (saveDate ? element.estadoPax == "En tránsito" || element.estadoPaquete === "En tránsito" && element.turno.fecha === saveDate : element.estadoPax == "En tránsito" || element.estadoPaquete === "En tránsito") {
                            return (
                                <TouchableOpacity key={index} onPress={() => {
                                    handleBoletoUpdate(element)
                                    navigation.navigate(ROUTES.RESUMEN_DRIVER_NAV)
                                }
                                }>
                                    <View style={{ height: 180, borderWidth: 1.5, borderRadius: 18, padding: 15, justifyContent: "center", marginBottom: 10, }}>
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                            <View style={{ flex: 1, justifyContent: "center" }}>
                                                <Text style={{ fontSize: 20, fontFamily: theme.fonts.inter }}>Tipo: {element.tipoBoleto}</Text>
                                                <Text style={{ fontSize: 20, fontFamily: theme.fonts.inter }}>{element[ciudadSalida].ciudad + " - " + element[ciudadLlegada].ciudad}</Text>
                                                <Text style={{ fontSize: 15, fontFamily: theme.fonts.inter }}>{element.turno.fecha}</Text>
                                                <Text style={{ fontSize: 15, fontFamily: theme.fonts.inter }}>{element.turno.horario}</Text>
                                            </View>
                                            <View style={{ flex: 0.5, alignItems: "center", flexDirection: "row" }}>
                                                <View style={{ flex: 1, alignItems: "center" }}>
                                                    <ButtonStyledImg width={50} icon={"eyeo"} onPress={() => {
                                                        handleBoletoUpdate(element)
                                                        navigation.navigate(ROUTES.RESUMEN_DRIVER_NAV)
                                                    }} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity >
                            );
                        } else {
                            // Devolver null si no cumple la condición para evitar errores
                            return;
                        }

                    })}

                </>
            )
        }
    }
    const handleButtonPress = (buttonId, state) => {
        setSelect((prevButton) => (prevButton === buttonId ? null : buttonId))
    };

    const GetModalContentEdit = () => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Button style={styles.buttonContent} onPress={() => {
                    service == "Compartido" ? navigation.navigate(ROUTES.RESERVATION_EDIT) : navigation.navigate(ROUTES.RESERVATION_CITY_EDIT)
                    handleBoletoUpdate(selectOptions)
                    closeModal()
                }} textColor='white'>Si</Button>
                <Button style={styles.buttonContent} onPress={closeModal} textColor='white'>No</Button>
            </View>
        )
    }
    const toggleCalendar = () => {
        setCalendarVisible(!calendarVisible);
    };
    const GetModalContentDelte = () => {
        return (
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Button style={styles.buttonContent} onPress={() => {
                    console.log("===", selectOptions._id)
                    deleteCompartido()
                    closeModal()
                }} textColor='white'>Si</Button>
                <Button style={styles.buttonContent} onPress={closeModal} textColor='white'>No</Button>
            </View>
        )
    }
    const GetModalContentCalendario = () => {

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <Calendar
                    onDayPress={onDayPress}
                    markedDates={{
                        [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orangeorange' },
                    }}
                    minDate={new Date(2024, 0, 1)}
                />
                <Button onPress={closeModal} textColor='white' style={{ marginTop: 10, padding: 10, backgroundColor: theme.colors.BackGroundBlue, borderRadius: 5 }}>
                    OK
                </Button>
            </View>
        );
    };

    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />

            <View style={styles.contentContainer}>
                <GotoBack navigation={navigation} />
                <View style={{ justifyContent: "flex-start", marginBottom: 20, marginTop: 10 }}>
                    <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> Pasajeros y encomiendas asignados</Text>
                </View>
                <View style={{ height: "10%", flexDirection: "row" }}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        {/* <ButtonStyledImg text={" Pendientes "} onPress={() => setSelect("pendiente")} color={select == 'pendiente' ? theme.colors.Blue : 'white'} width={"90%"} /> */}
                        <Button style={{ backgroundColor: select == 'pendiente' ? theme.colors.Blue : 'white', width: "90%", borderWidth: 1, borderColor: "black" }} textColor='black' onPress={() => setSelect("pendiente")}>
                            Aprobado
                        </Button>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        {/* <ButtonStyledImg text={" En camino "} onPress={() => setSelect("En camino")} color={select == 'En camino' ? theme.colors.Blue : 'white'} width={"90%"} /> */}
                        <Button style={{ backgroundColor: select == 'En camino' ? theme.colors.Blue : 'white', width: "90%", borderWidth: 1, borderColor: "black" }} textColor='black' onPress={() => setSelect("En camino")}>
                            En camino
                        </Button>
                    </View>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        {/* <ButtonStyledImg text={" Finalizados "} onPress={() => setSelect("finalizado")} color={select == 'finalizado' ? theme.colors.Blue : 'white'} width={"90%"} /> */}
                        <Button style={{ backgroundColor: select == 'finalizado' ? theme.colors.Blue : 'white', width: "90%", borderWidth: 1, borderColor: "black" }} textColor='black' onPress={() => setSelect("finalizado")}>
                            Finalizados
                        </Button>
                    </View>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>Filtra por fecha: </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, justifyContent: "center", marginBottom: 10 }}>
                        <ButtonStyledImg color={theme.colors.BackGroundInpu} width={saveDate ? "90%" : "100%"} icon={"right"} text={saveDate ? saveDate : "Seleccione la fecha"} marginStart={5} onPress={() => toggleCalendar()}
                        />
                    </View>

                    {saveDate ?
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <ButtonStyledImg color={theme.colors.ColorRed} width={"90%"} onPress={() => setSaveDate()} icon2={"trash-can-outline"} text={"Borrar búsqueda"} />
                        </View>
                        : null}
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, height: theme.dimensions.height, backgroundColor: theme.colors.BackGroundWhite }}
                >
                    {
                        select == 'pendiente' ? <ContentPediente /> : select == 'finalizado' ? <ContentFinalizado /> : <ContentAccept />
                    }
                </ScrollView>
            </View>
            <CustomModal isVisible={showModalEdit} closeModal={closeModal} pregunta={"¿Estás seguro/a de editar esta reserva?"} modalContent={<GetModalContentEdit />} />
            <CustomModal isVisible={showModalDelet} closeModal={closeModal} pregunta={"¿Estás seguro/a de eliminar esta reserva?"} modalContent={<GetModalContentDelte />} />
            <CustomModal isVisible={calendarVisible} closeModal={closeModal} pregunta={"Ingresa la fecha de búsqueda"} modalContent={<GetModalContentCalendario />} />
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
        flex: 2,
        width: "100%",
        //height: '100%',
        // alignItems: "stretch",
        padding: 30,
        justifyContent: "flex-start",
        paddingTop: "5%",
        backgroundColor: "#ffffff",
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
    buttonContent: {
        justifyContent: "center",
        borderRadius: 15,
        height: 40,
        margin: 10,
        backgroundColor: theme.colors.ColorGray
    },

});