import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { theme } from '../../styles/theme';
import Constants from 'expo-constants';
import { Images } from '../../utils/imagenes';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UsuarioContext } from '../../context/AllContexts';
import { ROUTES } from '../../constants';
import ButtonStyled from '../../components/ButtonStyled';
import { HelperText, TextInput } from 'react-native-paper';
import { baseURL, regexSoloLetras, validateCorrectEmail, validateCorrectPhone, valitdatename } from '../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { ButtonStyledImg } from '../../components/ButtonStyledImg';

export const EditPerfilScreen = ({ navigation }) => {
    const { userInfo, handleIsLoading, handleUserInfo } = useContext(UsuarioContext)
    const [registerForm, setRegisterForm] = useState({
        pasajeroNombre: userInfo.pasajeroNombre,
        pasajeroApellido: userInfo.pasajeroApellido,
        phone: "0" + userInfo.phone,
        //correo: userInfo.correo,

    });
    const [errors, setErrors] = useState({
        pasajeroNombre: '',
        pasajeroApellido: '',
        correo: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const handleButtonPress = (buttonId, state) => {
        // Cambia el botón seleccionado según el id del botón
        setColorReserve((prevButton) => (prevButton === buttonId ? null : buttonId))
    };
    const hasErrors = () => {
        for (const key in errors) {
            if (errors[key]) {
                return true; // Si hay algún error, devolver true
            }
        }
        return false; // No hay errores
    };
    const updatePerfil = async () => {
        const token = await AsyncStorage.getItem('Token');

        try {
            handleIsLoading(true)
            const url = `${baseURL()}pasajero/actualizarPerfil/${userInfo._id}`;
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
                Alert.alert("ACTUALIZAR", bodyResponse.msg)
                await perfil();
                navigation.goBack()
            } else {
                Alert.alert("ACTUALIZAR", bodyResponse.msg)
            }
        } catch (error) {
            console.error(error)
        } finally {
            handleIsLoading(false)
        }
    }
    const perfil = async () => {
        const token = await AsyncStorage.getItem('Token');
        try {
            handleIsLoading(true)
            const url = `${baseURL()}perfil`;
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await fetch(url, options);
            const bodyResponse = await respuesta.json();
            console.log("RESPUESTA DEL PERFIL", bodyResponse)
            handleUserInfo(bodyResponse);
        } catch (error) {
            console.log(error);
        } finally {
            handleIsLoading(false)
        }
    };
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
                    <Text style={{ fontSize: 18, fontStyle: "italic", fontWeight: "600" }} onPress={() => navigation.goBack()}> <AntDesignIcon name='arrowleft' size={20} /> Regresar a perfil</Text>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.title, textAlign: "center" }}> Editar datos </Text>
                    </View>
                    <View style={{ flex: 7 }}>
                        <View style={{ flex: 1, justifyContent: "flex-start" }}>
                            <View style={{ marginBottom: 30 }}>
                                <TextInput
                                    autoCapitFalize="none"
                                    label="Nombre"
                                    value={registerForm.pasajeroNombre}
                                    keyboardType="email-address"
                                    onChangeText={(txt) => {
                                        setRegisterForm({ ...registerForm, pasajeroNombre: txt.trim() });
                                        let validate = valitdatename(txt.trim())
                                        setErrors({ ...errors, pasajeroNombre: validate })
                                    }}
                                    mode="outlined"
                                    placeholder="Nombre"
                                    outlineColor="#666666"
                                    activeOutlineColor="#666666"
                                    outlineStyle={styles.inputPassword}
                                    style={styles.inputStyle}
                                    maxLength={10}
                                    error={errors.pasajeroNombre}
                                />
                                {errors.pasajeroNombre && (
                                    <HelperText
                                        type="error"
                                        visible={errors.pasajeroNombre}
                                        style={styles.errorText}
                                    >
                                        {errors.pasajeroNombre}
                                    </HelperText>
                                )}

                            </View>
                            <View style={{ marginBottom: 30 }}>
                                <TextInput
                                    autoCapitFalize="none"
                                    label="Apellido"
                                    value={registerForm.pasajeroApellido}
                                    keyboardType="email-address"
                                    onChangeText={(txt) => {
                                        setRegisterForm({ ...registerForm, pasajeroApellido: txt.trim() });
                                        let validate = valitdatename(txt.trim())
                                        setErrors({ ...errors, pasajeroApellido: validate })
                                    }}
                                    mode="outlined"
                                    placeholder="Apellido"
                                    outlineColor="#666666"
                                    activeOutlineColor="#666666"
                                    outlineStyle={styles.inputPassword}
                                    style={styles.inputStyle}
                                    maxLength={10}
                                    error={errors.pasajeroApellido}
                                />
                                {errors.pasajeroApellido && (
                                    <HelperText type="error" visible={errors.pasajeroApellido}> {errors.pasajeroApellido} </HelperText>
                                )}
                            </View>
                            {/* <View style={{ flex: 1 }}>
                                <TextInput
                                    autoCapitalize="none"
                                    label="Correo"
                                    value={registerForm.correo}
                                    keyboardType="email-address"
                                    onChangeText={(txt) => {
                                        setRegisterForm({ ...registerForm, correo: txt });
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
                            </View> */}
                            <View style={{ marginBottom: 30 }}>
                                <TextInput
                                    autoCapitalize="none"
                                    label="Número de Teléfono"
                                    value={registerForm.phone}
                                    keyboardType="numeric"
                                    onChangeText={(txt) => {
                                        setRegisterForm({ ...registerForm, phone: txt });
                                        let validate = validateCorrectPhone(txt);
                                        setErrors({ ...errors, phone: validate });
                                    }}
                                    mode="outlined"
                                    placeholder="Número de Teléfono"
                                    outlineColor="#666666"
                                    activeOutlineColor="#666666"
                                    outlineStyle={styles.inputPassword} // Asegúrate de definir este estilo en tu archivo de estilos
                                    style={styles.inputStyle} // Asegúrate de definir este estilo en tu archivo de estilos
                                    maxLength={10} // Ajusta la longitud máxima según tus necesidades
                                    error={errors.phone}
                                />
                                {errors.phone && (
                                    <HelperText type="error" visible={errors.phone}>
                                        {errors.phone}
                                    </HelperText>
                                )}
                            </View>

                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <ButtonStyledImg text={"Actualizar"} disabled={hasErrors()} textColor={'white'} color={theme.colors.ColorGrayButtom} fontSize={18} onPress={() => { updatePerfil() }} />
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
});