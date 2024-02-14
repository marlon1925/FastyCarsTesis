import React from "react";
import { ScrollView } from "react-native";
import { StyleSheet, View } from "react-native";
import { FontsLoader } from "./FontsLoader";
import { theme } from "../styles/theme";

export const FlexContainer = ({ children }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ width: theme.dimensions.width }}
        showsVerticalScrollIndicator={false}
      >
        <FontsLoader>
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            {children}
          </View>
        </FontsLoader>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //zIndex: 3,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: 'yellow'
  },
});
