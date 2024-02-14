import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { theme } from '../../styles/theme';
import Constants from "expo-constants";
import ButtonStyled from '../../components/ButtonStyled';
import { StatusBar } from 'expo-status-bar';
import { UsuarioContext } from '../../context/AllContexts';
import { HelperText, TextInput } from 'react-native-paper';
import { GotoBack, baseURL, regexSoloLetras, validateConfirmPassword, validateCorrectEmail, validateCorrectPassword, validateCorrectPhone, valitdatename } from '../../utils/helpers';
import { ROUTES } from '../../constants';
import { ButtonStyledImg } from '../../components/ButtonStyledImg';

export const FormularioRegister = ({ navigation }) => {
  const { handleIsConnectionActivate, handleIsLoading } = useContext(UsuarioContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    pasajeroNombre: '',
    pasajeroApellido: '',
    correo: '',
    password: '',
    confirmPassword: '',
    phone: '',

  });
  const [errors, setErrors] = useState({
    pasajeroNombre: '',
    pasajeroApellido: '',
    correo: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleRegister = async () => {
    console.log(!registerForm.pasajeroNombre.trim())
    if (
      !registerForm.pasajeroNombre.trim() ||
      !regexSoloLetras.test(registerForm.pasajeroNombre) ||
      !registerForm.pasajeroApellido.trim() ||
      !regexSoloLetras.test(registerForm.pasajeroApellido) ||
      !registerForm.correo.trim() ||
      !registerForm.password.trim() ||
      !registerForm.confirmPassword.trim() ||
      !registerForm.phone.trim()
    ) {
      setErrors({
        pasajeroNombre: !registerForm.pasajeroNombre.trim() ? 'Nombre requerido' : '',
        pasajeroApellido: !registerForm.pasajeroApellido.trim() ? 'Apellido requerido' : '',
        correo: !registerForm.correo.trim() ? 'Correo requerido' : '',
        password: !registerForm.password.trim() ? 'Contraseña requerida' : '',
        confirmPassword: !registerForm.confirmPassword.trim() ? 'Confirmación de contraseña requerida' : '',
        phone: !registerForm.phone.trim() ? 'Teléfono requerido' : '',
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Las contraseñas no coinciden' });
      return;
    } else {
      setErrors({ ...errors, confirmPassword: '' });
    }

    try {
      handleIsLoading(true)
      console.log("entra al try")
      // Realizar la solicitud de registro
      const url = `${baseURL()}register`; // Reemplaza'URL_DE_TU_BACKEND' con la URL real de tu backend
      console.log("llega")
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pasajeroNombre: registerForm.pasajeroNombre,
          pasajeroApellido: registerForm.pasajeroApellido,
          correo: registerForm.correo,
          password: registerForm.password,
          phone: registerForm.phone
        }),
      });

      // Verificar el estado de la respuesta
      if (response.ok) {
        // Registro exitoso, puedes realizar acciones adicionales aquí si es necesario
        console.log('Registro exitoso');
        Alert.alert('Registro exitoso', 'Se envió un código de verificación al correo electrónico:');
        navigation.navigate(ROUTES.VERIFICATED_CODE, { registerForm: registerForm })
      } else {
        // Manejar errores de la solicitud
        const responseData = await response.json();
        Alert.alert('Error en el registro', responseData.msg);
      }
    } catch (error) {
      // Manejar errores generales
      console.error('Error en la solicitud:', error);
    } finally {
      handleIsLoading(false)
    }
  };
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
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.title, textAlign: "center" }}> Datos de contacto </Text>
          </View>
          <View style={{ flex: 7.5 }}>
            <View style={{ flex: 6, justifyContent: "center" }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  autoCapitFalize="none"
                  label="Nombre"
                  value={registerForm.pasajeroNombre}
                  keyboardType="default"
                  onChangeText={(txt) => {
                    setRegisterForm({ ...registerForm, pasajeroNombre: txt.trim() });
                    let validate = valitdatename(txt.trim());
                    setErrors({ ...errors, pasajeroNombre: validate })
                  }}
                  mode="outlined"
                  placeholder="Nombre"
                  outlineColor="#666666"
                  activeOutlineColor="#666666"
                  outlineStyle={styles.inputPassword}
                  style={styles.inputStyle}
                  maxLength={15}
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
              <View style={{ flex: 1 }}>
                <TextInput
                  autoCapitFalize="none"
                  label="Apellido"
                  value={registerForm.pasajeroApellido}
                  keyboardType="default"
                  onChangeText={(txt) => {
                    setRegisterForm({ ...registerForm, pasajeroApellido: txt.trim() });
                    let validate = valitdatename(txt.trim());
                    setErrors({ ...errors, pasajeroApellido: validate })
                  }}
                  mode="outlined"
                  placeholder="Apellido"
                  outlineColor="#666666"
                  activeOutlineColor="#666666"
                  outlineStyle={styles.inputPassword}
                  style={styles.inputStyle}
                  error={errors.pasajeroApellido}
                />
                {errors.pasajeroApellido && (
                  <HelperText type="error" visible={errors.pasajeroApellido}> {errors.pasajeroApellido} </HelperText>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  autoCapitalize="none"
                  label="Correo"
                  value={registerForm.correo}
                  keyboardType="email-address"
                  onChangeText={(txt) => {
                    setRegisterForm({ ...registerForm, correo: txt.trim() });
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
              <View style={{ flex: 1 }}>
                <TextInput
                  autoCapitalize="none"
                  label="Número de Teléfono"
                  value={registerForm.phone}
                  keyboardType="numeric"
                  onChangeText={(txt) => {
                    setRegisterForm({ ...registerForm, phone: txt.trim() });
                    let validate = validateCorrectPhone(txt.trim());
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
              <View style={{ flex: 1 }}>
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
                  keyboardType='default'
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
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="Repita contraseña"
                  placeholder="Repita contraseña"
                  keyboardType='default'
                  value={registerForm.confirmPassword}
                  onChangeText={(txt) => {
                    setRegisterForm({ ...registerForm, confirmPassword: txt });
                    let validate = validateConfirmPassword(registerForm.password, txt.trim())
                    setErrors({ ...errors, confirmPassword: validate })
                  }
                  }
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
                  error={errors.confirmPassword || (registerForm.confirmPassword && registerForm.confirmPassword.trim() === '' && 'La contraseña no puede estar vacía')}
                />
                {errors.confirmPassword && (
                  <HelperText type="error" visible={errors.confirmPassword}>
                    {errors.confirmPassword}
                  </HelperText>
                )}
              </View>
            </View>

            <View style={{ flex: 1.5, justifyContent: "flex-start" }}>
              <View style={{ flex: 0.5, marginTop: 15 }}>
                <ButtonStyledImg
                  text="Crear"
                  onPress={handleRegister}
                  color={theme.colors.BackGroundBlue}
                  borderRadius={20}
                  textColor={theme.colors.BackGroundWhite}
                  fontSize={20}
                  width={"100%"}
                  disabled={hasErrors()} // Desactiva el botón si hay errores
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.BackGroundWhite,
    width: "100%",
    height: theme.dimensions.height,
    alignItems: "center",
    justifyContent: "center",
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
  errorText: {
    fontSize: theme.fontSize.body - 1, // Reducir un punto el tamaño de la letra
    marginTop: -5, // Ajusta según tu preferencia
  },
});
