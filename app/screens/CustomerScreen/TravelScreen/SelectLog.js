import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import { theme } from '../../../styles/theme';
import { color } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsuarioContext } from '../../../context/AllContexts';
import { baseURL } from '../../../utils/helpers';
import { CustomModal } from '../../../components/CustomModal';
import axios from 'axios';
import { IMG, ROUTES } from '../../../constants';
import { Images } from '../../../utils/imagenes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { ButtonStyledImg } from '../../../components/ButtonStyledImg';

export const SelectLog = ({ navigation }) => {
    const [showModal, setShowmodal] = useState(false);
    const [selectLogService, setSelectLogService] = useState('')
    const { handleService, handleBoletoUpdate } = useContext(UsuarioContext)
    useEffect(() => {
        handleBoletoUpdate()
    }, [])

    const closeModal = () => {
        setShowmodal(!showModal)
    }
    const GetModalContent = () => {
        return (
            <>
                <View>
                    <Button textColor='white' style={styles.buttonContent}
                        onPress={() => {
                            setShowmodal(!setShowmodal)
                            handleService("Compartido")
                            navigation.navigate(ROUTES.TRAVEL_LOG)
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: "700" }}>Compartido</Text>
                    </Button>
                </View>

                <Button textColor='white' style={styles.buttonContent}
                    onPress={() => {
                        setShowmodal(!setShowmodal)
                        handleService("Privado")
                        navigation.navigate(ROUTES.TRAVEL_LOG)
                    }} >
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>Privado</Text>
                </Button>
            </>
        )
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
                <View style={styles.contentContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={{ justifyContent: "flex-start", marginBottom: 20, marginTop: 20 }}>
                            <Text style={{ fontSize: theme.fontSize.titleHeader, textAlign: "center", fontWeight: "600" }}>Seleccione el servicio para el cual desea visualizar el historial</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <ButtonStyledImg width={"100%"} height={"95%"} text={"Viajes"} fontSize={30} onPress={() => setShowmodal(true)} img={Images.Viajar} widthIcon={110} heightIcon={110} color={theme.colors.ColorGrennButtom} borderRadius={40} borderWidth={2} fontWeight={"500"} />
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <ButtonStyledImg width={"100%"} color={theme.colors.Blue} height={"95%"} text={"Encomiendas"} fontSize={30} onPress={() => {
                                handleService("Encomienda")
                                navigation.navigate(ROUTES.ENCOMI_LOG)
                            }} img={Images.Encomienda} widthIcon={110} heightIcon={110} borderRadius={40} borderWidth={2} fontWeight={"500"} />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <CustomModal isVisible={showModal} closeModal={closeModal} pregunta={"Tipo de viaje"} modalContent={<GetModalContent />} />
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
        paddingTop: "5%",
        backgroundColor: "#ffffff",
        //backgroundColor: "red",
        width: theme.dimensions.width,
    },
    icon: {
        width: 80, // Set the width and height of your image
        height: 80,
    },
    styleTex: {
        fontFamily: theme.fonts.interSBold,
        fontWeight: "700",
        margin: 9,
        fontSize: theme.fontSize.subheading
    },
    buttonContent: {
        //alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        height: 45,
        margin: 10,
        backgroundColor: theme.colors.ColorGray
    },

});