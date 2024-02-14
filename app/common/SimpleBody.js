import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import Constants from 'expo-constants'

export const SimpleBody = ({ children, withoutBorders, marginTop }) => {
  return (
    <View style={[styles.container, { marginTop: Constants.statusBarHeight }]}>
      <View
        style={[
          styles.simpleBody,
          {
            borderTopLeftRadius: withoutBorders ? 0 : 30,
            borderTopRightRadius: withoutBorders ? 0 : 30,
            marginTop: marginTop ? marginTop / 2 : 0,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

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
  simpleBody: {
    flex: 1,
    backgroundColor: "white",
    //zIndex: 2,
    //height:theme.dimensions.heigth
  },
});
