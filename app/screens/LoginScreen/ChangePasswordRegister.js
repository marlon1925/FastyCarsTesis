import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { theme } from '../../styles/theme';
import Constants from 'expo-constants';
import { Images } from '../../utils/imagenes';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UsuarioContext } from '../../context/AllContexts';
import ButtonStyledImg from '../../components/ButtonStyledImg';
import { ROUTES } from '../../constants';
import ButtonStyled from '../../components/ButtonStyled';
import { HelperText, TextInput } from 'react-native-paper';
import { GotoBack, baseURL, regexSoloLetras, validateConfirmPassword, validateCorrectEmail, validateCorrectPassword, validateCorrectPhone } from '../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ChangePasswordRegister = ({ navigation, route }) => {
    const token = route.params.token
    const rol = route.params.rol
    const { userInfo, handleIsLoading } = useContext(UsuarioContext)
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        password: '',
        confirmpassword: '',
    });
    const [errors, setErrors] = useState({
        password: '',
        confirmpassword: '',
        // confirmPassword: '',
    });
    const handleButtonPress = (buttonId, state) => {
        // Cambia el botón seleccionado según el id del botón
        setColorReserve((prevButton) => (prevButton === buttonId ? null : buttonId))
    };
    const changePassword = async () => {
        try {

            handleIsLoading(true)
            let service = rol ? "conductor/nuevo-password/" : "nuevo-password/"
            const url = `${baseURL()}${service}${token}`;
            console.log("ULR: ", url)
            console.log("CAMBIO DE CONTRASEÑA: ", JSON.stringify(registerForm))
            const options = {
                method: 'POST',
                body: JSON.stringify(registerForm),
                headers: {
                    'Content-Type': 'application/json',
                },

            };
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            if (respuesta.ok) {
                Alert.alert("CONTRASEÑA", bodyResponse.msg)
                navigation.navigate(ROUTES.LOGIN_NAV)
            } else {
                Alert.alert("CONTRASEÑA", bodyResponse.msg)
            }
        } catch (error) {
            console.error("ERROR AL CAMBIAR CONTRAÑSE: ", error)
        } finally {
            handleIsLoading(false)
        }
    }
    const hasErrors = () => {
        for (const key in errors) {
            if (errors[key]) {
                return true; // Si hay algún error, devolver true
            }
        }
        return false; // No hay errores
    };

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
                    <GotoBack navigation={navigation} />
                    <View style={{ flex: 1 }}>

                        <View style={{ flex: 1, justifyContent: "flex-start" }}>
                            <View style={{ flex: 0.1, justifyContent: "center" }}>
                                <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Cambiar contraseña</Text>
                            </View>
                            <TextInput
                                label="Contraseña"
                                placeholder="Contraseaña"
                                value={registerForm.password}
                                onChangeText={(txt) => {
                                    setRegisterForm({ ...registerForm, password: txt.trim() });
                                    let validate = validateCorrectPassword(txt.trim());
                                    setErrors({ ...errors, password: validate });
                                }}
                                mode="outlined"
                                outlineColor="#666666"
                                activeOutlineColor="#666666"
                                secureTextEntry={!showPassword}
                                outlineStyle={styles.inputPassword}
                                style={styles.inputStyle}
                                right={
                                    showPassword ? (
                                        <TextInput.Icon
                                            icon="eye-off"
                                            onPress={() => {
                                                setShowPassword(!showPassword);
                                                return false;
                                            }}
                                        />
                                    ) : (
                                        <TextInput.Icon
                                            icon="eye"
                                            onPress={() => {
                                                setShowPassword(!showPassword);
                                                return false;
                                            }}
                                        />
                                    )
                                }
                                error={errors.password || (registerForm.password && registerForm.password.trim() === '' && 'La contraseña no puede estar vacía')}
                            />
                            {errors.password && (
                                <HelperText type="error" visible={errors.password}>
                                    {errors.password}
                                </HelperText>
                            )}
                            <TextInput
                                label="Repita contraseña"
                                placeholder="Repita contraseña"
                                value={registerForm.confirmpassword}
                                onChangeText={(txt) => {
                                    setRegisterForm({ ...registerForm, confirmpassword: txt.trim() });
                                    let validate = validateConfirmPassword(registerForm.password, txt.trim())
                                    setErrors({ ...errors, confirmpassword: validate });
                                }}
                                mode="outlined"
                                outlineColor="#666666"
                                activeOutlineColor="#666666"
                                secureTextEntry={!showPassword3}
                                outlineStyle={styles.inputPassword}
                                style={styles.inputStyle}
                                right={
                                    showPassword3 ? (
                                        <TextInput.Icon
                                            icon="eye-off"
                                            onPress={() => {
                                                setShowPassword3(!showPassword3);
                                                return false;
                                            }}
                                        />
                                    ) : (
                                        <TextInput.Icon
                                            icon="eye"
                                            onPress={() => {
                                                setShowPassword3(!showPassword3);
                                                return false;
                                            }}
                                        />
                                    )
                                }
                                error={errors.confirmpassword || (registerForm.confirmpassword && registerForm.confirmpassword.trim() === '' && 'La contraseña no puede estar vacía')}
                            />
                            {errors.confirmpassword && (
                                <HelperText type="error" visible={errors.confirmpassword}>
                                    {errors.confirmpassword}
                                </HelperText>
                            )}
                            <View style={{ flex: 0.2, justifyContent: "center" }}>
                                {console.log(errors.confirmpassword.length !== 0)}
                                {console.log(registerForm.confirmpassword == '')}
                                <TouchableOpacity style={styles.buttonContent} disabled={errors.confirmpassword.length !== 0 || registerForm.confirmpassword == '' && hasErrors()} onPress={() => { changePassword() }}>
                                    <Text style={{ color: "white", fontSize: 18 }}>Cambiar contraseña</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
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
        paddingTop: "5%",
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
});