import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../../styles/theme";
import { useContext } from "react";
import { UsuarioContext } from "../../../context/AllContexts";
import Constants from 'expo-constants';
import { Button, Image } from "@rneui/base";
import { Images } from "../../../utils/imagenes";
import Icon from 'react-native-vector-icons/FontAwesome';
import { GotoBack } from "../../../utils/helpers";
import { ROUTES } from "../../../constants";
import { removeToken } from "../../../common/keyGeneric";



export const PerfilDriver = ({ navigation }) => {
    const { userInfo, handleIsConnectionActivate, handleTypeAccount, handleIsLoading } = useContext(UsuarioContext)

    const handleLogout = async () => {
        try {
            await removeToken('Token');
            await removeToken('idClient')
            await removeToken('rolCliente')
            await removeToken('correoPass')
            await handleIsConnectionActivate(false);
            await handleTypeAccount(true)
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    return (
        <View
            style={[styles.container, { marginTop: Constants.statusBarHeight - 30, }]}
        >
            <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={{ marginTop: 10, marginLeft: 10 }}>
                    <GotoBack navigation={navigation} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1.3, height: "20%", backgroundColor: theme.colors.BackGroundInpu, borderRadius: 18 }}>
                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity onPress={() => { navigation.navigate(ROUTES.PERFIL_DRIVER_EDIT) }}>
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
                                <View style={{ marginLeft: 10 }}>
                                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                        <Text style={styles.styleTex}>Nombre: </Text>
                                        <Text style={styles.styleSubTex}>{userInfo?.msg?.conductorNombre}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                        <Text style={styles.styleTex}>Apellido: </Text>
                                        <Text style={styles.styleSubTex}>{userInfo?.msg?.conductorApellido}</Text>
                                    </View>
                                    <Text style={styles.styleTex}>Corre Electrónico: </Text>
                                    <Text style={styles.styleSubTex}>{userInfo?.msg?.correo}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                        <Text style={styles.styleTex}>Celular: </Text>
                                        <Text style={styles.styleSubTex}>0{userInfo?.msg?.phone}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: theme.colors.BackGroundInpu, marginTop: 20, borderRadius: 18 }}>
                            <View style={{ margin: 15 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}>Vehículo</Text>
                                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                    <Text style={styles.styleTex}>Marca: </Text>
                                    <Text style={styles.styleSubTex}>{userInfo?.msg?.marcaVehiculo}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                    <Text style={styles.styleTex}>Modelo: </Text>
                                    <Text style={styles.styleSubTex}>{userInfo?.msg?.modeloVehiculo}</Text>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                                    <Text style={styles.styleTex}>Placa: </Text>
                                    <Text style={styles.styleSubTex}>{userInfo?.msg?.placaVehiculo}</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.PASSWORD_DRIVER_NAV)}>
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
                            {/* <ButtonStyledImg color={theme.colors.ColorRed} onPress={() => handleLogout()} text={"Cerrar sesión"} /> */}
                            <Button onPress={() => handleLogout()} buttonStyle={[styles.buttonContent, {
                                backgroundColor: theme.colors.ColorRed
                            }]}>
                                Cerrar sesión
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView >
        </View >
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
        backgroundColor: theme.colors.BackGroundWhite,
        justifyContent: "flex-start",
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
        fontSize: theme.fontSize.subheading - 1,
        marginTop: 20
    },
    styleSubTex: {
        fontFamily: theme.fonts.interSBold,
        fontSize: theme.fontSize.actionText
    },
    buttonContent: {
        justifyContent: "center",
        borderRadius: 15,
        height: 40,
        margin: 10,
    },

});