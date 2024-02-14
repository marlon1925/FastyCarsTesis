import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../styles/theme';

export const Header = ({
    factor,
    title,
    subtitle,
    icon,
    navigation,
    avatar,
}) => {
    let factor2 = factor ? factor : 6;
    let topBarHeight = Dimensions.get("screen").height;
    return (
        <View style={[styles.topBarFirst, { height: topBarHeight / factor2 }]}>
            {/* {navigation && (
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <PulpoHeader navigation={navigation} />
                </View>
            )} */}
            <View
                style={[
                    styles.topBar,
                    {
                        height: topBarHeight / factor2,
                        //backgroundColor: "blue",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        top: 10,
                    },
                ]}
            >
                {title && !subtitle && !icon && (
                    <View
                        style={{
                            //paddingHorizontal: 40,
                            width: "100%",
                            backgroundColor: theme.colors.pumpkin,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 15,
                            //bottom: 10,
                        }}
                    >
                        <StyledText
                            title
                            size={theme.fontSize.title}
                            textAlign={"center"}
                            color={"white"}
                        //marginVertical={20}
                        >
                            {title}
                        </StyledText>
                    </View>
                )}
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    topBar: {
        backgroundColor: theme.colors.BackGroundBlue,
        justifyContent: "center",
        alignItems: "flex-start",
        //maxHeight: "30%", // Ajusta el porcentaje según tus necesidades
    },
    topBarFirst: {
        backgroundColor: theme.colors.BackGroundBlue,
        justifyContent: "center",
        alignItems: "center",
        //maxHeight: "50%", // Ajusta el porcentaje según tus necesidades
    },
    containerStasticis: {
        backgroundColor: theme.colors.BackGroundBlue,
        flexDirection: "row",
        marginTop: 25,
        // paddingBottom:-100
    },
});

