import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';

export const ScreenGPS = () => {
    const [locationServiceEnabled, setLocationServiceEnabled] = useState({
        status: "denied",
        coordinates: null,
    });
    const saveLastScreenName = async () => {
        await AsyncStorage.setItem("lastScreen", "GPS");
    };
    const backAction = (navigation) => {
        // Personaliza este bloque según tus necesidades
        console.log("Botón de retroceso presionado");
        if (navigation.canGoBack()) {
            navigation.goBack(); // Retrocede en la pila de navegación si es posible
            return true; // Evita que la aplicación se cierre
        } else {
            // Puedes agregar lógica adicional o dejarlo vacío si no quieres ningún comportamiento específico
            return false; // Permite que la aplicación se cierre
        }
    };

    useFocusEffect(
        useCallback(() => {
            VerifyPermissions();
            BackHandler.addEventListener("hardwareBackPress", () =>
                backAction(navigation)
            );
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", () =>
                    backAction(navigation)
                );
            };
        }, [])
    );
    return (
        <View>
            <Text></Text>
        </View>
    );
}

