import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { theme } from '../styles/theme';
import { Overlay } from '@rneui/base';
import { Images } from '../utils/imagenes';
import { UsuarioContext } from '../context/AllContexts';

export const Splash = () => {
    const { isSplash } = useContext(UsuarioContext)
    return (
        <>
            {
                isSplash ?
                    < View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.BackGroundWhite, justifyContent: "center", alignItems: "center" }}>
                        <Image
                            source={Images.LOGO}
                            style={{ width: 200, height: 200, aspectRatio: 1, resizeMode: 'contain' }}
                        />
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            Estamos cargando tus datos...
                        </Text>
                    </View >
                    : null
            }
        </>
    );
}




