import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text } from 'react-native';
import { ROUTES } from '../constants';
import { CHANGE_PASSWORD_NAV_REGISTER, CONFIRMCODE, FORMULARIO_REG, HOME_DRIVER_NAV, LOGIN, PASSWORD_DRIVER_NAV, PERFIL_DRIVER_EDIT, PERFIL_DRIVER_NAV, PERFIL_Dr_NAV, PRIVADOS_DRIVER_NAV, RECOVER, REGISTER, RESUMEN_DRIVER_NAV, TURNOS_DRIVER_NAV, VERIFICATED_CODE_NAV } from '../screens';

const DriverStack = createNativeStackNavigator();


export const DriverNavigation = () => {
    return (

        <DriverStack.Navigator
            initialRouteName={ROUTES.HOME_DRIVERS_NAV}
            screenOptions={{ headerShown: false }}
        >
            <DriverStack.Screen name={ROUTES.HOME_DRIVERS_NAV} component={HOME_DRIVER_NAV} />
            <DriverStack.Screen name={ROUTES.PERFIL_DRIVER_NAV} component={PERFIL_DRIVER_NAV} />
            <DriverStack.Screen name={ROUTES.PERFIL_DRIVER_EDIT} component={PERFIL_DRIVER_EDIT} />
            <DriverStack.Screen name={ROUTES.TURNOS_DRIVER_NAV} component={TURNOS_DRIVER_NAV} />
            <DriverStack.Screen name={ROUTES.PRIVADOS_DRIVER_NAV} component={PRIVADOS_DRIVER_NAV} />
            <DriverStack.Screen name={ROUTES.RESUMEN_DRIVER_NAV} component={RESUMEN_DRIVER_NAV} />
            <DriverStack.Screen name={ROUTES.PASSWORD_DRIVER_NAV} component={PASSWORD_DRIVER_NAV} />
        </DriverStack.Navigator>
    )
}

