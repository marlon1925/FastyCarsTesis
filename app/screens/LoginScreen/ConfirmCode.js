import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SimpleBody } from '../../common/SimpleBody';
import { theme } from '../../styles/theme';
import { FlexContainer } from '../../common/FlexContainer';
import { CustomInput } from '../../components/InputStyle';
import ButtonStyled from '../../components/ButtonStyled';
import { ROUTES } from '../../constants';
import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";


export const ConfirmCode = ({ navigation }) => {
  let algo
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, height: theme.dimensions.height, backgroundColor: theme.colors.BackGroundWhite }}
    >
      <View
        style={[styles.container, { marginTop: Constants.statusBarHeight }]}
      >
        <StatusBar backgroundColor={theme.colors.BackGroundWhite} style="light" />
        <View style={styles.contentContainer}>

          <View style={{ flex: 2, justifyContent: "center" }}>
            <Text style={{ fontFamily: theme.fonts.inter, fontSize: theme.fontSize.heading, textAlign: "center" }}>Ingresa el código que fue enviado a tu celular</Text>
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <CustomInput
                placeholder="0"
                onChangeText={algo}
                keyboardType={"numeric"}
                value={algo}
              />
              <CustomInput
                placeholder="0"
                onChangeText={algo}
                keyboardType={"numeric"}
                value={algo}
              />
              <CustomInput
                placeholder="0"
                onChangeText={algo}
                keyboardType={"numeric"}
                value={algo}
              />
              <CustomInput
                placeholder="0"
                onChangeText={algo}
                keyboardType={"numeric"}
                value={algo}
              />
            </View>
          </View>

          <View style={{ flex: 2, justifyContent: "flex-start", }}>
            <View style={{ flex: 0.4 }}>
              <ButtonStyled title={"Verificar"} onPress={() => { navigation.navigate(ROUTES.FORMULARIO_REG) }} borderColor={theme.colors.BackGroundBlue} borderWidth={3} textSize={18} colorText={theme.colors.BackGroundBlue} />
            </View>

            <Text style={{ fontFamily: theme.fonts.inter, fontSize: theme.fontSize.subtitle }}>No recibí ningún código <Text style={{ textDecorationLine: 'underline', fontStyle: "italic" }}>Reenviar</Text></Text>
          </View>

          <View style={{ flex: 3, justifyContent: "center" }}>
            <View style={{ flex: 0.25 }}>
              <ButtonStyled title={"Cambie el número"} onPress={() => { navigation.navigate(ROUTES.REGISTER_NAV) }} color={theme.colors.ColorGrayButtom} radius={20} textSize={18} colorText={theme.colors.BackGroundWhite} />
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
    backgroundColor: theme.colors.BackGroundWhite,
    width: "100%",
    height: theme.dimensions.height,
    //alignItems: 'center',
    alignItems: "center",
    justifyContent: "center",
    // padding: 10,
  },
  contentContainer: {
    flex: 2,
    width: "100%",
    //height: '100%',
    // alignItems: "stretch",
    padding: 30,
    justifyContent: "flex-start",
    paddingTop: "5%",
    backgroundColor: theme.colors.BackGroundWhite,
    width: theme.dimensions.width,

  },
})
