import React, { useContext, useEffect, useState } from 'react';
import { CustomModal } from '../../../../../components/CustomModal';
import { Calendar } from 'react-native-calendars';
import { theme } from '../../../../../styles/theme';
import Constants from 'expo-constants';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import { ROUTES } from '../../../../../constants';
import { ProgressBarCustom } from '../../../../../components/ProgressBarCustom';
import { Images } from '../../../../../utils/imagenes';
import { UsuarioContext } from '../../../../../context/AllContexts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ButtonStyledImg } from '../../../../../components/ButtonStyledImg';

export const HorariosReser = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [saveDate, setSaveDate] = useState('');
    const [dateCurrent, setDateCurrent] = useState('')
    const [colorHourHand, setColorHourHand] = useState('');
    const [timeCurrent, setTimeCurrent] = useState('');
    const [calendarVisible, setCalendarVisible] = useState(false);
    const { updateRegisterForm, registerEncomienda, registerForm, selectRuta, selectService, updateBoleto, updateRegisterEnco, handleIsLoading } = useContext(UsuarioContext);
    const [selectHora, setSelecHora] = useState();
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const horarios = {
        "horario1": "05:00 AM",
        "horario2": "12:00 PM",
        "horario3": "17:00 PM"
    }
    useEffect(() => {
        const obtenerFechaEcuador = async () => {
            try {
                handleIsLoading(true);
                const response = await axios.get('https://worldtimeapi.org/api/timezone/America/Guayaquil');
                const fechaActual = new Date(response.data.utc_datetime);
                const anio = fechaActual.getFullYear();
                const mes = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses son indexados desde 0
                const dia = fechaActual.getDate();
                const fechaSinHora = `${anio}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
                setDateCurrent(fechaSinHora);
                const opciones = { hour12: false, hour: '2-digit', minute: '2-digit' };
                const horaActual = fechaActual.toLocaleTimeString('en-US', opciones);
                if (selectService == "priv" || selectService == "privadoT-Q" || updateBoleto?.tipoBoleto == "Privado") {
                    // Convertir la hora actual a un objeto Date
                    const horaActualDate = new Date(`2000-01-01T${horaActual}`);
                    // Sumar una hora
                    horaActualDate.setHours(horaActualDate.getHours() + 1);
                    // Obtener la nueva hora formateada
                    const nuevaHoraFormateada = horaActualDate.toLocaleTimeString('en-US', opciones);
                    setTimeCurrent(nuevaHoraFormateada); // Formato 00:00
                } else {
                    setTimeCurrent(horaActual)
                }
                if (registerForm.turno.fecha.length !== 0 || registerEncomienda.turno.fecha.length !== 0) {
                    if (selectService == "encomienda") {
                        setSaveDate(registerEncomienda.turno.fecha);
                        setSelectedDate(registerEncomienda.turno.fecha);
                    } else {
                        setSaveDate(registerForm.turno.fecha);
                        setSelectedDate(registerForm.turno.fecha);
                    }
                } else {
                    if (selectService == "encomienda") {
                        updateRegisterEnco('turno', 'fecha', fechaSinHora);
                    } else {
                        updateRegisterForm('turno', 'fecha', fechaSinHora);
                    }
                    setSaveDate(fechaSinHora);
                    setSelectedDate(fechaSinHora);
                }
                handleButtonPress(updateBoleto?.turno?.horario, "horario");
                updateBoleto ? updateRegisterForm('turno', 'fecha', updateBoleto.turno.fecha) : null

            } catch (error) {
                console.error('Error al obtener la fecha de Ecuador:', error);
            } finally {
                handleIsLoading(false);
            }
        };

        obtenerFechaEcuador();
    }, []);

    let encomienda = selectService == "encomienda"
    const showTimepicker = () => {
        setShow(true);
    };
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios'); // Cierra el modal en iOS automáticamente
        setDate(currentDate);
        const horas = currentDate.getHours();
        const minutos = currentDate.getMinutes();
        const horaFormateada = `${horas.toString().length === 1 ? "0" + horas.toString() : horas}:${minutos.toString().length === 1 ? "0" + minutos.toString() : minutos}`;
        if (dateCurrent == registerForm.turno.fecha || dateCurrent == registerEncomienda.turno.fecha) {
            if (horaFormateada > timeCurrent) {
                setSelecHora(horaFormateada)
                updateRegisterForm("turno", "horario", horaFormateada)
            } else {
                Alert.alert("ERROR", "La hora seleccionada debe ser posterior a la hora actual, con un margen de al menos una hora de antelación.")
            }
        } else {
            setSelecHora(horaFormateada)
            updateRegisterForm("turno", "horario", horaFormateada)
        }

    };
    const handleButtonPress = (buttonId, state) => {
        // Cambia el botón seleccionado según el id del botón
        setColorHourHand((prevButton) => (prevButton === buttonId ? null : buttonId))

    };



    const closeModal = () => {
        setCalendarVisible(false)
        if (selectService == "encomienda") {
            updateRegisterEnco('turno', 'fecha', saveDate);
            setColorHourHand('')
        } else {
            updateRegisterForm('turno', 'fecha', saveDate);
            setColorHourHand('')
        }


    };
    const GetModalContentCalendario = () => {

        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <Calendar
                    onDayPress={onDayPress}
                    markedDates={{
                        [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orangeorange' },
                    }}
                    minDate={new Date().toISOString().split('T')[0]}
                />
                <TouchableOpacity onPress={closeModal} style={{ marginTop: 10, padding: 10, backgroundColor: theme.colors.BackGroundBlue, borderRadius: 5 }}>
                    <Text style={{ color: 'white' }}>OK</Text>
                </TouchableOpacity>
            </View>
        );
    };
    const toggleCalendar = () => {
        setCalendarVisible(!calendarVisible);
    };
    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSaveDate(day.dateString);
    };


    const verificatedTime = (time) => {
        let status
        let numeroExtraido = time.match(/\d+/);
        let intTime = parseInt(numeroExtraido[0]) - 1;
        let registerDate = selectService == "encomienda" ? registerEncomienda.turno.fecha : registerForm.turno.fecha
        if (dateCurrent == registerDate) {
            if (intTime > parseInt(timeCurrent.match(/\d+/))) {
                status = false;
            } else {
                status = true;
            }

        }
        return status
    }

    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <View style={styles.contentContainer}>

                <View style={{ flex: 1.5, marginTop: 5 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ justifyContent: "flex-start", marginBottom: 20, marginTop: 20 }}>
                            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> Fecha y hora del {encomienda ? "Encomienda" : "Viaje"}</Text>
                        </View>
                        <View>
                            <ProgressBarCustom step={2} />
                        </View>
                        <View>
                            <Text style={{ fontWeight: "700", fontSize: theme.fontSize.subtitle, marginBottom: 20, }}> Escoja la fecha del viaje: </Text>
                            <ButtonStyledImg
                                text={selectService == "encomienda" ? registerEncomienda.turno.fecha : registerForm.turno.fecha}
                                width={"100%"}
                                potition={"flex-start"}
                                marginStart={20}
                                color={theme.colors.BackGroundInpu}
                                onPress={() => toggleCalendar()}
                            />
                        </View>
                        <View >
                            {selectService == "pasajero" || selectService === "encomienda" ?
                                <Text style={{ fontWeight: "700", fontSize: theme.fontSize.subtitle, textAlign: "left", marginBottom: 10, marginTop: 10 }}> Escoja los horarios disponibles: </Text>
                                : null}
                        </View>
                        {
                            selectService === "pasajero" || selectService === "encomienda" || updateBoleto ? (
                                Object.entries(selectRuta?.horario || horarios).map(([key, value]) => (
                                    <View key={value} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <ButtonStyledImg
                                            text={value}
                                            //icon2={verificatedTime(value) ? "lock-off" : null}
                                            coloricon2={"#e65050"}
                                            img={value === '05:00 AM' ? Images.morning : value === '12:00 PM' ? Images.afternoon : Images.ninght}
                                            //disabled={verificatedTime(value)}
                                            onPress={() => {
                                                if (verificatedTime(value)) {
                                                    (Alert.alert("HORARIOS", "El horario ya no esta disponible para hoy por que ya paso la hora"))
                                                } else {
                                                    handleButtonPress(value, "horario");
                                                    if (colorHourHand !== "morning") {
                                                        if (selectService === "encomienda") {
                                                            updateRegisterEnco('turno', 'horario', value);
                                                        } else {
                                                            updateRegisterForm('turno', 'horario', value);
                                                        }
                                                    }
                                                    colorHourHand === 'morning' && setColorHourHand('');
                                                }
                                            }}
                                            color={verificatedTime(value) ? theme.colors.ColorDisabled : colorHourHand === value ? theme.colors.Blue : theme.colors.BackGroundInpu}
                                            width={"90%"}
                                        />
                                        {/*
                                            <Text style={{ fontSize: 16, fontStyle: "italic", fontWeight: "700", marginBottom: 10 }}>{verificatedTime(value) ? "Horario no disponible para hoy: " + value : null}</Text>
                                            */}
                                    </View>
                                ))
                            ) : (
                                <View style={{ marginTop: 3, marginBottom: 10 }}>
                                    <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText, textAlign: "left", marginBottom: 10 }}> Escoja la hora del viaje: </Text>
                                    <ButtonStyledImg text={selectHora ? selectHora <= "12:00" ? selectHora + " AM" : selectHora + " PM" : null} color={theme.colors.BackGroundInpu} potition={"flex-start"} marginStart={10} icon={"right"} width={'100%'} onPress={() => {
                                        showTimepicker();
                                    }} />
                                </View>
                            )
                        }
                    </ScrollView>

                </View >
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <ButtonStyledImg text={"Siguiente"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => {
                        if (selectService == "privadoT-Q") {
                            if (registerForm.turno.fecha.length !== 0 && selectHora) {
                                navigation.navigate(ROUTES.DIRECTIONRES_EDIT)
                            } else {
                                Alert.alert("FORMULARIO", "Por favor, llene todos los campos")
                            }
                        } else {
                            colorHourHand == "" || colorHourHand == null ? Alert.alert("FORMULARIO", "Por favor, llene todos los campos")
                                : navigation.navigate(ROUTES.DIRECTIONRES_EDIT)
                        }

                    }
                    }
                    />
                    <ButtonStyledImg text={"Atrás"} width={"100%"} color={theme.colors.ColorGrennButtom} onPress={() => navigation.goBack()}
                    />
                </View>

            </View>
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

            <CustomModal isVisible={calendarVisible} closeModal={closeModal} pregunta={"Ingresa la fecha del viaje"} modalContent={<GetModalContentCalendario />} />
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

