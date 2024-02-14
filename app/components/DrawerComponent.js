import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { Button } from "react-native-paper";
import { UsuarioContext } from "../context/AllContexts";
// import { SessionContext } from "../modules/authentication/context/SessionProvider";
import { Icon } from "@rneui/base";
import { theme } from "../styles/theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Images, Perfil } from "../utils/imagenes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ROUTES } from "../constants";
import { removeToken } from "../common/keyGeneric";

export const DrawerComponent = (props) => {
  const { navigation } = props;
  // const { userInfo } = useContext(UsuarioContext);
  // const { handleIsLoading } = useContext(UsuarioContext);
  // const { logOut } = useContext(SessionContext);
  const [isLoading, setIsLoading] = useState(false);
  const Drawer = createDrawerNavigator();

  const { handleIsConnectionActivate, handleIsLoading, userInfo } = useContext(UsuarioContext)
  //   const logOutSession = () => {
  //     handleIsLoading({ state: true, message: "Guardando las bielas" });
  //     props.navigation.closeDrawer();
  //     setTimeout(async () => {
  //       logOut();
  //       handleIsLoading({ state: false, message: null });
  //     }, 1500);
  //   };
  const handleLogout = async () => {
    try {
      handleIsLoading(true)
      console.log(props)
      await removeToken('Token');
      await removeToken('idClient')
      await removeToken('rolCliente')
      await removeToken('correoPass')
      handleIsConnectionActivate(false);
      await props.navigation.closeDrawer();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      handleIsLoading(false)
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ flex: 1, height: theme.dimensions.height / 1.05 }}>
        <View style={{ backgroundColor: theme.colors.BackGroundWhite, flex: 1 }}>
          <View style={{ flex: 2, margin: 10, borderRadius: 15, alignItems: 'center', justifyContent: "center" }}>
            <Image
              source={Images.Perfil}
              style={{
                width: 100,
                height: 100,
                resizeMode: "stretch",
                borderRadius: 50,
                marginBottom: 10
              }}
            />
            <Text style={{ color: theme.colors.ColorGrayButtom, fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.subheading }}>
              {userInfo?.pasajeroNombre + " " + userInfo?.pasajeroApellido}
            </Text>
          </View>
          <View style={{ flex: 4, paddingVertical: 5 }}>
            <DrawerItemList {...props} />
          </View>
          <View style={{ paddingVertical: 10, paddingHorizontal: 10, flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={handleLogout}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Icon
                  name="logout"
                  type="MaterialCommunityIcons"
                  size={30}
                  color={theme.colors.ColorGrayButtom}
                />
                <Text
                  color={theme.colors.ColorGrayButtom}
                  fontFamily={theme.fonts.interBold}
                  body
                >  Salir </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

