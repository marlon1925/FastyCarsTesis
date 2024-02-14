import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'react-native-animatable';
import { Images } from '../utils/imagenes';
import { theme } from '../styles/theme';

export const NoConnection = () => {
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            margin: 20,
            backgroundColor: theme.colors.BackGroundWhite
        }}>
            <View style={{ flex: 2, justifyContent: "center" }}>
                <Image
                    source={Images.SinConexion}
                    style={{
                        flex: 1,
                        width: theme.dimensions.width, // Establece el ancho en undefined para que se ajuste automáticamente
                        height: theme.dimensions.width, // Establece la altura en undefined para que se ajuste automáticamente
                        resizeMode: 'contain', // Puedes ajustar resizeMode según tus preferencias (cover, contain, stretch, etc.)
                    }}
                />
            </View>

            <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <Text style={{ fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "700" }}> No dispones de conexión a Internet. Por favor, verifica tu conexión para acceder a nuestra aplicación FASTYCARS.</Text>
            </View>
        </View>
    );
}
