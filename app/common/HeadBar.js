import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IMG } from "../constants";
import { theme } from "../styles/theme";
import { Divider, Image } from "@rneui/base";
import { Icon, Text } from "react-native-paper";

export const HeadbarHome = ({ navigation }) => {
    const { userInfo } = useContext(UsuarioContext);


    return (
        <View style={{ flex: 1, marginVertical: 5 }}>
            <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                    style={{}}
                    onPress={() => navigation.toggleDrawer()}
                >
                    <View style={{ padding: 1 }}>
                        <Icon name="menu" size={35} color={'lack'} type="Entypo" />
                    </View>
                </TouchableOpacity>

                <View
                    style={{
                        //backgroundColor: "red",
                        flex: 10,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        indications
                        style={{
                            flex: 1, marginTop: 5, fontFamily: theme.fonts.inter,
                        }}
                    >
                        Bienvenido {userInfo?.pasajeroApellido}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={console.log("Notificaciones")}
                    style={{
                        //backgroundColor: "green",
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Icon
                        name="bell"
                        size={22}
                        type="ant-design"
                    />
                </TouchableOpacity>
            </View>
            <Divider style={{ marginBottom: 5 }} />


            {/* <Divider style={{ marginTop: 5 }} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    headbarHome: {
        flex: 1,
        borderColor: theme.colors.ColorGrayButtom,
        //backgroundColor: "orange",
        marginBottom: 10,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // paddingVertical: 7,
    },
})