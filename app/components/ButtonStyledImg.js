import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';


export const ButtonStyledImg = ({
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
                <View style={[styles.buttonContent, {
                    borderRadius: borderRadius ? borderRadius : 15, backgroundColor: color, height: height ? height : 45, borderWidth: borderWidth ? borderWidth : 1, borderColor: borderColor ? borderColor : 'black',
                }]}>
                    {text ?
                        <View style={{ flex: 4, alignItems: potition ? potition : "center", }}>
                            <Text style={{ fontWeight: fontWeight ? fontWeight : "normal", color: textColor ? textColor : "black", fontSize: fontSize ? fontSize : 16, marginStart: marginStart ? marginStart : 0 }} >{text}</Text>
                        </View>
                        : ""}

                    {img ?
                        <View style={!iconContainer ? styles.iconContainer : iconContainer}>
                            <Image
                                source={img}
                                style={{
                                    width: widthIcon ? widthIcon : 38, // Set the width and height of your image
                                    height: heightIcon ? heightIcon : 38,
                                }}
                            />

                        </View>
                        : ""}
                    {icon ?
                        <View style={!iconContainer ? styles.iconContainer : ""}>
                            <AntDesignIcon name={icon} size={20} color="#0f0f0f" />
                        </View>

                        : ""}
                    {icon2 ?
                        <View style={!iconContainer ? styles.iconContainer : ""}>
                            <MaterialCommunityIcon name={icon2} size={20} color={coloricon2 ? coloricon2 : "#0f0f0f"} />
                        </View>

                        : ""}
                </View>
            </TouchableOpacity>
        </View>
    )
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

