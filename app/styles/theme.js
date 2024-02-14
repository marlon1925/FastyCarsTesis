import { Dimensions, PixelRatio } from "react-native";
let screen = Dimensions.get("window");
let widthScreen = screen.width;
let heightScreen = screen.height;

export const theme = {
    heightBar: {
        heightSize: heightScreen * 0.06,
    },
    screenSize: {
        width: widthScreen,
        height: heightScreen,
    },
    dimensions: {
        width: widthScreen - widthScreen * 0.055 * 2,
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    colors: {
        BackGroundBlue: "#43A047", // Verde
        Blue: "#4099e6", // Azul oscuro
        BackGroundWhite: "#FFFFFF",
        ColorGrayButtom: "#757575",
        ColorGray: "#9E9E9E",
        ColorGrennButtom: "#66BB6A", // Verde para botones
        BackGroundInpu: "#F5F5F5",
        ColorDisabled: "#BDBDBD",
        ColorRed: "#E57373",
    },
    separation: {
        headSeparation: heightScreen * 0.033,
        horizontalSeparation: widthScreen * 0.055,
        userHorizontalSeparation: widthScreen * 0.035,
        cardSeparation: widthScreen * 0.43,
        cardheight: heightScreen * 0.28,
    },
    fontSize: {
        title: 30,
        titleHeader: 20,
        subtitle: 18,
        titleNotification: 15,
        body: 14,
        actionText: 16,
        inputText: 14,
        heading: 25,
        subheading: 18,
        small: 12.5,
        smaller: 11.5,
    },
    fonts: {
        main: "System",
        itim: "Itim_400Regular",
        inter: "Inter_400Regular",
        interBold: "Inter_600SemiBold",
        interSBold: "Inter_800Bold",

    },
    buttonSize: {
        lg: 240,
        df: 190,
        sm: 150,
        tn: 100,
    },

}