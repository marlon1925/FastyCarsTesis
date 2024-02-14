import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import ImagenInCenter from '../../components/ImagenInCenter';
import { theme } from '../../styles/theme';
import { SimpleBody } from '../../common/SimpleBody';
import { FlexContainer } from '../../common/FlexContainer';
import { Header } from '../../common/Header';
import { InputStyle } from '../../components/InputStyle';
import ButtonStyled from '../../components/ButtonStyled';
import { IMG, ROUTES } from '../../constants';
import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";


export const Register = ({ navigation }) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, height: theme.dimensions.height, backgroundColor: theme.colors.BackGroundBlue }}
        //contentContainerStyle={{ flex: 1, }}
        >
            <View
                style={[styles.container, { marginTop: Constants.statusBarHeight }]}
            >
                <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />
                <View style={styles.cajaCabecera}>
                    <Image
                        source={IMG.logoMain}
                        style={{
                            width: 210,
                            height: 210,
                            justifyContent: "center",
                            resizeMode: "stretch",
                            // borderColor:theme.colors.ColorGrayButtom,
                            // borderWidth: 4,
                            // borderRadius: 140
                        }}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <View style={{ flex: 1, justifyContent: "center", }}>
                        <View style={{ flex: 1, justifyContent: "center", }}>
                            <Text style={{ fontFamily: theme.fonts.inter, fontSize: theme.fontSize.heading, marginBottom: 20 }}>Ingrese tu número de celular</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <InputStyle
                                placeholder={"Número de celular"}
                                label={"Número de celular"}
                                keyboardType={"numeric"}
                            />
                        </View>
                        <View style={{ flex: 2, justifyContent: "center", }}>
                            <View style={{ flex: 0.3 }}>
                                <ButtonStyled title={"Enviar codigo"} onPress={() => { navigation.navigate(ROUTES.CODE_NAV) }} color={theme.colors.ColorGrayButtom} radius={20} textSize={18} colorText={theme.colors.BackGroundWhite} />
                            </View>
                        </View>

                    </View>
                </View>
            </View>

        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.BackGroundBlue,
        width: "100%",
        height: theme.dimensions.height,
        //alignItems: 'center',
        alignItems: "center",
        justifyContent: "center",
        // padding: 10,
    },
    contentContainer: {
        flex: 1.5,
        width: "100%",
        //height: '100%',
        // alignItems: "stretch",
        padding: 30,
        justifyContent: "flex-start",
        paddingTop: "5%",
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        backgroundColor: "#ffffff",
        width: theme.dimensions.width,

    },
    cajaCabecera: {
        backgroundColor: theme.colors.blackSegunda,
        flex: 1,
        width: "100%",
        //height: '100%',
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        //justifyContent: "flex-start",
        //padding: 100,
    },
    inputContainer: {
        width: "100%",
        flex: 1,
        marginBottom: 24
    },
});