import { StyleSheet, View } from "react-native";
import { theme } from "../styles/theme";
import { TextInput } from "react-native-paper";
export const InputStyle = ({
    placeholder,
    label,
    errorMessage,
    keyboardType,
    nameIconRigth,
    maxLength,
    onChangeText,
    disabled,
    value,
    autoCapitalize,
}) => {
    return (
        <View style={{ marginBottom: 15 }}>
            <TextInput
                placeholder={placeholder}
                label={label}
                value={value}
                mode="outlined"
                //textColor="black"
                onChangeText={onChangeText}
                disabled={disabled}
                style={styles.inputStyle}
                autoCapitalize={autoCapitalize}
                outlineStyle={styles.inputContainer}
                keyboardType={keyboardType}
                maxLength={maxLength}
                error={errorMessage}

            />
        </View>
    );
};
export const CustomInput = ({
    placeholder,
    label,
    errorMessage,
    keyboardType,
    nameIconRigth,
    maxLength,
    onChangeText,
    editable,
    value,
    autoCapitalize,
    height,
    width,
}) => {
    return (
        <TextInput
            value={value}
            autoCapitalize={autoCapitalize ? "none" : "true"}
            label={label}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={nameIconRigth ? !showPassword : false}
            editable={editable}
            keyboardType={keyboardType ? keyboardType : null}
            errorMessage={errorMessage}
            maxLength={maxLength}
            contentStyle={styles.inputStyleCode}
            outlineStyle={styles.inputContainerCode}
            mode="outlined"
        />

    );
};
export default function StyledInput({
    value,
    onChangeText,
    label,
    icon,
    isIcon,
    mensajeError,
    keyboardType,
    maxLength,
    disabled,
    autoCapitalize,
}) {
    // const [showPassword, setShowPassword] = useState(true);
    return (
        <View style={{}}>
            <TextInput
                label={label}
                value={value}
                mode="outlined"
                //textColor="black"
                onChangeText={onChangeText}
                disabled={disabled}
                style={styles.entradaCodigo}
                autoCapitalize={autoCapitalize}
                outlineStyle={styles.marcoEntradaCodigo}
                secureTextEntry={keyboardType === "password" ? showPassword : false}
                left={
                    isIcon ? (
                        <TextInput.Icon icon={icon} iconColor={theme.colors.blackSegunda} />
                    ) : null
                }
                right={
                    keyboardType === "password" && (
                        <TextInput.Icon
                            onPress={() => setShowPassword(!showPassword)}
                            icon={showPassword ? "eye" : "eye-off"}
                            iconColor={theme.colors.blackSegunda}
                        />
                    )
                }
                keyboardType={keyboardType}
                maxLength={maxLength}
            />
            {mensajeError && (
                <HelperText type="error" visible={mensajeError}>
                    {mensajeError}
                </HelperText>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputStyle: {
        fontSize: theme.fontSize.inputText,
    },
    inputStyleCode: {
        fontSize: theme.fontSize.heading,
    },
    inputContainer: {
        backgroundColor: theme.colors.BackGroundInpu,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: theme.colors.ColorGrayButtom
    },
    inputContainerCode: {
        backgroundColor: theme.colors.BackGroundInpu,
        width: 45,
        height: 55,
        borderRadius: 15,
    },
    entradaCodigo: {
        fontFamily: "Lato_400Regular_Italic",
        fontSize: theme.fontSize.body,
        backgroundColor: theme.colors.BackGroundWhite,
        //marginTop: 5,
        color: theme.colors.grey,
        zIndex: 1,
    },
    marcoEntradaCodigo: {
        borderRadius: 15,
        borderColor: theme.colors.ColorGrayButtom,
    },
});