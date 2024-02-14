import React, { useCallback, useContext } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../styles/theme';
import Constants from 'expo-constants';
import { Images } from '../../utils/imagenes';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UsuarioContext } from '../../context/AllContexts';
import { ROUTES } from '../../constants';
import { removeToken } from '../../common/keyGeneric';
import { ButtonStyledImg } from '../../components/ButtonStyledImg';

export const PerfilScreen = ({ navigation }) => {
    const { userInfo, handleIsConnectionActivate, handleIsLoading } = useContext(UsuarioContext)

    const handleLogout = async () => {
        try {
            navigation.goBack()
            handleIsLoading(true)
            await removeToken('Token');
            await removeToken('idClient')
            await removeToken('rolCliente')
            await removeToken('correoPass')
            await handleIsConnectionActivate(false);
            await navigation.closeDrawer();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            handleIsLoading(false)
        }
    };

    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 20, }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.contentContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, height: "20%", backgroundColor: theme.colors.BackGroundInpu, borderRadius: 18 }}>
                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity onPress={() => { navigation.navigate(ROUTES.PERFIL_EDIT_PASSAGER) }}>
                                    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginEnd: 15 }}>
                                        <Text style={{ textAlign: "right", fontSize: theme.fontSize.subheading, textDecorationLine: "underline", fontWeight: "bold", marginEnd: 8 }}>
                                            Editar
                                        </Text>
                                        <Icon name="edit" size={23} color="black" />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ alignItems: "center" }}>
                                    <Image
                                        source={Images.Perfil}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            resizeMode: "stretch",
                                            borderRadius: 50,
                                            marginBottom: 10,
                                            justifyContent: "center"
                                        }}
                                    />
                                </View>
                                <View style={{ margin: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.styleTex}>Nombre: </Text>
                                        <Text style={styles.styleSubTex}>{userInfo?.pasajeroNombre}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.styleTex}>Apellido: </Text>
                                        <Text style={styles.styleSubTex}>{userInfo?.pasajeroApellido}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: theme.colors.BackGroundInpu, marginTop: 20, borderRadius: 18 }}>
                            <View style={{ margin: 15 }}>
                                <Text style={styles.styleTex}>Número celular: </Text>
                                <Text style={[styles.styleSubTex, { margin: 9 }]}>0{userInfo.phone ? userInfo.phone : "Sin confirmar"}</Text>
                                <Text style={styles.styleTex}>Correo Electrónico: </Text>
                                <Text style={[styles.styleSubTex, { margin: 9 }]}>{userInfo.correo ? userInfo.correo : "Sin confirmar"}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CHANGE_PASSWORD)}>
                                    <View>
                                        <Text style={[styles.styleTex, { textDecorationLine: "underline" }]}>Cambiar contraseña</Text>
                                    </View>
                                </TouchableOpacity>
                                {/* <TouchableOpacity>
                                    <View>
                                        <Text style={{ textDecorationLine: "underline" }}>Eliminar cuenta</Text>
                                    </View>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                        <View style={{ flex: 0.3, justifyContent: "center", alignItems: "center" }}>
                            <ButtonStyledImg color={theme.colors.ColorRed} onPress={() => handleLogout()} text={"Cerrar sesión"} />
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    styleTex: {
        fontWeight: "bold",
        margin: 9,
        fontSize: theme.fontSize.subheading
    },
    styleSubTex: {
        fontFamily: theme.fonts.interSBold,
        fontSize: theme.fontSize.actionText
    }

});