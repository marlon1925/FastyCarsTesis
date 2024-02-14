import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { theme } from '../../../styles/theme';
import Constants from 'expo-constants';
import { Images } from '../../../utils/imagenes';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UsuarioContext } from '../../../context/AllContexts';
import { ROUTES } from '../../../constants';
import ButtonStyled from '../../../components/ButtonStyled';
import { HelperText, TextInput } from 'react-native-paper';
import { baseURL, regexSoloLetras, validateCorrectEmail, validateCorrectPassword, validateCorrectPhone } from '../../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { ButtonStyledImg } from '../../../components/ButtonStyledImg';

export const ChangePasswordDriver = ({ navigation }) => {
    const { userInfo, handleIsLoading } = useContext(UsuarioContext)
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        passwordactual: '',
        passwordnuevo: '',
    });
    const [errors, setErrors] = useState({
        password: '',
        passwordActual: '',
        // confirmPassword: '',
    });
    const handleButtonPress = (buttonId, state) => {
        // Cambia el botón seleccionado según el id del botón
        setColorReserve((prevButton) => (prevButton === buttonId ? null : buttonId))
    };
    const changePassword = async () => {
        const token = await AsyncStorage.getItem('Token');
        const clienteId = await AsyncStorage.getItem('idClient');
        console.log("Token", token);
        console.log("IdCliente", clienteId)

        try {

            handleIsLoading(true)
            const url = `${baseURL()}conductor/actualizarpassword`;
            const options = {
                method: 'PUT',
                body: JSON.stringify(registerForm),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },

            };
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            if (respuesta.ok) {
                Alert.alert("CONTRASEÑA", bodyResponse.msg)
                navigation.goBack()
            } else {
                Alert.alert("CONTRASEÑA", bodyResponse.msg)
            }
        } catch (error) {
            console.error(error)
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
                style={[styles.container, { marginTop: Constants.statusBarHeight - 30 }]}
            >
                <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
                <View style={styles.contentContainer}>
                    <View style={{ flex: 1 }}>

                        <View style={{ flex: 1, justifyContent: "flex-start" }}>
                            <Text style={{ fontSize: 18, fontStyle: "italic", fontWeight: "600" }} onPress={() => navigation.goBack()}> <AntDesignIcon name='arrowleft' /> Regresar a perfil</Text>
                            <View style={{ flex: 0.1, justifyContent: "center" }}>
                                <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}>Cambiar contraseña</Text>
                            </View>
                            <TextInput
                                label="Contraseña actual"
                                placeholder="Contraseaña actual"
                                value={registerForm.passwordactual}
                                onChangeText={(txt) => {
                                    setRegisterForm({ ...registerForm, passwordactual: txt });
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
                            <TextInput
                                label="Contraseña nueva"
                                placeholder="Contraseaña nueva"
                                value={registerForm.passwordnuevo}
                                onChangeText={(txt) => {
                                    setRegisterForm({ ...registerForm, passwordnuevo: txt });
                                    let validate = validateCorrectPassword(txt);
                                    setErrors({ ...errors, passwordActual: validate });
                                }}
                                mode="outlined"
                                outlineColor="#666666"
                                activeOutlineColor="#666666"
                                secureTextEntry={!showPassword2}
                                outlineStyle={styles.inputPassword}
                                style={styles.inputStyle}
                                right={
                                    showPassword2 ? (
                                        <TextInput.Icon
                                            icon="eye-off"
                                            onPress={() => {
                                                setShowPassword2(!showPassword2);
                                                return false;
                                            }}
                                        />
                                    ) : (
                                        <TextInput.Icon
                                            icon="eye"
                                            onPress={() => {
                                                setShowPassword2(!showPassword2);
                                                return false;
                                            }}
                                        />
                                    )
                                }
                                error={errors.password || (registerForm.password && registerForm.password.trim() === '' && 'La contraseña no puede estar vacía')}
                            />
                            {errors.passwordActual && (
                                <HelperText type="error" visible={errors.passwordActual}>
                                    {errors.passwordActual}
                                </HelperText>
                            )}
                            {/* <TextInput
                                label="Repita contraseña"
                                placeholder="Repita contraseña"
                                value={registerForm.confirmPassword}
                                onChangeText={(txt) => {
                                    setRegisterForm({ ...registerForm, confirmPassword: txt });
                                    console.log("contraseña" + registerForm.password !== registerForm.confirmPassword)
                                    console.log("texto", txt)
                                    if (registerForm.password === txt) {
                                        setErrors({ ...errors, confirmPassword: '' });
                                    } else {
                                        setErrors({ ...errors, confirmPassword: 'Las contraseñas no coinciden' });

                                    }
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
                                error={errors.confirmPassword || (registerForm.confirmPassword && registerForm.confirmPassword.trim() === '' && 'La contraseña no puede estar vacía')}
                            />
                            {errors.confirmPassword && (
                                <HelperText type="error" visible={errors.confirmPassword}>
                                    {errors.confirmPassword}
                                </HelperText>
                            )} */}
                            <View style={{ flex: 0.2, justifyContent: "center" }}>
                                <ButtonStyledImg onPress={() => changePassword()} width={"100%"} disabled={registerForm.passwordactual.length === 0 || registerForm.passwordnuevo.length === 0} color={theme.colors.ColorGrayButtom} text={"Cambiar contraseña"} textColor={"white"} />
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
});