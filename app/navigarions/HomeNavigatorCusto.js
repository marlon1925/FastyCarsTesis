import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ROUTES } from '../constants';
import { CHANGE_PASSWORD_NAV, DIRECTIONRESER_EDIT, DIRECTIONRESER_NAV, ENCOMI_LOG_NAV, HOMECUSTOMER, HORARIOSRESER_EDIT, HORARIOSRESER_NAV, LOGSTRAVEL, PERFIL_EDIT_NAV, PERFIL_NAV, RESERVATIONCITY_EDIT, RESERVATION_CITY_HORA_EDIT, RESERVATION_CITY_HORA_NAV, RESERVATION_EDIT, RESERVATION_NAV, RESERVATIO_ENCOMIENDA_EDIT, RESUMEN_LOG, ReserEncomiendaNav, ResumenRese_EDIT, ResumenRese_NAV, SELECT_LOG_NAV } from '../screens';
import { TravelLog } from '../screens/CustomerScreen/TravelScreen/TravelLog';
import { MapScreen } from '../common/MapScreen';
import { ReservartioCity } from '../screens/CustomerScreen/PassengerScreen/CiudadaCiudad/ReservartioCity';

const PASSENGER_STACK = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const PERFIL_PASSENGER_STACK = createNativeStackNavigator();
const TRAVEL_LOG_STACK = createNativeStackNavigator();

export const PASSENGER_NAV = () => {
  return (
    <PASSENGER_STACK.Navigator
      initialRouteName={ROUTES.HOME_CUSTUMER}
      screenOptions={{ headerShown: false }}
    >
      <PASSENGER_STACK.Screen name={ROUTES.HOME_CUSTUMER} component={HOMECUSTOMER} />
      <PASSENGER_STACK.Screen name={ROUTES.RESERVATION} component={RESERVATION_NAV} options={{ swipeEnabled: false }} />
      <PASSENGER_STACK.Screen name={ROUTES.HORARIOSRES} component={HORARIOSRESER_NAV} />
      <PASSENGER_STACK.Screen name={ROUTES.DIRECTIONRES} component={DIRECTIONRESER_NAV} />
      <PASSENGER_STACK.Screen name={ROUTES.MAPSCREEN} component={MapScreen} />
      <PASSENGER_STACK.Screen name={ROUTES.RESUMENSCREEN} component={ResumenRese_NAV} />
      <PASSENGER_STACK.Screen name={ROUTES.HOME_ENCOMIENDA} component={ReserEncomiendaNav} />
      <PASSENGER_STACK.Screen name={ROUTES.RESERVATION_CITY} component={ReservartioCity} />
      <PASSENGER_STACK.Screen name={ROUTES.RESERVATION_CITY_HORA} component={RESERVATION_CITY_HORA_NAV} />
    </PASSENGER_STACK.Navigator>
  )
}

export const PASSENGER = () => {
  return (
    <PERFIL_PASSENGER_STACK.Navigator
      initialRouteName={ROUTES.PERFIL_PASSAGER}
      screenOptions={{ headerShown: false }}>
      <PERFIL_PASSENGER_STACK.Screen name={ROUTES.PERFIL_PASSAGER} component={PERFIL_NAV} />
      <PERFIL_PASSENGER_STACK.Screen name={ROUTES.PERFIL_EDIT_PASSAGER} component={PERFIL_EDIT_NAV} />
      <PERFIL_PASSENGER_STACK.Screen name={ROUTES.CHANGE_PASSWORD} component={CHANGE_PASSWORD_NAV} />

    </PERFIL_PASSENGER_STACK.Navigator>
  )
}

export const TRAVELOG = () => {
  return (
    <TRAVEL_LOG_STACK.Navigator
      initialRouteName={ROUTES.SELECT_LOG}
      screenOptions={{ headerShown: false }}>
      <TRAVEL_LOG_STACK.Screen name={ROUTES.SELECT_LOG} component={SELECT_LOG_NAV} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.TRAVEL_LOG} component={LOGSTRAVEL} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.ENCOMI_LOG} component={ENCOMI_LOG_NAV} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.RESUMEN_LOG} component={RESUMEN_LOG} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.RESERVATION_EDIT} component={RESERVATION_EDIT} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.HORARIOSRES_EDIT} component={HORARIOSRESER_EDIT} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.DIRECTIONRES_EDIT} component={DIRECTIONRESER_EDIT} />
      <PASSENGER_STACK.Screen name={ROUTES.MAPSCREEN_EDIT} component={MapScreen} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.HOME_ENCOMIENDA_EDIT} component={RESERVATIO_ENCOMIENDA_EDIT} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.RESERVATION_CITY_EDIT} component={RESERVATIONCITY_EDIT} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.RESERVATION_CITY_HORA_EDIT} component={RESERVATION_CITY_HORA_EDIT} />
      <TRAVEL_LOG_STACK.Screen name={ROUTES.RESUMENSCREEN_EDIT} component={ResumenRese_EDIT} />
    </TRAVEL_LOG_STACK.Navigator>
  )
}



