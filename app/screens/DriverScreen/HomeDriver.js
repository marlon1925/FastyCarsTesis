import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../styles/theme';
import { removeToken } from '../../common/keyGeneric';
import { UsuarioContext } from '../../context/AllContexts';
import { DrawerActions } from '@react-navigation/native';
import { Images } from '../../utils/imagenes';
import { ROUTES } from '../../constants';

export const HomeDriver = ({ navigation }) => {
    const { userInfo, handleIsConnectionActivate, handleTypeAccount } = useContext(UsuarioContext)

    const handleUserPress = () => {
        navigation.navigate(ROUTES.PERFIL_DRIVER_NAV)
    };

    const handleTurnosPress = () => {
        navigation.navigate(ROUTES.TURNOS_DRIVER_NAV)
    };

    const handlePrivadosPress = () => {
        navigation.navigate(ROUTES.PRIVADOS_DRIVER_NAV)
    };

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
        <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.BackGroundWhite }}>
            <View style={{ flex: 0.1, justifyContent: "flex-start", marginBottom: 20, marginTop: 20 }}>
                <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> Bienvenido {userInfo?.msg?.conductorNombre} </Text>
            </View>
            <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={handleUserPress}
                        style={{
                            flex: 1,
                            width: '90%',
                            backgroundColor: 'lightblue',
                            padding: 20,
                            borderRadius: 10,
                            marginRight: 10,
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.heading, fontWeight: 'bold' }}>Perfil</Text>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={Images.Perfil}
                                style={{ width: '100%', height: "100%", aspectRatio: 1, resizeMode: 'contain', marginStart: 0 }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={handleTurnosPress}
                        style={{
                            flex: 1, width: "90%", backgroundColor: 'lightgreen', padding: 20, borderRadius: 10, marginRight: 10,
                        }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.heading, fontWeight: "bold" }}>Turnos</Text>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={Images.Turnos}
                                style={{ width: '100%', height: "100%", aspectRatio: 1, resizeMode: 'contain', marginStart: 0 }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={handlePrivadosPress} style={{ flex: 1, backgroundColor: 'lightgrey', width: "90%", padding: 20, borderRadius: 10, marginRight: 10 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.heading, fontWeight: "bold" }}>Privados</Text>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={Images.LOGO}
                                style={{ width: '100%', height: "100%", aspectRatio: 1, resizeMode: 'contain', marginStart: 0 }} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity onPress={handleLogout} style={{ flex: 1, width: "90%", backgroundColor: 'lightcoral', padding: 20, borderRadius: 10 }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.heading, fontWeight: "bold" }}>Salir Sesión</Text>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={Images.Logout}
                                style={{ width: '100%', height: "100%", aspectRatio: 1, resizeMode: 'contain', marginStart: 0 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
