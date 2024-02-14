import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { theme } from '../styles/theme';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

const ButtonStyled = ({
    text,
    img,
    onPress,
    color,
    width,
    height,
    icon,
    icon2,
    potition,
    marginStart,
    iconContainer,
    disabled,
    fontSize,
    marginBottom,
    widthIcon,
    heightIcon,
    textColor,
    coloricon2,
    borderRadius,
    borderWidth,
    fontWeight,
    borderColor
}) => {
    return (
        <View style={{ width: width ? width : "70%", marginBottom: marginBottom ? marginBottom : 10 }}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
            >
                <View style={[styles.buttonContent, { borderColor: borderColor ? borderColor : "black", borderRadius: borderRadius ? borderRadius : 15, backgroundColor: color, height: height ? height : 45, borderWidth: borderWidth ? borderWidth : 1, }]}>
                    {text ?
                        <View style={{ flex: 4, alignItems: potition ? potition : "center", }}>
                            <Text style={{ fontWeight: fontWeight ? fontWeight : "normal", color: textColor ? textColor : "black", fontSize: fontSize ? fontSize : 16, marginStart: marginStart ? marginStart : 0 }} >{text}</Text>
                        </View>
                        : ""}
                </View>
                {icon ?
                    <View style={!iconContainer ? styles.iconContainer : ""}>
                        <AntDesignIcon name={icon} size={20} color="#0f0f0f" />
                    </View>

                    : ""}
            </TouchableOpacity>
        </View>
    )
}


const ButtonStyledImg = ({
    text,
    img,
}) => {
    return (
        <View style={{ width: "70%", marginBottom: 15 }}>
            <TouchableOpacity
                onPress={() => console.log("object")}
            >
                <View style={styles.buttonContent}>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ color: "white" }} >{text}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Image
                            source={img}
                            style={styles.icon}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>)
}

const styles = StyleSheet.create({
    buttonContent: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        flex: 1,
        marginLeft: 8, // Adjust the spacing as needed
        alignItems: "flex-end",
        marginRight: 15
    },

});

export default ButtonStyled;

