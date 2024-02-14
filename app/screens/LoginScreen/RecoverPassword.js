import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import ImagenInCenter from '../../components/ImagenInCenter';
import { theme } from '../../styles/theme';
import { SimpleBody } from '../../common/SimpleBody';
import { FlexContainer } from '../../common/FlexContainer';
import { Header } from '../../common/Header';
import { InputStyle } from '../../components/InputStyle';
import ButtonStyled from '../../components/ButtonStyled';
import { IMG, ROUTES } from '../../constants';
import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";
import { HelperText, TextInput } from 'react-native-paper';
import { GotoBack, baseURL, validateCorrectEmail } from '../../utils/helpers';
import { UsuarioContext } from '../../context/AllContexts';


export const RecoverPassword = ({ navigation }) => {
    const { handleIsLoading } = useContext(UsuarioContext)
    const [registerForm, setrecoverForm] = useState({
        correo: null,
    });
    const [errors, setErrors] = useState({
        correo: "",
    });
    const sendEmail = async () => {
        try {
            handleIsLoading(true)
            const url = `${baseURL()}recuperar-password`;
            console.log(url)
            const options = {
                method: 'POST',
                body: JSON.stringify(registerForm),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            console.log(options.body)
            console.log(url)
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            if (respuesta.ok) {
                Alert.alert("CÓDIGO ENVIADO", "Hemos enviado el código de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para completar el proceso.");
                navigation.navigate(ROUTES.VERIFICATED_CODE, { registerForm: registerForm, tipoVerifi: "recuperar", rol: false })
                handleIsLoading(false)

            } else {
                sendEmailDriver()
            }
        } catch (error) {
            console.log(error);
        }
    };
    const sendEmailDriver = async () => {
        try {
            handleIsLoading(true)
            const url = `${baseURL()}conductor/recuperar-password`;
            console.log(url)
            const options = {
                method: 'POST',
                body: JSON.stringify(registerForm),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            console.log(options.body)
            console.log(url)
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            if (respuesta.ok) {
                Alert.alert("CÓDIGO ENVIADO", "Hemos enviado el código de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para completar el proceso.");
                navigation.navigate(ROUTES.VERIFICATED_CODE, { registerForm: registerForm, tipoVerifi: "recuperar", rol: true })
            } else {
                Alert.alert("OCURRIO UN ERROR", bodyResponse.msg)
            }

        } catch (error) {
            console.log(error);
        } finally {
            handleIsLoading(false)
        }
    };
    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <View style={styles.cajaCabecera}>
                <Image
                    source={IMG.logoMain}
                    style={{
                        width: 210,
                        height: 210,
                        justifyContent: "center",
                        resizeMode: "stretch",
                        // borderColor:theme.colors.ColorGrayButtom,
                        // borderWidth: 4,
                        // borderRadius: 140
                    }}
                />
            </View>
            <View style={styles.contentContainer}>
                <View style={{ flex: 1, justifyContent: "center", }}>

                    <View style={{ flex: 2, justifyContent: "center", width: "100%", }}>
                        <GotoBack navigation={navigation} />

                        <View style={{ flex: 1.5, justifyContent: "flex-end" }}>
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>Ingrese tu correo electrónico</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: theme.fonts.inter, fontSize: theme.fontSize.titleNotification, textAlign: "left" }}>Recibirás un correo electrónico con instrucciones para restablecer tu contraseña.</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <TextInput
                            autoCapitalize="none"
                            label="Correo"
                            value={registerForm.correo}
                            keyboardType="email-address"
                            onChangeText={(txt) => {
                                setrecoverForm({ ...registerForm, correo: txt });
                                let validate = validateCorrectEmail(txt);
                                //console.log("VALIDACION:", validate);
                                setErrors({ ...errors, correo: validate });
                            }}
                            mode="outlined"
                            placeholder="Correo"
                            outlineColor="#666666"
                            activeOutlineColor="#666666"
                            outlineStyle={styles.inputPassword}
                            style={styles.inputStyle}
                            maxLength={30}
                            error={errors.correo}
                        />
                        {errors.correo && (
                            <HelperText type="error" visible={errors.correo}> {errors.correo} </HelperText>
                        )}
                    </View>

                    <View style={{ flex: 2, justifyContent: "center", }}>
                        <View style={{ flex: 0.4 }}>
                            <ButtonStyled text={"Enviar código"} textColor={"white"} width={"100%"} isDisabled={errors.correo.length !== 0 || registerForm.correo == null} onPress={() => {
                                sendEmail()
                                //navigation.navigate(ROUTES.VERIFICATED_CODE, { registerForm: registerForm, tipoVerifi: "recuperar" })
                            }} color={theme.colors.ColorGrayButtom} radius={20} textSize={20} colorText={theme.colors.BackGroundWhite} />
                        </View>
                    </View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.BackGroundBlue,
        width: "100%",
        height: theme.dimensions.height,
        //alignItems: 'center',
        alignItems: "center",
        justifyContent: "center",
        // padding: 10,
    },
    contentContainer: {
        flex: 1.5,
        width: "100%",
        //height: '100%',
        // alignItems: "stretch",
        padding: 30,
        justifyContent: "flex-start",
        paddingTop: "5%",
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        backgroundColor: "#ffffff",
        width: theme.dimensions.width,

    },
    cajaCabecera: {
        backgroundColor: theme.colors.blackSegunda,
        flex: 1,
        width: "100%",
        //height: '100%',
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        //justifyContent: "flex-start",
        //padding: 100,
    },
    inputContainer: {
        width: "100%",
        flex: 1,
        marginBottom: 24
    },
    inputPassword: {
        backgroundColor: theme.colors.BackGroundInpu,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: theme.colors.ColorGrayButtom
    },
    inputStyle: {
        fontSize: theme.fontSize.inputText,
    },
});