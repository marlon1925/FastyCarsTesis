import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { theme } from '../../styles/theme';
import Constants from 'expo-constants';
import { Button, Image } from '@rneui/base';
import { Images } from '../../utils/imagenes';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UsuarioContext } from '../../context/AllContexts';
import ButtonStyledImg from '../../components/ButtonStyledImg';
import { ROUTES } from '../../constants';
import ButtonStyled from '../../components/ButtonStyled';
import { HelperText, TextInput } from 'react-native-paper';
import { GotoBack, baseURL, regexSoloLetras, validateCorrectEmail, validateCorrectPassword, validateCorrectPhone } from '../../utils/helpers';

export const VerificatedCode = ({ navigation, route }) => {
    const registro = route.params.registerForm;
    const tipoVerifi = route.params.tipoVerifi;
    const rol = route.params.rol;
    const { userInfo, handleIsLoading } = useContext(UsuarioContext)
    const [timeRemaining, setTimeRemaining] = useState(120); // Inicializar con el tiempo en segundos (60 segundos = 1 minuto)
    const [registerForm, setRegisterForm] = useState({
        codigo: '',
    });

    useEffect(() => {
        let intervalId;

        if (timeRemaining > 0) {
            intervalId = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        } else {
            // El tiempo ha llegado a cero, puedes realizar alguna acción aquí si es necesario.
        }

        return () => {
            // Limpia el intervalo cuando el componente se desmonta.
            clearInterval(intervalId);
        };
    }, [timeRemaining]);

    const sendEmail = async () => {
        try {
            handleIsLoading(true);
            setTimeRemaining(setTimeRemaining + 120);

            const url = rol ? `${baseURL()}conductor/recuperar-password` : `${baseURL()}recuperar-password`;
            const options = {
                method: 'POST',
                body: JSON.stringify({ correo: registro.correo }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();

            if (respuesta.ok) {
                Alert.alert("CÓDIGO", "Reenvío exitoso");
            } else {
                Alert.alert("CONTRASEÑA", bodyResponse.msg);
            }

        } catch (error) {
            console.log(error);
        } finally {
            handleIsLoading(false);
        }
    };


    const getCodeToken = async () => {
        try {
            handleIsLoading(true)
            let service = rol ? "conductor/recuperar-password/" : "recuperar-password/"
            const url = tipoVerifi == "recuperar" ? `${baseURL()}${service}${registerForm.codigo}` : `${baseURL()}confirmar/${registerForm.codigo}`;
            console.log(url)
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            console.log(bodyResponse)
            if (respuesta.ok) {
                Alert.alert("TOKEN", bodyResponse.msg)
                tipoVerifi == "recuperar" ? navigation.navigate(ROUTES.CHANGE_PASSWORD_REGISTER, { token: registerForm.codigo, rol: rol }) : navigation.navigate(ROUTES.LOGIN_NAV)
            } else {
                Alert.alert("TOKEN", bodyResponse.msg)
            }

        } catch (error) {
            console.error("Error al obterner codidigo", error)
        } finally {
            handleIsLoading(false)
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, height: theme.dimensions.height }}
        >
            <View
                style={[styles.container, { marginTop: Constants.statusBarHeight }]}
            >
                <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
                <View style={styles.contentContainer}>
                    <View style={{ flex: 1 }}>
                        {/* <GotoBack navigation={navigation} /> */}
                        <View style={{ flex: 1, justifyContent: "flex-start" }}>
                            <View style={{ flex: 0.1, justifyContent: "center" }}>
                                <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Confirmar código</Text>
                            </View>
                            <View style={{ flex: 0.1, justifyContent: "center", marginBottom: 20 }}>
                                <Text style={{ fontSize: 18 }}>Se envió un código de verificación al correo electrónico:</Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{registro.correo}</Text>
                            </View>
                            <TextInput
                                autoCapitFalize="none"
                                label="Codigo"
                                value={registerForm.codigo}
                                keyboardType="email-address"
                                onChangeText={(txt) => {
                                    setRegisterForm({ ...registerForm, codigo: txt.trim() });

                                }}
                                mode="outlined"
                                placeholder="Codigo"
                                outlineColor="#666666"
                                activeOutlineColor="#666666"
                                outlineStyle={styles.inputPassword}
                                style={styles.inputStyle}
                                maxLength={11}
                            />
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ fontFamily: theme.fonts.inter, fontSize: theme.fontSize.actionText }}>¿Cambiar correo electrónico? <Text onPress={() => navigation.goBack()} style={{ textDecorationLine: 'underline', fontStyle: "italic" }}>Aquí</Text></Text>
                            </View>

                            <View style={{ flex: 0.2, marginTop: 20 }}>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    {/* <ButtonStyledImg onPress={() => getCodeToken()} width={"100%"} disabled={registerForm.codigo.length} color={theme.colors.ColorGrayButtom} text={"Verificar código"} textColor={"white"} /> */}
                                    <TouchableOpacity style={styles.buttonContent} onPress={() => getCodeToken()}>
                                        <Text style={{ color: "white", fontSize: 18 }}>Verificar código</Text>
                                    </TouchableOpacity>

                                    {/* <View style={{ flex: 1, justifyContent: "flex-start" }}>
                                    <ButtonStyledImg onPress={() => changePassword()} width={"100%"} disabled={registerForm.codigo.length} color={theme.colors.ColorGrayButtom} text={"Reenviar código"} textColor={"white"} />
                                </View> */}
                                </View>
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    {/* <ButtonStyledImg onPress={() => getCodeToken()} width={"100%"} disabled={registerForm.codigo.length} color={theme.colors.ColorGrayButtom} text={"Verificar código"} textColor={"white"} /> */}
                                    {tipoVerifi == "recuperar" ?
                                        timeRemaining > 0 ? (
                                            <Text style={styles.timerText}>
                                                {timeRemaining > 0 ? `Reenviar código en ${timeRemaining} segundos` : 'Puedes reenviar el código'}
                                            </Text>
                                        ) : (
                                            <TouchableOpacity style={styles.buttonContent} onPress={() => sendEmail()}>
                                                <Text style={{ color: "white", fontSize: 18 }}>Reenviar código</Text>
                                            </TouchableOpacity>
                                        )
                                        : null
                                    }


                                    {/* <View style={{ flex: 1, justifyContent: "flex-start" }}>
                                    <ButtonStyledImg onPress={() => changePassword()} width={"100%"} disabled={registerForm.codigo.length} color={theme.colors.ColorGrayButtom} text={"Reenviar código"} textColor={"white"} />
                                </View> */}
                                </View>


                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView >
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
        flex: 2,
        width: "100%",
        padding: 30,
        justifyContent: "flex-start",
        paddingTop: "0%",
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        backgroundColor: "#ffffff",
        width: theme.dimensions.width,
    },
    icon: {
        width: 80, // Set the width and height of your image
        height: 80,
    },
    styleTex: {
        fontFamily: theme.fonts.interSBold,
        fontSize: theme.fontSize.subheading,
        marginTop: 20
    },
    inputStyle: {
        fontFamily: "Lato_400Regular_Italic",
        fontSize: theme.fontSize.body,
        backgroundColor: theme.colors.BackGroundWhite,
        //marginTop: 5,
        color: theme.colors.grey,
        zIndex: 1,
    },
    inputPassword: {
        borderRadius: 15,
        borderColor: theme.colors.ColorGrayButtom,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        height: 40,
        margin: 10,
        backgroundColor: theme.colors.ColorGray
    },
    timerText: {
        color: '#0f0f0f',
        fontSize: 18,
        textAlign: "center",
        marginBottom: 10,
    },

});