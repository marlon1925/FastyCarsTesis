import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text } from 'react-native';
import { ROUTES } from '../constants';
import { CHANGE_PASSWORD_NAV_REGISTER, CONFIRMCODE, FORMULARIO_REG, LOGIN, RECOVER, REGISTER, VERIFICATED_CODE_NAV } from '../screens';

const LoginStack = createNativeStackNavigator();


export const AuthNavigator = () => {
    return (

        <LoginStack.Navigator
            initialRouteName={ROUTES.LOGIN}
            screenOptions={{ headerShown: false }}
        >
            <LoginStack.Screen name={ROUTES.LOGIN_NAV} component={LOGIN} />
            <LoginStack.Screen name={ROUTES.REGISTER_NAV} component={REGISTER} />
            <LoginStack.Screen name={ROUTES.CODE_NAV} component={CONFIRMCODE} />
            <LoginStack.Screen name={ROUTES.FORMULARIO_REG} component={FORMULARIO_REG} />
            <LoginStack.Screen name={ROUTES.VERIFICATED_CODE} component={VERIFICATED_CODE_NAV} />
            <LoginStack.Screen name={ROUTES.RECOVER_PASS} component={RECOVER} />
            <LoginStack.Screen name={ROUTES.CHANGE_PASSWORD_REGISTER} component={CHANGE_PASSWORD_NAV_REGISTER} />
        </LoginStack.Navigator>
    )
}

