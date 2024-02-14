import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '@rneui/base';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

export const CustomHeader = ({ title }) => {
  const navigation = useNavigation();  // Utiliza useNavigation para obtener la referencia de navegación

  return (
    <View style={{ flexDirection: "row", backgroundColor: theme.colors.BackGroundBlue, height: 45 }}>
      <StatusBar backgroundColor={theme.colors.BackGroundBlue} style="light" />

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.2, alignItems: "flex-end", justifyContent: "center" }}>
          <TouchableOpacity
            style={{}}
            onPress={() => navigation.toggleDrawer()}
          >
            <View style={{ alignItems: "flex-start" }}>
              <Icon name="menu" size={35} color={'white'} type="Entypo" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              marginTop: 5, fontFamily: theme.fonts.inter, textAlign: "center", color: "white", fontSize: 16
            }}
          >
            {title}
          </Text>
        </View>
        <View style={{ alignItems: "flex-start", flex: 0.2 }}>

        </View>
      </View>
    </View>
  );
};
