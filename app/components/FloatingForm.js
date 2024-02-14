import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { HelperText } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../styles/theme';
import { regexSoloLetras, validateCorrectPhone, valitdatename } from '../utils/helpers';
import { UsuarioContext } from '../context/AllContexts';

export const FloatingForm = ({ isVisible, pregunta, closeModal, modalContent, potition, state, modalConten2 }) => {
    const { updateRegisterForm, selectService, updateRegisterEnco, updateRegisterPriv, updateBoleto, resetReservationPriv } = useContext(UsuarioContext);
    const [errors, setErrors] = useState({
        pasajeroNombre: '',
        pasajeroApellido: '',
        correo: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [register, setRegisterForm] = useState({
        nombre: updateBoleto ? updateBoleto.tipoBoleto === "Encomienda" || updateBoleto.tipoBoleto === "encomienda" ? updateBoleto.remitente.nombre : updateBoleto.user.nombre : '',
        apellido: updateBoleto ? updateBoleto.tipoBoleto === "Encomienda" || updateBoleto.tipoBoleto === "encomienda" ? updateBoleto.remitente.apellido : updateBoleto.user.apellido : '',
        phone: updateBoleto ? updateBoleto.tipoBoleto === "Encomienda" || updateBoleto.tipoBoleto === "encomienda" ? updateBoleto.remitente.phone : updateBoleto.user.phone : '',

    });
    const hasErrors = () => {
        for (const key in errors) {
            if (errors[key]) {
                return true; // Si hay algún error, devolver true
            }
        }
        return false; // No hay errores
    };

    return (
        <Modal isVisible={isVisible} animationInTiming={0} backdropTransitionInTiming={0} animationIn="fadeIn">
            <View style={{ flex: 1, justifyContent: potition ? potition : "center" }}>
                <View style={{ backgroundColor: theme.colors.BackGroundBlue, padding: 16, flexDirection: "row", borderTopEndRadius: 15, borderTopStartRadius: 15 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ color: "white", textAlign: "center", fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText }}>{pregunta}</Text>
                    </View>
                    <View>
                        {modalContent}
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', padding: 16, borderBottomEndRadius: 15, borderBottomStartRadius: 15 }}>
                    <View >
                        <TextInput
                            autoCapitFalize="none"
                            label="Nombre"
                            // value={registerForm.pasajeroNombre}
                            value={register.nombre}
                            keyboardType="email-address"
                            onChangeText={(txt) => {
                                setRegisterForm({ ...register, nombre: txt.trim() });
                                let validate = valitdatename(txt.trim())
                                setErrors({ ...errors, pasajeroNombre: validate })
                                selectService == "encomienda" ? updateRegisterEnco('remitente', 'nombre', txt.trim()) : selectService == "priv" ? updateRegisterPriv('user', 'nombre', txt) : updateRegisterForm('user', 'nombre', txt)
                            }}
                            mode="outlined"
                            placeholder="Nombre"
                            outlineColor="#666666"
                            activeOutlineColor="#666666"
                            outlineStyle={styles.inputPassword}
                            style={styles.inputStyle}
                            maxLength={20}
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
                        <TextInput
                            autoCapitFalize="none"
                            label="Apellido"
                            value={register.apellido}
                            keyboardType="email-address"
                            onChangeText={(txt) => {
                                setRegisterForm({ ...register, apellido: txt.trim() });
                                let validate = valitdatename(txt.trim())
                                setErrors({ ...errors, pasajeroApellido: validate })
                                selectService == "encomienda" ? updateRegisterEnco('remitente', 'apellido', txt.trim()) : selectService == "priv" ? updateRegisterPriv('user', 'apellido', txt) : updateRegisterForm('user', 'apellido', txt)


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
                        <TextInput
                            autoCapitalize="none"
                            label="Número de Teléfono"
                            value={register.phone}
                            keyboardType="numeric"
                            onChangeText={(txt) => {
                                setRegisterForm({ ...register, phone: txt.trim() });
                                selectService == "encomienda" ? updateRegisterEnco('remitente', 'phone', txt.trim()) : selectService == "priv" ? updateRegisterPriv('user', 'phone', txt) : updateRegisterForm('user', 'phone', txt)
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
                        {register.nombre.length !== 0 && register.apellido.length !== 0 && register.phone.length !== 0 && !hasErrors() &&
                            <View style={{ width: "100%", alignItems: "center" }}>
                                {/* {updateRegistro()} */}
                                {modalConten2}
                            </View>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    );
};
export const FloatingFormDestinatario = ({ isVisible, pregunta, closeModal, modalContent, potition, state, modalConten2 }) => {
    const { updateRegisterForm, selectService, registerEncomienda, updateRegisterEnco, updateRegisterPriv, updateBoleto, resetReservationPriv } = useContext(UsuarioContext);
    const [errors, setErrors] = useState({
        pasajeroNombre: '',
        pasajeroApellido: '',
        correo: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const hasErrors = () => {
        for (const key in errors) {
            if (errors[key]) {
                return true; // Si hay algún error, devolver true
            }
        }
        return false; // No hay errores
    };

    return (
        <Modal isVisible={isVisible} animationInTiming={0} backdropTransitionInTiming={0} animationIn="fadeIn">
            <View style={{ flex: 1, justifyContent: potition ? potition : "center" }}>
                <View style={{ backgroundColor: theme.colors.BackGroundBlue, padding: 16, flexDirection: "row", borderTopEndRadius: 15, borderTopStartRadius: 15 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ color: "white", textAlign: "center", fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText }}>{pregunta}</Text>
                    </View>
                    <View>
                        {modalContent}
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', padding: 16, borderBottomEndRadius: 15, borderBottomStartRadius: 15 }}>
                    <View >
                        <TextInput
                            autoCapitFalize="none"
                            label="Nombre"
                            // value={registerForm.pasajeroNombre}
                            value={registerEncomienda.destinatario.nombre}
                            keyboardType="email-address"
                            onChangeText={(txt) => {
                                let validate = valitdatename(txt.trim())
                                updateRegisterEnco('destinatario', 'nombre', txt.trim())
                                setErrors({ ...errors, pasajeroNombre: validate })
                            }}
                            mode="outlined"
                            placeholder="Nombre"
                            outlineColor="#666666"
                            activeOutlineColor="#666666"
                            outlineStyle={styles.inputPassword}
                            style={styles.inputStyle}
                            maxLength={20}
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
                        <TextInput
                            autoCapitFalize="none"
                            label="Apellido"
                            value={registerEncomienda.destinatario.apellido}
                            keyboardType="email-address"
                            onChangeText={(txt) => {
                                let validate = valitdatename(txt.trim())
                                updateRegisterEnco('destinatario', 'apellido', txt.trim())
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
                        <TextInput
                            autoCapitalize="none"
                            label="Número de Teléfono"
                            value={registerEncomienda.destinatario.phone}
                            keyboardType="numeric"
                            onChangeText={(txt) => {
                                let validate = validateCorrectPhone(txt.trim());
                                updateRegisterEnco('destinatario', 'phone', txt.trim())
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
                        {registerEncomienda.destinatario.nombre.length !== 0 && registerEncomienda.destinatario.apellido.length !== 0 && registerEncomienda.destinatario.phone.length !== 0 && !hasErrors() &&
                            <View style={{ width: "100%", alignItems: "center" }}>
                                {/* {updateRegistro()} */}
                                {modalConten2}
                            </View>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const FloatReference = ({ isVisible, pregunta, closeModal, modalContent, potition, modalConten2, modelConten3 }) => {
    const [referenciaText, setReferenciaText] = useState('');
    const { originCity, updateRegisterForm, selectService, updateRegisterOneEnco, updateRegisterEnco, registerEncomienda, updateRegisterPriv, updateRegisterOnePriv, resetReservationPriv } = useContext(UsuarioContext)
    return (
        <Modal isVisible={isVisible} animationInTiming={0} backdropTransitionInTiming={0} animationIn="fadeIn">
            <View style={{ flex: 1, justifyContent: potition ? potition : "center" }}>
                <View style={{ backgroundColor: theme.colors.BackGroundBlue, padding: 16, flexDirection: "row", borderTopEndRadius: 15, borderTopStartRadius: 15 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={{ color: "white", textAlign: "center", fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText }}>{pregunta}</Text>
                    </View>
                    <View>
                        {modalContent}
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', padding: 16, borderBottomEndRadius: 15, borderBottomStartRadius: 15 }}>
                    <View >
                        <TextInput
                            placeholder="Ingrese la referencia"
                            value={referenciaText}
                            onChangeText={(text) => {
                                setReferenciaText(text)
                                if (originCity) {
                                    selectService == "encomienda" ? updateRegisterEnco('ciudadRemitente', 'referencia', text) :
                                        selectService == "priv" ? updateRegisterPriv('ciudadSalida', 'referencia', text) : updateRegisterForm('ciudadSalida', 'referencia', text)
                                } else {
                                    selectService == "encomienda" ? updateRegisterEnco('ciudadDestinatario', 'referencia', text) :
                                        selectService == "priv" ? updateRegisterPriv('ciudadLlegada', 'referencia', text) : updateRegisterForm('ciudadLlegada', 'referencia', text)
                                }
                            }}
                            style={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 8,
                                padding: 10,
                                marginBottom: 10,
                            }}
                            maxLength={30}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <View style={{ width: "80%", marginStart: 10, justifyContent: "center", alignItems: "center" }}>
                                    {modelConten3}
                                </View>
                            </View>
                            {referenciaText.length !== 0 ?
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

                                    <View style={{ width: "80%", marginStart: 10 }}>
                                        {modalConten2}
                                    </View>
                                </View>
                                : null
                            }
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    inputStyle: {
        fontFamily: "Lato_400Regular_Italic",
        fontSize: theme.fontSize.body,
        backgroundColor: theme.colors.BackGroundWhite,
        color: theme.colors.grey,
        zIndex: 1,
    },
    inputPassword: {
        borderRadius: 15,
        borderColor: theme.colors.ColorGrayButtom,
    },
});
