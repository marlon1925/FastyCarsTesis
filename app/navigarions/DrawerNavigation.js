import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeNavigator, PASSENGER, PASSENGER_NAV, TRAVELOG } from './HomeNavigatorCusto';
import { TravelLog } from '../screens/CustomerScreen/TravelScreen/TravelLog';
import { DrawerComponent } from '../components/DrawerComponent';
import { Icon, Image } from '@rneui/base';
import { View, Text } from 'react-native';
import { theme } from '../styles/theme';
import { ROUTES } from '../constants';
import { CustomHeader } from '../components/CustomHeader';
import { Images } from '../utils/imagenes';
import { useContext } from 'react';
import { UsuarioContext } from '../context/AllContexts';
import { PERFIL_NAV } from '../screens';

const Drawer = createDrawerNavigator();

export const DrawerNavigation = ({ navigation }) => {
  const { userInfo } = useContext(UsuarioContext)
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerComponent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "#c4c4c459",
      }}
    >
      <Drawer.Screen
        name={ROUTES.HOME_CUSTUMER}
        component={PASSENGER_NAV}
        options={{
          title: "Inicio",
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="home-sharp" type="ionicon" size={size} color={color} />
          ),
          drawerLabel: ({ focused }) => (
            <View style={{ width: "50%", right: 20 }}>
              <Text style={{ color: focused ? theme.colors.BackGroundWhite[50] : theme.colors.ColorGrayButtom[500], fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText }}>
                Inicio
              </Text>
            </View>
          ),
          header: () => <CustomHeader navigation={navigation} title={"Bienvenido " + userInfo?.pasajeroNombre} />,
        }}
      />

      <Drawer.Screen
        name={ROUTES.TRAVEL_LOG}
        component={TRAVELOG}
        options={{
          title: "Mis reservas",
          // drawerItemStyle: {
          //   borderTopWidth: 1,
          //   width: "100%",
          // },
          drawerIcon: ({ focused, color, size }) => (
            <Image
              source={Images.Reservas}
              style={{
                width: size,
                height: size,
              }}
            />
          ),
          drawerLabel: ({ focused, color, size }) => (
            <View style={{ width: "100%", right: 20 }}>
              <Text style={{ color: focused ? theme.colors.BackGroundWhite[50] : theme.colors.ColorGrayButtom[500], fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText }}>
                Mis reservas
              </Text>
            </View>
          ),
          header: () => <CustomHeader navigation={navigation} title="Historial de viajes" />,
        }}
      />
      <Drawer.Screen
        name={ROUTES.PERFIL_PASSAGER}
        component={PASSENGER}
        options={{
          title: "Inicio",
          drawerStyle: {
            backgroundColor: '#c6cbef',
            width: 245,
          },
          // drawerItemStyle: {
          //   borderTopWidth: 1,
          //   borderBottomWidth: 1,
          //   width: "100%",
          // },
          drawerIcon: ({ focused, color, size }) => (
            <Image
              source={Images.Perfil}
              style={{
                width: size,
                height: size,
              }}
            />
          ),
          drawerLabel: ({ focused }) => (
            <View style={{ width: "100%", right: 20 }}>
              <Text style={{ color: focused ? theme.colors.BackGroundWhite[50] : theme.colors.ColorGrayButtom[500], fontFamily: theme.fonts.interBold, fontSize: theme.fontSize.actionText }}>
                Perfil
              </Text>
            </View>
          ),
          header: () => <CustomHeader navigation={navigation} title={"Bienvenido " + userInfo?.pasajeroNombre} />,
        }}
      />
    </Drawer.Navigator>
  );
};
