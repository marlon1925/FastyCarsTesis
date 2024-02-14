import React from 'react';
import { View, StyleSheet, Image, StatusBar } from "react-native";
import { theme } from '../styles/theme';
import Constants from "expo-constants";
import { Images } from '../utils/imagenes';

const ImagenInCenter = ({ imageSize, marginFactor, logo }) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.BackGroundBlue,
            justifyContent: "center",
            flexDirection: "column",
            //justifyContent: "flex-start",
            alignItems: "center",
            position: "relative",
        },
        logoView: {
            zIndex: 1,
            position: "absolute",
            // width: Dimensions.get("screen").width,
            alignItems: "center",
            alignSelf: "center",
            justifyContent: 'center',
            // backgroundColor: "grey",
            // marginTop: this.props.topBarHeight ? this.props.topBarHeight / 2 : 100,
            marginTop:
                theme.dimensions.heigth / marginFactor / 2 -
                Constants.statusBarHeight,
        },
    });
    return (
        //   <View style={styles.container}>
        <View style={[styles.logoView, { marginTop: Constants.statusBarHeight }]}>
            <Image
                source={Images.LOGO}
                style={{
                    height:
                        theme.dimensions.heigth / imageSize +
                        Constants.statusBarHeight,
                    width:
                        theme.dimensions.heigth / imageSize +
                        Constants.statusBarHeight,
                    //borderRadius: 500,
                    //borderWidth: 2,
                    //borderColor: colors.platinum,
                    resizeMode: "contain",
                }}
            />
        </View>
        //   </View>
    );

}

export default ImagenInCenter;
