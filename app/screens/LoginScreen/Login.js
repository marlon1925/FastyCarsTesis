import { View, Text, StyleSheet, ScrollView, TouchableHighlight, Alert, Image } from 'react-native';
import { InputStyle } from '../../components/InputStyle';
import ButtonStyled from '../../components/ButtonStyled';
import { theme } from '../../styles/theme';
import { IMG, ROUTES } from '../../constants';
import { useContext, useState } from 'react';
import { UsuarioContext } from '../../context/AllContexts';
import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";
import { baseURL, validateCorrectEmail, validateCorrectPassword } from '../../utils/helpers';
import { HelperText, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken, saveToken, } from '../../common/keyGeneric';
import { ButtonStyledImg } from '../../components/ButtonStyledImg';


export const Login = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({
        correo: null,
        password: null,
    });
    const [errors, setErrors] = useState({
        correo: "",
        password: "",
    });
    const { handleIsConnectionActivate, handleIsLoading, handleUserInfo, handleTypeAccount, handleIsSplash } = useContext(UsuarioContext)

    const perfil = async () => {
        const token = await AsyncStorage.getItem('Token')
        try {
            handleIsSplash(true)
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
            if (respuesta.ok) {
                handleUserInfo(bodyResponse);
                handleTypeAccount(true)
            } else {
                Alert.alert("Error", bodyResponse.msg)
            }

        } catch (error) {
            console.log(error);
        } finally {
            handleIsSplash(false)
        }
    };
    const perfilDriver = async () => {
        const token = await AsyncStorage.getItem('Token')
        const idClient = await AsyncStorage.getItem('idClient')
        try {
            handleIsSplash(true)
            const url = `${baseURL()}conductor/${idClient}`;
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
            console.log(respuesta.ok)
            if (respuesta.ok) {
                handleUserInfo(bodyResponse);
                handleTypeAccount(false)
            } else {
                Alert.alert("Error", bodyResponse.msg)
            }

        } catch (error) {
            console.log(error);
        } finally {
            handleIsSplash(false)
        }
    };
    const handleLogin = async () => {
        // Validar campos antes de la solicitud
        if (!loginForm.correo || !loginForm.password) {
            setErrors({
                correo: !loginForm.correo ? 'Correo requerido' : '',
                password: !loginForm.password ? 'Contraseña requerida' : '',
            });
            return;
        }

        // Realizar la solicitud de inicio de sesión
        const url = `${baseURL()}login`;
        console.log(JSON.stringify(loginForm))
        const options = {
            method: 'POST',
            body: JSON.stringify(loginForm),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        try {
            handleIsLoading(true)
            const response = await fetch(url, options);
            const bodyResponse = await response.json();
            let rol = bodyResponse.rol

            // Verificar el estado de la respuesta
            if (bodyResponse.result) {

                // Solicitud exitosa, puedes realizar acciones adicionales aquí si es necesarios
                // Guardar el token de acceso en AsyncStorage
                const tokenToSave = bodyResponse.token;
                console.log("Tokentosabe", tokenToSave)

                if (tokenToSave) {
                    const encryptedToken = await saveToken('Token', tokenToSave);
                    const idClient = await saveToken('idClient', bodyResponse._id)
                    const rolCliente = await saveToken('rol', bodyResponse.rol)
                    await AsyncStorage.setItem('Token', encryptedToken);
                    await AsyncStorage.setItem('idClient', idClient);
                    await AsyncStorage.setItem('rolCliente', rolCliente);
                    await AsyncStorage.setItem('correo', loginForm.correo);
                    await AsyncStorage.setItem('password', loginForm.password);

                    console.log("Seguardo....", bodyResponse)
                } else {
                    console.error('El token recibido en la respuesta es undefined. No se puede almacenar en AsyncStorage.');
                }
                if (response.ok) {
                    handleIsConnectionActivate(true)
                    if (rol === 'pasajero') {
                        await perfil()
                    } else {
                        await perfilDriver()
                    }
                }

            } else {
                // Manejar errores de la solicitud
                setErrors({ correo: '', password: '' });
                bodyResponse.errors ?
                    Alert.alert("Error al iniciar sesión", bodyResponse.errors[0].msg)
                    :
                    Alert.alert("Error al iniciar sesión", bodyResponse.msg)

            }
        } catch (error) {
            // Manejar errores generales
            console.error('Error en la solicitud:', error);
        } finally {
            handleIsLoading(false);
        }
    };


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, height: theme.dimensions.height, backgroundColor: theme.colors.BackGroundBlue }}
        >
            <View
                style={[styles.container, { marginTop: Constants.statusBarHeight }]}
            >
                <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
                <View style={styles.cajaCabecera}>
                    <Image
                        source={IMG.logoMain}
                        style={{
                            width: 180,
                            height: 180,
                            justifyContent: "center",
                            resizeMode: "stretch"
                        }}
                    />
                </View>

                <View style={styles.contentContainer}>
                    <View style={{ flex: 0.3, justifyContent: "center" }}>
                        <Text style={{ fontFamily: theme.fonts.interBold, fontWeight: "700", fontSize: theme.fontSize.heading, textAlign: "center" }}>Inicio de sesión</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <View>
                            <TextInput
                                autoCapitalize="none"
                                label="Correo"
                                value={loginForm.correo}
                                keyboardType="email-address"
                                onChangeText={(txt) => {
                                    setLoginForm({ ...loginForm, correo: txt.trim() });
                                    let validate = validateCorrectEmail(txt.trim());
                                    //console.log("VALIDACION:", validate);
                                    setErrors({ ...errors, correo: validate });
                                }}
                                mode="outlined"
                                placeholder="Correo"
                                outlineColor="#666666"
                                activeOutlineColor="#666666"
                                outlineStyle={styles.inputPassword}
                                style={styles.inputStyle}
                                maxLength={60}
                                error={errors.correo}
                            />
                            {errors.correo && (
                                <HelperText type="error" visible={errors.correo}> {errors.correo} </HelperText>
                            )}
                        </View>
                        <View>
                            <TextInput
                                label="Contraseña"
                                placeholder="Contraseña"
                                value={loginForm.password}
                                onChangeText={(txt) => {
                                    setLoginForm({ ...loginForm, password: txt.trim() });

                                    if (txt.trim() === '') {
                                        setErrors({
                                            password: 'Contraseña requerida',
                                        });
                                    } else {
                                        setErrors({
                                            password: '',
                                        });
                                    }
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
                                error={errors.password || (loginForm.password && loginForm.password.trim() === '' && 'La contraseña no puede estar vacía')}
                            />
                            {errors.password && (
                                <HelperText type="error" visible={errors.password}>
                                    {errors.password}
                                </HelperText>
                            )}


                        </View>
                        <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 20 }}>
                            <TouchableHighlight
                                activeOpacity={0.1}
                                underlayColor="#DDDDDD"
                                onPress={() => {
                                    navigation.navigate(ROUTES.RECOVER_PASS);
                                }}
                            >
                                <Text style={{ fontFamily: theme.fonts.inter, textAlign: 'center', fontSize: theme.fontSize.inputText }}>
                                    ¿Olvidaste tu contraseña? <Text style={{ textDecorationLine: 'underline', fontStyle: 'italic' }}>Recuperar</Text>
                                </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{ flex: 0.7 }}>
                            <View style={{ flex: 1, justifyContent: "center", }}>
                                <ButtonStyledImg text={"Iniciar sesión"} textColor={"white"} width={"100%"} height={50} fontSize={20} onPress={() => handleLogin()} color={theme.colors.ColorGrayButtom} radius={15} textSize={17} colorText={theme.colors.BackGroundWhite} />
                            </View>
                            <View style={{ flex: 1, justifyContent: "flex-start" }}>
                                <ButtonStyledImg text={"Crear Cuenta"} onPress={() => { navigation.navigate(ROUTES.FORMULARIO_REG) }} width={"100%"} height={50} fontSize={20} borderColor={theme.colors.BackGroundBlue} borderWidth={3} textSize={17} textColor={theme.colors.BackGroundBlue} />
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        </ScrollView>
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
        flex: 2,
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
        backgroundColor: theme.colors.BackGroundBlue,
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
        flex: 2,
    },
    inputPassword: {
        backgroundColor: theme.colors.BackGroundInpu,
        borderRadius: 15,
        borderWidth: 1.5,
    },
    inputStyle: {
        fontSize: theme.fontSize.inputText,
    },
});
