import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../styles/theme";

const ButtonStyleds = ({
    text,
    img,
}) => {
    return (
        <View style={{ width: "70%", marginBottom: 18 }}>
            <TouchableOpacity
                onPress={() => console.log("object")}
            >
                <View style={styles.buttonContent}>
                    <View style={{ flex: 4, alignItems: "center", }}>
                        <Text style={{ color: "#0f0f0f", fontSize: 18 }} >{text}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Image
                            source={img}
                            style={styles.icon}
                        />
                    </View>

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
        borderRadius: 15,
        height: 45,
        backgroundColor: theme.colors.BackGroundInpu,
        borderColor: '#0f0f0f',
        borderWidth: 2,
    },
    iconContainer: {
        flex: 1,
        marginLeft: 8, // Adjust the spacing as needed
        alignItems: "flex-end",
        marginRight: 15
    },
    icon: {
        width: 38, // Set the width and height of your image
        height: 38,
    },
});

export default ButtonStyleds;
